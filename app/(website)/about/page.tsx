"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { FadeInView } from "@/components/common/FadeInView";
import { Target, Compass } from "lucide-react";

export default function AboutPage() {
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAbout = async () => {
      try {
        const res = await axios.get("/api/about");
        if (res.data.success) {
          setData(res.data.data);
        }
      } catch (error) {
        console.error("Failed to load About page");
      } finally {
        setIsLoading(false);
      }
    };
    fetchAbout();
  }, []);

  if (isLoading || !data) return <div className="min-h-screen pt-36 bg-slate-50" />;

  return (
    <main className="flex flex-col min-h-screen  pb-20 bg-slate-50">
      
      {/* 1. HERO SECTION */}
     {/* 1. HERO SECTION */}
      {data.showHero && (
        <section className="relative pt-12 pb-24 lg:pt-20 lg:pb-32 overflow-hidden z-0">
          
          {/* Modern Background Glows */}
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
            <div className="absolute -top-[20%] -right-[10%] w-[50%] h-[50%] rounded-full bg-blue-100/40 blur-[100px]" />
            <div className="absolute top-[30%] -left-[10%] w-[40%] h-[40%] rounded-full bg-indigo-100/40 blur-[100px]" />
          </div>

          <div className="container mx-auto px-4 md:px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
              
              {/* Text Content (Left Side) */}
              <FadeInView direction="up" className="order-2 lg:order-1">
                <div className="max-w-2xl">
                  
                  {/* Decorative Pill Badge */}
                  <div className="inline-flex items-center space-x-2 rounded-full border border-blue-200 bg-blue-50/50 px-4 py-1.5 mb-6 backdrop-blur-sm">
                    <span className="flex h-2 w-2 rounded-full bg-blue-600 animate-pulse"></span>
                    <span className="text-sm font-bold tracking-wider text-blue-700 uppercase">
                      Who We Are
                    </span>
                  </div>
                  
                  {/* Headline */}
                  <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 mb-8 leading-[1.15]">
                    {data.heroTitle}
                  </h1>
                  
                  {/* Minimalist Divider */}
                  <div className="w-20 h-1.5 bg-gradient-to-r from-blue-600 to-indigo-500 rounded-full mb-8"></div>
                  
                  {/* Description */}
                  <p className="text-lg md:text-xl text-slate-600 leading-relaxed whitespace-pre-wrap font-light">
                    {data.heroDescription}
                  </p>
                </div>
              </FadeInView>

              {/* Image Composition (Right Side) */}
              <FadeInView direction="left" className="order-1 lg:order-2">
                <div className="relative w-full max-w-lg mx-auto lg:max-w-none">
                  
                  {/* Tilted Background Frame */}
                  <div className="absolute -inset-4 md:-inset-6 bg-gradient-to-tr from-blue-100 to-indigo-50 rounded-[2.5rem] rotate-3 transform origin-bottom-right -z-10 transition-transform duration-700 hover:rotate-6"></div>
                  
                  {/* Main Image Container */}
                  <div className="relative aspect-[4/3] rounded-[2rem] overflow-hidden shadow-2xl border border-white/60 group bg-white">
                    {data.heroImage ? (
                      <img 
                        src={data.heroImage} 
                        alt="About Us" 
                        className="w-full h-full object-cover transition-transform duration-1000 ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:scale-105" 
                      />
                    ) : (
                      <div className="w-full h-full bg-slate-100 flex items-center justify-center text-slate-400">
                        No Image Provided
                      </div>
                    )}
                    
                    {/* Subtle Overlay on Hover */}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
                  </div>
                  
                  {/* Decorative Dot Pattern (Optional Modern Touch) */}
                  <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-[radial-gradient(#cbd5e1_2px,transparent_2px)] [background-size:16px_16px] -z-20 opacity-60"></div>
                  
                </div>
              </FadeInView>
              
            </div>
          </div>
        </section>
      )}

      {/* 2. MISSION & VISION */}
      {data.showMissionVision && (data.mission || data.vision) && (
        <section className="bg-white py-20 border-y border-slate-200 mb-24">
          <div className="container mx-auto px-4 md:px-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <FadeInView direction="up" delay={0.1}>
                <div className="bg-slate-50 p-10 rounded-3xl h-full border border-slate-100">
                  <div className="w-14 h-14 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mb-6">
                    <Target className="w-8 h-8" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-4">Our Mission</h3>
                  <p className="text-slate-600 leading-relaxed whitespace-pre-wrap">{data.mission}</p>
                </div>
              </FadeInView>
              <FadeInView direction="up" delay={0.2}>
                <div className="bg-slate-50 p-10 rounded-3xl h-full border border-slate-100">
                  <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mb-6">
                    <Compass className="w-8 h-8" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-4">Our Vision</h3>
                  <p className="text-slate-600 leading-relaxed whitespace-pre-wrap">{data.vision}</p>
                </div>
              </FadeInView>
            </div>
          </div>
        </section>
      )}

      {/* 3. MESSAGES SECTION */}
      <section className="container mx-auto px-4 md:px-6 space-y-24">
        
        {/* CEO Message */}
        {data.showCeo && data.ceoMessage && (
          <FadeInView direction="up">
            <div className="bg-white rounded-3xl p-8 md:p-12 shadow-xl shadow-slate-200/50 border border-slate-100 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
              <div className="lg:col-span-4 flex flex-col items-center text-center">
                <div className="w-48 h-48 rounded-full overflow-hidden mb-6 border-4 border-slate-50 shadow-lg">
                  {data.ceoImage ? (
                    <img src={data.ceoImage} alt={data.ceoName} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-slate-200" />
                  )}
                </div>
                <h4 className="text-xl font-bold text-slate-900">{data.ceoName}</h4>
              </div>
              <div className="lg:col-span-8">
                <h3 className="text-3xl font-bold text-slate-900 mb-6">CEO's Message</h3>
                <blockquote className="text-lg text-slate-600 leading-relaxed italic border-l-4 border-blue-500 pl-6 whitespace-pre-wrap">
                  "{data.ceoMessage}"
                </blockquote>
              </div>
            </div>
          </FadeInView>
        )}

        {/* Chairman Message */}
        {data.showChairman && data.chairmanMessage && (
          <FadeInView direction="up">
            <div className="bg-white rounded-3xl p-8 md:p-12 shadow-xl shadow-slate-200/50 border border-slate-100 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
              {/* Note: Reversed order on Desktop for visual variety */}
              <div className="lg:col-span-8 lg:order-1 order-2">
                <h3 className="text-3xl font-bold text-slate-900 mb-6">Chairman's Message</h3>
                <blockquote className="text-lg text-slate-600 leading-relaxed italic border-l-4 border-blue-500 pl-6 whitespace-pre-wrap">
                  "{data.chairmanMessage}"
                </blockquote>
              </div>
              <div className="lg:col-span-4 lg:order-2 order-1 flex flex-col items-center text-center">
                <div className="w-48 h-48 rounded-full overflow-hidden mb-6 border-4 border-slate-50 shadow-lg">
                  {data.chairmanImage ? (
                    <img src={data.chairmanImage} alt={data.chairmanName} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-slate-200" />
                  )}
                </div>
                <h4 className="text-xl font-bold text-slate-900">{data.chairmanName}</h4>
              </div>
            </div>
          </FadeInView>
        )}

        {/* Director Message */}
        {data.showDirector && data.directorMessage && (
          <FadeInView direction="up">
            <div className="bg-white rounded-3xl p-8 md:p-12 shadow-xl shadow-slate-200/50 border border-slate-100 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
              <div className="lg:col-span-4 flex flex-col items-center text-center">
                <div className="w-48 h-48 rounded-full overflow-hidden mb-6 border-4 border-slate-50 shadow-lg">
                  {data.directorImage ? (
                    <img src={data.directorImage} alt={data.directorName} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-slate-200" />
                  )}
                </div>
                <h4 className="text-xl font-bold text-slate-900">{data.directorName}</h4>
              </div>
              <div className="lg:col-span-8">
                <h3 className="text-3xl font-bold text-slate-900 mb-6">Director's Message</h3>
                <blockquote className="text-lg text-slate-600 leading-relaxed italic border-l-4 border-blue-500 pl-6 whitespace-pre-wrap">
                  "{data.directorMessage}"
                </blockquote>
              </div>
            </div>
          </FadeInView>
        )}

      </section>

    </main>
  );
}