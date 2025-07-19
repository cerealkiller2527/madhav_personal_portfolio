import { NextRequest, NextResponse } from "next/server"
import { getProjectById } from "@/lib/projects/project-queries"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    
    if (!id) {
      return NextResponse.json(
        { error: "Project ID is required" },
        { status: 400 }
      )
    }

    // Check if Notion projects are configured
    const useNotionProjects = process.env.NOTION_TOKEN && process.env.NOTION_PROJECTS_DATABASE_ID
    
    if (!useNotionProjects) {
      return NextResponse.json(
        { error: "Notion projects not configured" },
        { status: 404 }
      )
    }

    // Fetch the project from Notion
    const project = await getProjectById(id)
    
    if (!project) {
      return NextResponse.json(
        { error: "Project not found" },
        { status: 404 }
      )
    }

    return NextResponse.json({ 
      success: true,
      project 
    })
    
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch project", details: error.message },
      { status: 500 }
    )
  }
}