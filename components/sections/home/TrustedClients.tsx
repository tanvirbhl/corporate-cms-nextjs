"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { FadeInView } from "@/components/common/FadeInView";

interface ClientLogo {
  _id: string;
  name: string;
  imageUrl: string;
}

export function TrustedClients() {
  const [clientLogos, setClientLogos] = useState<ClientLogo[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchLogos = async () => {
      try {
        const res = await axios.get("/api/client-logos");
        if (res.data.success) {
          setClientLogos(res.data.data);
        }
      } catch (error) {
        console.error("Failed to fetch client logos");
      } finally {
        setIsLoading(false);
      }
    };
    fetchLogos();
  }, []);

  if (!isLoading && clientLogos.length === 0) return null;

  // 1. FIX: Duplicate the array multiple times.
  // This guarantees that even if you only have 3-4 logos,
  // they will completely fill ultra-wide desktop monitors without breaking the loop.
  const duplicatedLogos = [
    ...clientLogos,
    ...clientLogos,
    ...clientLogos,
    ...clientLogos,
  ];

  return (
    <section className="py-20 bg-white border-b border-slate-100 overflow-hidden">
      {/* Text Section (Kept centered in a standard container) */}
      <div className="container mx-auto px-4 md:px-6 mb-16 text-center">
        <FadeInView>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            Our Trusted Clients
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Partnering with industry leaders to deliver exceptional digital
            experiences and scalable enterprise solutions.
          </p>
        </FadeInView>
      </div>

      {/* 2. FIX: Replaced   with w-full to stretch edge-to-edge */}
      <div className="relative w-full">
        <div
          className="flex overflow-hidden relative w-full"
          style={{
            maskImage:
              "linear-gradient(to right, transparent, black 10%, black 90%, transparent)",
            WebkitMaskImage:
              "linear-gradient(to right, transparent, black 10%, black 90%, transparent)",
          }}
        >
          <motion.div
            className="flex items-center space-x-16 md:space-x-24 w-max shrink-0"
            // We use -25% now because we quadrupled the array instead of doubling it
            animate={clientLogos.length > 0 ? { x: ["0%", "-25%"] } : { x: 0 }}
            transition={{
              ease: "linear",
              duration: 25,
              repeat: Infinity,
            }}
          >
            {duplicatedLogos.map((logo, index) => (
              <div
                key={`${logo._id}-${index}`}
                className="flex items-center justify-center w-60 h-24 transition-all duration-300 cursor-pointer shrink-0"
                title={logo.name}
              >
                <img
                  src={logo.imageUrl}
                  alt={logo.name}
                  className="max-w-full max-h-full object-contain"
                />
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
