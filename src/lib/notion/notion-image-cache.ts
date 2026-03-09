// Downloads Notion-hosted images at build time so they ship with the static
// export and never expire. Notion's S3 signed URLs are only valid for ~1 hour;
// by persisting them to public/notion-images/ we eliminate that constraint.

import fs from "fs"
import path from "path"
import crypto from "crypto"
import type { ExtendedRecordMap } from "notion-types"

const IMAGE_DIR = path.join(process.cwd(), "public", "notion-images")

const NOTION_HOST_PATTERNS = [
  "prod-files-secure.s3.us-west-2.amazonaws.com",
  "s3.us-west-2.amazonaws.com",
  "file.notion.so",
]

const IMAGE_EXTENSIONS = new Set([
  ".jpg", ".jpeg", ".png", ".gif", ".webp", ".svg", ".ico", ".bmp", ".avif",
])

// In-flight / already-resolved promises keyed by stable hash so concurrent
// build workers never download the same image twice.
const inflightCache = new Map<string, Promise<string>>()

function isNotionHostedUrl(url: string): boolean {
  if (!url || typeof url !== "string") return false
  return NOTION_HOST_PATTERNS.some((pattern) => url.includes(pattern))
}

function stableHash(url: string): string {
  const urlPath = url.split("?")[0]
  return crypto.createHash("md5").update(urlPath).digest("hex")
}

function inferExtension(url: string): string {
  try {
    const urlPath = new URL(url).pathname
    const ext = path.extname(urlPath).toLowerCase()
    if (ext && IMAGE_EXTENSIONS.has(ext)) return ext
  } catch { /* ignore */ }
  return ".png"
}

const NOTION_API_HEADERS = () => {
  const token = process.env.NOTION_TOKEN
  if (!token) return null
  return {
    "Authorization": `Bearer ${token}`,
    "Notion-Version": "2022-06-28",
  } as const
}

// file.notion.so URLs require a session cookie we don't have. Extract the
// block ID from the URL and ask the official Notion API for a fresh S3 URL.
async function getFreshUrlViaApi(fileNotionUrl: string): Promise<string | null> {
  const headers = NOTION_API_HEADERS()
  if (!headers) return null

  try {
    const parsed = new URL(fileNotionUrl)
    const blockId = parsed.searchParams.get("id")
    if (!blockId) return null

    // Try blocks endpoint first (works for image blocks)
    const blockRes = await fetch(`https://api.notion.com/v1/blocks/${blockId}`, { headers })
    if (blockRes.ok) {
      const block = await blockRes.json()
      if (block.type === "image") {
        return block.image?.file?.url || block.image?.external?.url || null
      }
      // child_page blocks don't carry cover data – fall through to pages endpoint
    }

    // Try pages endpoint (covers are only on the page object, not the block)
    const pageRes = await fetch(`https://api.notion.com/v1/pages/${blockId}`, { headers })
    if (pageRes.ok) {
      const page = await pageRes.json()
      return page.cover?.file?.url || page.cover?.external?.url || null
    }

    return null
  } catch {
    return null
  }
}

async function downloadImage(url: string): Promise<Buffer | null> {
  try {
    const response = await fetch(url)
    if (!response.ok) return null
    return Buffer.from(await response.arrayBuffer())
  } catch {
    return null
  }
}

async function cacheNotionImageInner(url: string): Promise<string> {
  const hash = stableHash(url)
  const ext = inferExtension(url)
  const filename = `${hash}${ext}`
  const localPath = path.join(IMAGE_DIR, filename)
  const publicPath = `/notion-images/${filename}`

  if (fs.existsSync(localPath)) return publicPath

  fs.mkdirSync(IMAGE_DIR, { recursive: true })

  let buffer = await downloadImage(url)

  if (!buffer && url.includes("file.notion.so")) {
    const freshUrl = await getFreshUrlViaApi(url)
    if (freshUrl) {
      buffer = await downloadImage(freshUrl)
    }
  }

  if (!buffer) {
    console.warn(`[notion-image-cache] Could not download: ${url}`)
    return url
  }

  fs.writeFileSync(localPath, buffer)
  return publicPath
}

export function cacheNotionImage(url: string): Promise<string> {
  if (!isNotionHostedUrl(url)) return Promise.resolve(url)

  const hash = stableHash(url)
  const existing = inflightCache.get(hash)
  if (existing) return existing

  const promise = cacheNotionImageInner(url)
  inflightCache.set(hash, promise)
  return promise
}

