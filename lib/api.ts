/**
 * @file This file provides data for the UI.
 * It uses mock data and simulates an async API call.
 */
import { experiences as mockExperiences, projects as mockProjects } from "@/lib/data"
import type { Experience, Project } from "./types"

/**
 * Fetches all experiences from the mock data source.
 * @returns {Promise<Experience[]>} A promise that resolves to an array of experiences.
 */
export async function getExperiences(): Promise<Experience[]> {
  return Promise.resolve(mockExperiences)
}

/**
 * Fetches all projects from the mock data source.
 * @returns {Promise<Project[]>} A promise that resolves to an array of projects.
 */
export async function getProjects(): Promise<Project[]> {
  return Promise.resolve(mockProjects)
}

/**
 * Fetches a single project by its ID from the mock data source.
 * @param {string} id - The ID of the project to fetch.
 * @returns {Promise<Project | null>} A promise that resolves to the project or null if not found.
 */
export async function getProjectById(id: string): Promise<Project | null> {
  const project = mockProjects.find((p) => p.id === id) || null
  return Promise.resolve(project)
}
