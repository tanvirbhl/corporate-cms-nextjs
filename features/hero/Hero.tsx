"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

interface HeroProps {
  data: {
    title: string;
    subtitle: string;
    buttonText: string;
    buttonHref: string;
    imageUrl: string;
  } | null;
}

export default function Hero({ data }: HeroProps) {
  if (!data) return null; // Or render a skeleton

  return (
    <section className="relative w-full py-20 lg:py-32 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-12 items-center">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-8"
        >
          <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 tracking-tight leading-tight">
            {data.title}
          </h1>
          <p className="text-lg text-gray-600 leading-relaxed max-w-lg">
            {data.subtitle}
          </p>
          <Link href={data.buttonHref} className="inline-block px-8 py-4 bg-brand-primary text-white rounded-full font-semibold hover:bg-brand-accent transition-all">
            {data.buttonText}
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative h-[400px] lg:h-[500px] w-full"
        >
          <Image
            src={data.imageUrl}
            alt="Hero Visual"
            fill
            className="object-cover rounded-3xl shadow-2xl"
            priority
          />
        </motion.div>
      </div>
    </section>
  );
}