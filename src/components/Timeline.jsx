import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Calendar, Award, Quote, ChevronRight } from 'lucide-react';
import { timelineEvents } from '../data/timeline';
import { FALLBACK_IMAGE } from '../data/photos';

export default function Timeline() {
  const [selectedEraIndex, setSelectedEraIndex] = useState(null);

  return (
    <section id="timeline" className="py-24 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto relative">
      {/* Section Header */}
      <div className="text-center max-w-2xl mx-auto mb-16">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full glass-pill text-xs font-semibold uppercase tracking-wider text-lavender-dark dark:text-lavender mb-3">
          <Sparkles size={13} />
          <span>The Journey of the Golden Maknae</span>
        </div>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-deep-purple dark:text-cream tracking-tight mb-3">
          A Decade of Miracles.
        </h2>
        <p className="text-sm sm:text-base text-deep-purple/75 dark:text-cream/80 font-normal leading-relaxed">
          From a 15-year-old boy in Busan who came to Seoul with a big heart, to the world's most 
          beloved pop icon. Trace his beautiful growth across the years.
        </p>

        {/* Quick Era Navigation Bar */}
        <div className="flex flex-wrap items-center justify-center gap-2 mt-6">
          {timelineEvents.map((event, idx) => (
            <button
              key={event.year}
              onClick={() => {
                const el = document.getElementById(`era-${event.year}`);
                if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
              }}
              className="text-xs font-mono font-medium px-3 py-1 rounded-full glass-pill text-deep-purple dark:text-cream hover:bg-lavender/30 transition-all"
            >
              {event.year}
            </button>
          ))}
        </div>
      </div>

      {/* Vertical Timeline Container */}
      <div className="relative">
        {/* Central glowing vertical timeline line */}
        <div className="hidden md:block absolute left-1/2 top-4 bottom-4 w-1 -translate-x-1/2 bg-gradient-to-b from-lavender/20 via-lavender to-soft-pink-dark rounded-full shadow-[0_0_12px_rgba(185,160,217,0.5)]" />
        <div className="md:hidden absolute left-6 top-4 bottom-4 w-1 bg-gradient-to-b from-lavender/20 via-lavender to-soft-pink-dark rounded-full" />

        {/* Timeline Events */}
        <div className="space-y-12 md:space-y-20">
          {timelineEvents.map((item, index) => {
            const isEven = index % 2 === 0;

            return (
              <motion.div
                id={`era-${item.year}`}
                key={item.year}
                initial={{ opacity: 0, y: 35 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className={`relative flex flex-col md:flex-row items-center gap-8 ${
                  isEven ? 'md:flex-row-reverse' : ''
                }`}
              >
                {/* Center Node / Year Badge */}
                <div className="absolute left-6 md:left-1/2 -translate-x-1/2 z-20 flex flex-col items-center">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-lavender to-soft-pink flex items-center justify-center text-white shadow-dreamy border-4 border-cream dark:border-deep-purple">
                    <span className="font-mono text-xs font-bold text-deep-purple">
                      {item.year.slice(-2)}'
                    </span>
                  </div>
                </div>

                {/* Content Card (Left or Right depending on isEven) */}
                <div className="w-full md:w-1/2 pl-16 md:pl-0 md:px-8">
                  <div className="bg-white dark:bg-deep-purple-light p-6 sm:p-7 rounded-3xl shadow-polaroid border border-white/80 dark:border-lavender/20 hover:shadow-dreamy transition-all duration-300">
                    {/* Era Header */}
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                      <span className="px-3 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider bg-lavender/20 text-deep-purple dark:text-lavender-light">
                        {item.year} · {item.era}
                      </span>
                      <span className="text-xs font-semibold text-lavender-dark dark:text-soft-pink">
                        {item.badge}
                      </span>
                    </div>

                    <h3 className="font-serif text-xl sm:text-2xl font-bold text-deep-purple dark:text-cream mb-2 leading-snug">
                      {item.title}
                    </h3>

                    <p className="text-xs sm:text-sm text-deep-purple/75 dark:text-cream/80 leading-relaxed mb-4">
                      {item.description}
                    </p>

                    {/* Milestones list */}
                    <div className="space-y-1.5 mb-4 pt-2 border-t border-lavender/15">
                      {item.milestones.map((m, i) => (
                        <div key={i} className="flex items-start gap-2 text-xs text-deep-purple/80 dark:text-cream/75">
                          <span className="text-lavender font-bold">✦</span>
                          <span>{m}</span>
                        </div>
                      ))}
                    </div>

                    {/* Highlight Quote */}
                    <div className="p-3 rounded-2xl bg-soft-pink/40 dark:bg-black/20 border-l-4 border-lavender flex items-start gap-2">
                      <Quote size={16} className="text-lavender flex-shrink-0 mt-0.5" />
                      <p className="font-handwriting text-base sm:text-lg text-deep-purple dark:text-cream leading-tight">
                        {item.highlight}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Photo Side (Left or Right) */}
                <div className="w-full md:w-1/2 pl-16 md:pl-0 md:px-8 flex justify-center">
                  <div className="relative group max-w-sm w-full">
                    {/* Washi Tape */}
                    <div className={`washi-tape ${isEven ? 'rotate-[-3deg]' : 'rotate-[2deg]'}`} />

                    {/* Polaroid Photo Frame */}
                    <div className="bg-white dark:bg-deep-purple-light p-3 pb-5 rounded-2xl shadow-polaroid border border-white/80 dark:border-lavender/20 transition-transform duration-500 group-hover:scale-102">
                      <div className="relative overflow-hidden rounded-xl aspect-[4/3] bg-lavender/10">
                        <img
                          src={item.image}
                          alt={item.title}
                          loading="lazy"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = FALLBACK_IMAGE;
                          }}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-106"
                        />
                        <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded-md bg-black/40 backdrop-blur-sm text-[10px] text-white font-mono">
                          {item.date}
                        </div>
                      </div>
                      <div className="mt-3 text-center">
                        <p className="font-handwriting text-lg text-deep-purple dark:text-cream">
                          {item.era} moments ♡
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
