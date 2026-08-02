"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { ChevronLeft, ChevronRight, Mouse } from "lucide-react";
import { FadeInView } from "@/components/common/FadeInView";

interface Achievement {
  _id: string;
  title: string;
  subtitle: string;
  imageUrl: string;
}

export function AchievementsGallery() {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  // We let currentIndex grow infinitely in both positive and negative directions
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const fetchAchievements = async () => {
      try {
        const res = await axios.get("/api/achievements");
        if (res.data.success) {
          setAchievements(res.data.data);
        }
      } catch (error) {
        console.error("Failed to load achievements");
      }
    };
    fetchAchievements();
  }, []);

  // Infinite navigation
  const nextSlide = () => setCurrentIndex((prev) => prev + 1);
  const prevSlide = () => setCurrentIndex((prev) => prev - 1);

  if (achievements.length === 0) return null;

  const N = achievements.length;
  // Calculate the logical visual index (keeps it between 0 and N - 1)
  const displayIndex = ((currentIndex % N) + N) % N;

  return (
    <section className="relative py-24 bg-[#0B1120] text-slate-50 overflow-hidden min-h-[90vh] flex flex-col items-center justify-center">
      
      {/* Header */}
      <div className="absolute top-12 md:top-24 text-center z-20 w-full px-4">
        <FadeInView>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4 text-white">
            Wall of Excellence
          </h2>
          <p className="text-slate-400 max-w-lg mx-auto">
            A visual journey of our proudest moments and milestones.
          </p>
        </FadeInView>
      </div>

      {/* Radial Gallery Stage */}
      <div className="relative h-[450px] md:h-[550px] w-full max-w-7xl mx-auto flex items-center justify-center perspective-[1200px] mt-10">
        {achievements.map((item, index) => {
          // Circular Offset Logic: Maps the array into a perfect loop
          let offset = (index - displayIndex) % N;
          
          // Fix JavaScript's negative modulo behavior
          if (offset < 0) offset += N;
          // Shift to a centered range (e.g., -2 to 2) rather than 0 to 5
          if (offset > Math.floor(N / 2)) offset -= N;
          
          const absOffset = Math.abs(offset);
          const isCenter = offset === 0;

          // Radial Mathematical Calculations
          const x = `${offset * 110}%`; 
          const y = `${absOffset * 15}%`; 
          const rotateZ = `${offset * 12}deg`; 
          const scale = 1 - absOffset * 0.15; 
          const zIndex = 100 - absOffset; 
          
          // Hide items that wrap around the back of the carousel so they teleport invisibly
          const opacity = absOffset > 2 ? 0 : 1; 

          return (
            <motion.div
              key={item._id}
              onClick={() => {
                // Clicking a side item navigates by exactly its offset distance
                if (!isCenter) setCurrentIndex((prev) => prev + offset);
              }}
              initial={false}
              animate={{
                x,
                y,
                rotateZ,
                scale,
                zIndex,
                opacity
              }}
              transition={{ 
                type: "spring", 
                stiffness: 250, 
                damping: 30,
                mass: 1.2
              }}
              className={`absolute w-60 md:w-80 aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl ${
                isCenter ? "cursor-default" : "cursor-pointer"
              }`}
              style={{
                filter: isCenter 
                  ? 'grayscale(0%) blur(0px) brightness(1)' 
                  : 'grayscale(100%) blur(3px) brightness(0.5)',
                // Prevent clicking on invisible items in the back
                pointerEvents: opacity === 0 ? "none" : "auto", 
              }}
            >
              <img 
                src={item.imageUrl} 
                alt={item.title} 
                className="w-full h-full object-cover pointer-events-none"
              />
              
              {/* Overlay Content */}
              <AnimatePresence>
                {isCenter && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ delay: 0.2 }}
                    className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent flex flex-col justify-end p-6"
                  >
                    <span className="text-blue-400 font-medium text-xs uppercase tracking-widest mb-1">
                      {item.subtitle}
                    </span>
                    <h3 className="text-xl md:text-2xl font-bold text-white">
                      {item.title}
                    </h3>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>

      {/* Navigation Controls */}
      <div className="absolute bottom-12 w-full flex flex-col items-center justify-center space-y-6 z-20">
        
        <div className="flex items-center space-x-2 text-slate-500 text-sm animate-bounce">
          <Mouse className="w-4 h-4" />
          <span>Click on side images to navigate</span>
        </div>

        <div className="flex items-center space-x-6">
          <button 
            onClick={prevSlide} 
            className="p-3 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-md transition-all active:scale-90"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          
          <div className="text-slate-400 font-medium text-sm w-12 text-center">
            {displayIndex + 1} / {N}
          </div>

          <button 
            onClick={nextSlide} 
            className="p-3 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-md transition-all active:scale-90"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
      </div>
    </section>
  );
}