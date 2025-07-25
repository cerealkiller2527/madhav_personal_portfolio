#!/usr/bin/env node

import { config } from 'dotenv'
import { Client } from '@notionhq/client'
import { NotionAPI } from 'notion-client'

config()

const notion = new Client({ auth: process.env.NOTION_TOKEN })
const notionApi = new NotionAPI()

function extractTextFromRecordMap(recordMap) {
  const textContent = []
  
  if (recordMap.block) {
    Object.values(recordMap.block).forEach(blockWrapper => {
      const block = blockWrapper?.value
      if (!block?.properties) return
      
      const textProperties = ['title', 'rich_text', 'caption']
      for (const prop of textProperties) {
        if (block.properties[prop] && Array.isArray(block.properties[prop])) {
          const text = block.properties[prop]
            .map(item => Array.isArray(item) ? String(item[0] || '') : String(item || ''))
            .join('')
            .trim()
          
          if (text) textContent.push(text)
        }
      }
    })
  }
  
  return textContent.join(' ').trim()
}

function calculateReadingTime(content) {
  if (!content) return 1
  const words = content.trim().split(/\s+/).filter(word => word.length > 0)
  return Math.max(1, Math.ceil(words.length / 160))
}

async function updateReadingTimes() {
  try {
    if (!process.env.NOTION_DATABASE_ID || !process.env.NOTION_TOKEN) return

    const response = await notion.databases.query({
      database_id: process.env.NOTION_DATABASE_ID,
      filter: { property: 'Published', checkbox: { equals: true } }
    })

    let updated = 0
    
    for (const page of response.results) {
      try {
        if (page.properties['Reading Time']?.number > 0) continue

        const recordMap = await notionApi.getPage(page.id)
        const textContent = extractTextFromRecordMap(recordMap)
        const readingTime = calculateReadingTime(textContent)

        await notion.pages.update({
          page_id: page.id,
          properties: { 'Reading Time': { number: readingTime } }
        })

        updated++
        await new Promise(resolve => setTimeout(resolve, 300))
      } catch {
        continue
      }
    }

    if (updated > 0) console.log(`Updated ${updated} posts`)

  } catch {}
}

updateReadingTimes().then(() => process.exit(0)).catch(() => process.exit(0))