// ---------------------------------------------------------------------------
// RecordMap processing – rewrites every Notion-hosted URL inside the map so
// react-notion-x renders local images instead of expiring signed URLs.
// ---------------------------------------------------------------------------

// Safely read a nested property from an opaque block object
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyBlock = Record<string, any>

function blockValue(wrapper: unknown): AnyBlock | null {
  const w = wrapper as { value?: AnyBlock } | undefined
  return w?.value ?? null
}

export async function processRecordMapImages(
  recordMap: ExtendedRecordMap
): Promise<ExtendedRecordMap> {
  const urlSet = new Set<string>()

  // 1. signed_urls map (primary source react-notion-x checks)
  if (recordMap.signed_urls) {
    for (const url of Object.values(recordMap.signed_urls)) {
      if (isNotionHostedUrl(url)) urlSet.add(url)
    }
  }

  // 2. Block-level image sources
  if (recordMap.block) {
    for (const wrapper of Object.values(recordMap.block)) {
      const block = blockValue(wrapper)
      if (!block) continue

      if (block.type === "image") {
        const sourceUrl: unknown = block.properties?.source?.[0]?.[0]
        if (typeof sourceUrl === "string" && isNotionHostedUrl(sourceUrl)) {
          urlSet.add(sourceUrl)
        }
        const displaySource: unknown = block.format?.display_source
        if (typeof displaySource === "string" && isNotionHostedUrl(displaySource)) {
          urlSet.add(displaySource)
        }
      }

      if (block.type === "page") {
        const pageCover: unknown = block.format?.page_cover
        if (typeof pageCover === "string" && isNotionHostedUrl(pageCover)) {
          urlSet.add(pageCover)
        }
      }
    }
  }

  if (urlSet.size === 0) return recordMap

  // Download all unique URLs in parallel
  const urlArray = [...urlSet]
  const localPaths = await Promise.all(urlArray.map(cacheNotionImage))
  const urlMap = new Map<string, string>()
  urlArray.forEach((original, i) => urlMap.set(original, localPaths[i]))

  const newRecordMap: ExtendedRecordMap = { ...recordMap }

  // Track which block IDs got a locally-cached signed URL so we can strip
  // space_id from those blocks (react-notion-x calls `new URL(src)` when
  // space_id is present, and local paths aren't valid URL constructor input).
  const localizedBlockIds = new Set<string>()

  // Replace in signed_urls
  if (newRecordMap.signed_urls) {
    const newSignedUrls = { ...newRecordMap.signed_urls }
    for (const [key, url] of Object.entries(newSignedUrls)) {
      const replacement = urlMap.get(url)
      if (replacement) {
        newSignedUrls[key] = replacement
        localizedBlockIds.add(key)
      }
    }
    newRecordMap.signed_urls = newSignedUrls
  }

  // Replace in blocks
  if (newRecordMap.block) {
    const newBlocks = { ...newRecordMap.block }

    for (const [blockId, wrapper] of Object.entries(newBlocks)) {
      const block = blockValue(wrapper)
      if (!block) continue

      let mutated = false

      if (block.type === "image") {
        const sourceUrl: unknown = block.properties?.source?.[0]?.[0]
        if (typeof sourceUrl === "string" && urlMap.has(sourceUrl)) {
          block.properties = {
            ...block.properties,
            source: [[urlMap.get(sourceUrl)!]],
          }
          localizedBlockIds.add(blockId)
          mutated = true
        }
        if (block.format?.display_source && urlMap.has(block.format.display_source)) {
          block.format = { ...block.format, display_source: urlMap.get(block.format.display_source) }
          mutated = true
        }
      }

      if (block.type === "page") {
        if (block.format?.page_cover && urlMap.has(block.format.page_cover)) {
          block.format = { ...block.format, page_cover: urlMap.get(block.format.page_cover) }
          mutated = true
        }
      }

      // Drop space_id on any block whose URL we replaced with a local path
      if (localizedBlockIds.has(blockId) && block.space_id) {
        delete block.space_id
        mutated = true
      }

      if (mutated) {
        newBlocks[blockId] = { ...wrapper, value: block } as typeof wrapper
      }
    }

    newRecordMap.block = newBlocks
  }

  return newRecordMap
}
