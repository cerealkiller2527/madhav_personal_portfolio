import { NextRequest, NextResponse } from "next/server"
import { getProjectById } from "@/lib/projects/project-queries"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    console.log(`🔍 API: Fetching project with ID: ${id}`)
    
    if (!id) {
      console.log("❌ API: No project ID provided")
      return NextResponse.json(
        { error: "Project ID is required" },
        { status: 400 }
      )
    }

    // Check if Notion projects are configured
    const useNotionProjects = process.env.NOTION_TOKEN && process.env.NOTION_PROJECTS_DATABASE_ID
    console.log(`🔧 API: Notion configured: ${!!useNotionProjects}`)
    console.log(`🔧 API: Has NOTION_TOKEN: ${!!process.env.NOTION_TOKEN}`)
    console.log(`🔧 API: Has PROJECTS_DB_ID: ${!!process.env.NOTION_PROJECTS_DATABASE_ID}`)
    
    if (!useNotionProjects) {
      console.log("❌ API: Notion projects not configured")
      return NextResponse.json(
        { error: "Notion projects not configured" },
        { status: 404 }
      )
    }

    // Fetch the project from Notion
    console.log(`📡 API: Calling getProjectById(${id})`)
    const project = await getProjectById(id)
    console.log(`📡 API: getProjectById result:`, project ? "Found project" : "No project found")
    
    if (!project) {
      console.log(`❌ API: Project not found in Notion: ${id}`)
      return NextResponse.json(
        { error: "Project not found" },
        { status: 404 }
      )
    }

    console.log(`✅ API: Successfully returning project: ${id}`)
    return NextResponse.json({ 
      success: true,
      project 
    })
    
  } catch (error) {
    console.error("❌ API: Error fetching project:", error)
    return NextResponse.json(
      { error: "Failed to fetch project", details: error.message },
      { status: 500 }
    )
  }
}