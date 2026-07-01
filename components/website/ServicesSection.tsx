"use client";

import { motion } from "framer-motion";

export default function ServicesSection({ services }: { services: any[] }) {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-12">Our Services</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {services.map((s, idx) => (
            <motion.div 
              key={s._id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="p-8 border rounded-2xl hover:shadow-xl transition-shadow"
            >
              <h3 className="text-xl font-bold mb-4">{s.title}</h3>
              <p className="text-gray-600">{s.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}