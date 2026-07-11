"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import axios from "axios";

export function HomeSlider() {
  const [slides, setSlides] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const fetchSlides = async () => {
      try {
        const res = await axios.get("/api/slider");
        if (res.data.success) setSlides(res.data.data);
      } catch (error) {
        console.error("Failed to fetch slides");
      }
    };
    fetchSlides();
  }, []);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % slides.length);
  }, [slides.length]);

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
  };

  // Auto-play logic that pauses on hover
  useEffect(() => {
    if (slides.length === 0 || isHovered) return;
    const timer = setInterval(nextSlide, 2500);
    return () => clearInterval(timer);
  }, [slides, isHovered, nextSlide]);

  if (slides.length === 0) return null;

  return (
    <div
      className="relative w-full h-screen overflow-hidden group bg-slate-900"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1, ease: "easeInOut" }}
          className="absolute inset-0"
        >
          {/* Subtle slow-zoom effect on the image */}
          <motion.img
            initial={{ scale: 1.05 }}
            animate={{ scale: 1 }}
            transition={{ duration: 6, ease: "easeOut" }}
            src={slides[currentIndex].imageUrl}
            alt={slides[currentIndex].title}
            className="w-full h-full object-cover"
          />

          {/* Modern Gradient Overlay: Dark on the left, fading to transparent on the right */}
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900/90 via-slate-900/60 to-transparent" />

          {/* Content Container - Left Aligned */}
          <div className="absolute inset-0 flex items-center">
            <div className="container mx-auto px-6 md:px-12 lg:px-24">
              <div className="max-w-3xl">
                {/* Staggered Content Animation */}
                <motion.div
                  initial={{ y: 30, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2, duration: 0.8, ease: "easeOut" }}
                >
                  <h1 className="text-white text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight tracking-tight">
                    {slides[currentIndex].title}
                  </h1>
                </motion.div>

                <motion.div
                  initial={{ y: 30, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4, duration: 0.8, ease: "easeOut" }}
                >
                  <p className="text-slate-200 text-lg md:text-xl leading-relaxed mb-10 max-w-2xl border-l-2 border-blue-500 pl-6 py-1">
                    {slides[currentIndex].description}
                  </p>
                </motion.div>

                <motion.div
                  initial={{ y: 30, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.6, duration: 0.8, ease: "easeOut" }}
                >
                  <Link
                    href="/contact"
                    className="inline-flex items-center justify-center px-8 py-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-all hover:pr-6 group/btn shadow-lg shadow-blue-900/20"
                  >
                    Start a Project
                  </Link>
                </motion.div>
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
