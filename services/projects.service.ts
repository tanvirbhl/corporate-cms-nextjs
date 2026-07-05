import { connectToDatabase } from "@/lib/mongoose";
import Project from "@/models/Project";

// Fetch all published projects
export async function getAllProjects() {
  try {
    await connectToDatabase();
    const projects = await Project.find({ isPublished: true })
      .sort({ createdAt: -1 })
      .lean(); // .lean() strips heavy Mongoose metadata
      
    return JSON.parse(JSON.stringify(projects)); // Serialize for Next.js
  } catch (error) {
    console.error("Error fetching projects:", error);
    return [];
  }
}

// Fetch a single project by its slug
export async function getProjectBySlug(slug: string) {
  try {
    await connectToDatabase();
    const project = await Project.findOne({ slug, isPublished: true }).lean();
    
    return project ? JSON.parse(JSON.stringify(project)) : null;
  } catch (error) {
    console.error("Error fetching project by slug:", error);
    return null;
  }
}