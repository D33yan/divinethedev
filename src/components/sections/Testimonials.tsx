"use client";

import { motion } from "framer-motion";
import { usePortfolioData } from "@/components/providers/PortfolioDataContext";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Quote, Star } from "lucide-react";

export function Testimonials() {
  const { testimonials } = usePortfolioData();

  // Hide section entirely if no testimonials are defined in data context
  if (!testimonials || testimonials.length === 0) return null;

  return (
    <section id="testimonials" className="px-6 py-24 lg:px-12" aria-labelledby="testimonials-heading">
      <SectionHeading number="07" title="Client Reviews" />

      <div className="grid gap-8 md:grid-cols-2 max-w-5xl mx-auto mt-6">
        {testimonials.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-85px" }}
            transition={{ duration: 0.5, delay: index * 0.15 }}
            className="glass-card rounded-2xl border border-white/10 p-8 backdrop-blur-md flex flex-col justify-between items-start relative hover:border-white/20 transition-all duration-300"
          >
            {/* Quote watermark icon */}
            <div className="absolute top-6 right-6 text-white/5 pointer-events-none">
              <Quote className="h-16 w-16 rotate-180" />
            </div>

            <div className="space-y-4 relative z-10">
              {/* Star ratings */}
              <div className="flex gap-1">
                {Array.from({ length: item.stars }).map((_, i) => (
                  <Star key={i} className="h-4.5 w-4.5 fill-[#64ffda] text-[#64ffda]" />
                ))}
              </div>

              <p className="text-sm italic leading-relaxed text-[#ccd6f6]">
                &ldquo;{item.quote}&rdquo;
              </p>
            </div>

            {/* Author info */}
            <div className="mt-8 flex items-center gap-4 relative z-10">
              <div className="h-10 w-10 rounded-full border border-[#64ffda]/30 overflow-hidden bg-navy-light shrink-0">
                <img 
                  src={item.avatar} 
                  alt={item.author} 
                  className="w-full h-full object-cover" 
                />
              </div>
              <div className="font-mono text-xs">
                <h4 className="font-bold text-[#64ffda]">{item.author}</h4>
                <p className="text-[#8892b0]">
                  {item.role} @ <span className="text-[#ccd6f6]">{item.company}</span>
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
