import { NextResponse } from "next/server"
import { getAllProjects } from "@/lib/notion"

async function handleProjectsRequest() {
  try {
    // Check if Notion projects are configured
    const useNotionProjects = process.env.NOTION_TOKEN && process.env.NOTION_PROJECTS_DATABASE_ID
    
    if (!useNotionProjects) {
      return NextResponse.json(
        { error: "Notion projects not configured" },
        { status: 404 }
      )
    }

    // Fetch all projects from Notion
    const projects = await getAllProjects()
    
    return NextResponse.json({ 
      success: true,
      projects: projects || [],
      count: projects?.length || 0
    })
    
  } catch (_error) {
    return NextResponse.json(
      { error: "Failed to fetch projects" },
      { status: 500 }
    )
  }
}

export async function GET() {
  return handleProjectsRequest()
}

export async function HEAD() {
  return handleProjectsRequest()
}