"use client"; 
import Image from "next/image";
import { motion } from "framer-motion";

interface AboutProps {
  data: {
    title: string;
    content: string;
    imageUrl: string;
  } | null;
}

export default function AboutSection({ data }: AboutProps) {
  if (!data) return null;

  return (
    <section className="py-20 bg-gray-50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-2 gap-12 items-center">
        
        {/* Animated Image Container */}
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative h-[400px] w-full"
        >
          <Image 
            src={data.imageUrl} 
            alt="About Us" 
            fill 
            className="object-cover rounded-2xl shadow-lg"
          />
        </motion.div>

        {/* Animated Text Container */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <h2 className="text-4xl font-bold mb-6 text-gray-900">{data.title}</h2>
          <p className="text-gray-600 leading-relaxed text-lg">{data.content}</p>
        </motion.div>
        
      </div>
    </section>
  );
}