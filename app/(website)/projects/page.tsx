import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { getAllProjects } from "@/services/projects.service";
import { FadeInView } from "@/components/common/FadeInView";
import { CallToAction } from "@/components/sections/home/CallToAction";

export const metadata = {
  title: "Our Work & Case Studies | Skyland",
  description: "Explore our portfolio of enterprise digital transformations and modern software architecture.",
};

export default async function ProjectsIndexPage() {
  // Fetch data directly from MongoDB securely on the server
  const projects = await getAllProjects();

  return (
    <main className="flex flex-col min-h-screen pt-28 pb-0 X">
      
      {/* Header Section */}
      <section className="  container mx-auto px-4 md:px-6 mb-16">
        <FadeInView>
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-6xl font-bold text-slate-900 tracking-tight mb-6">
              Our Latest Work.
            </h1>
            <p className="text-xl text-slate-600 leading-relaxed">
              Explore how we've helped enterprises scale their operations, modernize their infrastructure, and build the future of their business.
            </p>
          </div>
        </FadeInView>
      </section>

      {/* Projects Grid */}
      <section className="  container mx-auto px-4 md:px-6 mb-24">
        {projects.length === 0 ? (
          <div className="text-center py-24 bg-slate-50 rounded-2xl border border-slate-100">
            <h3 className="text-xl font-semibold text-slate-900">Check back soon</h3>
            <p className="text-slate-500 mt-2">We are currently updating our portfolio.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project: any, index: number) => (
              <FadeInView key={project._id} delay={index * 0.1}>
                <Link 
                  href={`/projects/${project.slug}`}
                  className="group block h-full bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-xl hover:border-blue-200 transition-all duration-300 flex flex-col"
                >
                  {/* Image Container */}
                  <div className="relative w-full aspect-[4/3] overflow-hidden bg-slate-100">
                    <Image
                      src={project.coverImage || "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop"}
                      alt={project.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-slate-900 font-semibold text-xs rounded-full shadow-sm">
                        {project.category}
                      </span>
                    </div>
                  </div>

                  {/* Content Container */}
                  <div className="p-6 flex flex-col flex-grow">
                    <h2 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-blue-600 transition-colors">
                      {project.title}
                    </h2>
                    <p className="text-slate-600 text-sm leading-relaxed mb-6 flex-grow line-clamp-3">
                      {project.shortSummary}
                    </p>
                    <div className="flex items-center text-blue-600 font-semibold text-sm mt-auto">
                      View Case Study
                      <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </Link>
              </FadeInView>
            ))}
          </div>
        )}
      </section>

      <CallToAction />
    </main>
  );
}