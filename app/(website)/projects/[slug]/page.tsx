import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getProjectBySlug, getAllProjects } from "@/services/projects.service";
import { FadeInView } from "@/components/common/FadeInView";
import { CallToAction } from "@/components/sections/home/CallToAction";

// 1. Generate Static Params for SEO & Fast Loading
export async function generateStaticParams() {
  const projects = await getAllProjects();
  return projects.map((project: any) => ({
    slug: project.slug,
  }));
}

// 2. Generate Dynamic SEO Meta Tags
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);

  if (!project) return { title: "Project Not Found" };

  return {
    title: `${project.title} | Skyland Case Study`,
    description: project.shortSummary,
    openGraph: {
      images: [project.coverImage],
    },
  };
}

// 3. The Page Component
export default async function ProjectDetailsPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  return (
    <main className="flex flex-col min-h-screen pt-28 pb-0">
      <div className="container mx-auto px-4 md:px-6 py-12 lg:py-16">
        
        {/* Back Button */}
        <Link 
          href="/projects"
          className="inline-flex items-center text-slate-500 hover:text-blue-600 font-medium mb-10 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to all projects
        </Link>

        {/* Project Header */}
        <FadeInView>
          <div className="max-w-4xl mb-12">
            <div className="mb-6">
              <span className="px-3 py-1 bg-blue-50 text-blue-700 font-semibold text-sm rounded-full border border-blue-100">
                {project.category}
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-slate-900 mb-6 leading-tight">
              {project.title}
            </h1>
          </div>
        </FadeInView>

        {/* Hero Image */}
        <FadeInView delay={0.1}>
          <div className="relative w-full aspect-[21/9] md:aspect-[21/8] rounded-3xl overflow-hidden mb-16 shadow-2xl bg-slate-100">
            <Image
              src={project.coverImage}
              alt={project.title}
              fill
              className="object-cover"
              priority
            />
          </div>
        </FadeInView>

        {/* Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16 mb-20">
          
          {/* Main Content (Left) */}
          <div className="lg:col-span-2 space-y-8">
            <FadeInView direction="up">
              <h2 className="text-3xl font-bold text-slate-900 mb-6">
                Project Overview
              </h2>
              <p className="text-lg text-slate-600 leading-relaxed whitespace-pre-wrap">
                {project.shortSummary}
              </p>
            </FadeInView>
            
            {/* Future expansion: When you add more rich text fields (Challenge, Solution) to the CMS, they will go here! */}
          </div>

          {/* Sidebar (Right) */}
          <div className="lg:col-span-1">
            <FadeInView direction="left">
              <div className="sticky top-32 space-y-8">
                {/* Technologies Block */}
                {project.technologies && project.technologies.length > 0 && (
                  <div className="bg-slate-50 border border-slate-200 rounded-2xl p-8">
                    <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">
                      Technologies Used
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {project.technologies.map((tech: string, index: number) => (
                        <span
                          key={index}
                          className="px-3 py-1.5 bg-white text-slate-700 font-medium text-sm rounded-lg border border-slate-200 shadow-sm"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </FadeInView>
          </div>
        </div>
      </div>

      <CallToAction />
    </main>
  );
}