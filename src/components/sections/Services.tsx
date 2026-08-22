"use client";

import { motion } from "framer-motion";
import { usePortfolioData } from "@/components/providers/PortfolioDataContext";
import { SectionHeading } from "@/components/ui/SectionHeading";
import * as Icons from "lucide-react";

export function Services() {
  const { services } = usePortfolioData();

  // Hide section entirely if no services are defined in data context
  if (!services || services.length === 0) return null;

  return (
    <section id="services" className="px-6 py-24 lg:px-12" aria-labelledby="services-heading">
      <SectionHeading number="02" title="Services I Offer" />
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 max-w-5xl mx-auto mt-6">
        {services.map((service, index) => {
          // Dynamic Lucide icon lookup fallback to HelpCircle if missing
          const IconComponent = (Icons as any)[service.icon] || Icons.HelpCircle;

          return (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-85px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -6, borderColor: "rgba(100,255,218,0.3)" }}
              className="glass-card rounded-2xl border border-white/10 p-6 bg-[#0a192f]/30 backdrop-blur-md flex flex-col justify-between items-start transition-all duration-300 group hover:shadow-[0_10px_30px_-15px_rgba(100,255,218,0.1)]"
            >
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-xl bg-[#64ffda]/10 border border-[#64ffda]/20 flex items-center justify-center text-[#64ffda] group-hover:bg-[#64ffda]/20 group-hover:text-white transition-colors duration-300">
                  <IconComponent className="h-6 w-6" />
                </div>
                <h3 className="text-base font-bold font-mono text-[#ccd6f6] tracking-wide uppercase">
                  {service.title}
                </h3>
                <p className="text-xs text-[#8892b0] leading-relaxed">
                  {service.desc}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
