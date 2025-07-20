import { getAllBlogPosts } from "@/lib/notion"

export async function GET() {
  const posts = await getAllBlogPosts()
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://localhost:3000"
  const authorEmail = process.env.AUTHOR_EMAIL || "madhav@example.com"
  
  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Madhav Lodha - Blog</title>
    <description>Thoughts on software engineering, web development, and technology</description>
    <link>${baseUrl}/blog</link>
    <language>en-us</language>
    <managingEditor>${authorEmail} (Madhav Lodha)</managingEditor>
    <webMaster>${authorEmail} (Madhav Lodha)</webMaster>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${baseUrl}/blog/rss.xml" rel="self" type="application/rss+xml"/>
    ${posts
      .map(
        (post) => `
    <item>
      <title><![CDATA[${post.title}]]></title>
      <description><![CDATA[${post.description || "Read more on Madhav Lodha's blog"}]]></description>
      <link>${baseUrl}/blog/${post.slug}</link>
      <guid isPermaLink="true">${baseUrl}/blog/${post.slug}</guid>
      <pubDate>${new Date(post.publishedAt).toUTCString()}</pubDate>
      <author>${authorEmail} (Madhav Lodha)</author>
      ${post.category ? `<category><![CDATA[${post.category}]]></category>` : ""}
      ${post.tags
        .map((tag) => `<category><![CDATA[${tag}]]></category>`)
        .join("")}
    </item>`
      )
      .join("")}
  </channel>
</rss>`

  return new Response(rss, {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
    },
  })
}