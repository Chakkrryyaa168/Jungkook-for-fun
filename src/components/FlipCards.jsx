import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Camera, 
  Music, 
  Smile, 
  Flame, 
  Heart, 
  Sparkles, 
  RotateCw,
  CheckCircle2,
  Info
} from 'lucide-react';
import { flipCardsData } from '../data/flipCards';
import { FALLBACK_IMAGE } from '../data/photos';

const iconMap = {
  Camera,
  Music,
  Smile,
  Flame,
  Heart,
  Sparkles,
};

export default function FlipCards() {
  const [flippedCards, setFlippedCards] = useState({});

  const toggleFlip = (id) => {
    setFlippedCards((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <section id="little-things" className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative">
      {/* Section Header */}
      <div className="text-center max-w-2xl mx-auto mb-16">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full glass-pill text-xs font-semibold uppercase tracking-wider text-lavender-dark dark:text-lavender mb-3">
          <Sparkles size={13} />
          <span>Little Things About Jungkook</span>
        </div>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-deep-purple dark:text-cream tracking-tight mb-3">
          Curious & Adorable Trivia.
        </h2>
        <p className="text-sm sm:text-base text-deep-purple/75 dark:text-cream/80 font-normal leading-relaxed">
          The little quirks, talents, and habits that make him so deeply special. 
          Tap any card to flip it over and discover secret details!
        </p>
      </div>

      {/* Grid of 6 Flip Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {flipCardsData.map((card, idx) => {
          const isFlipped = !!flippedCards[card.id];
          const IconComponent = iconMap[card.icon] || Sparkles;

          return (
            <div
              key={card.id}
              className="perspective-1000 h-[480px] w-full cursor-pointer select-none"
              onClick={() => toggleFlip(card.id)}
            >
              <div
                className={`relative w-full h-full duration-700 preserve-3d transition-transform ${
                  isFlipped ? 'rotate-y-180' : ''
                }`}
              >
                {/* ================= FRONT OF CARD ================= */}
                <div className="absolute inset-0 w-full h-full backface-hidden bg-white dark:bg-deep-purple-light rounded-3xl p-5 shadow-polaroid border border-white/80 dark:border-lavender/20 flex flex-col justify-between hover:shadow-dreamy transition-shadow">
                  {/* Card Top: Icon & Category Tag */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className="w-10 h-10 rounded-2xl bg-lavender/20 flex items-center justify-center text-lavender-dark dark:text-lavender">
                        <IconComponent size={20} />
                      </div>
                      <span className="text-[11px] font-mono uppercase tracking-wider px-3 py-1 rounded-full bg-soft-pink/60 dark:bg-black/30 text-deep-purple dark:text-lavender-light font-semibold">
                        {card.tag}
                      </span>
                    </div>

                    <h3 className="font-serif text-2xl font-bold text-deep-purple dark:text-cream leading-tight">
                      {card.title}
                    </h3>
                    <p className="text-xs text-lavender-dark dark:text-lavender mb-3">
                      {card.subtitle}
                    </p>

                    {/* Front Image Frame */}
                    <div className="relative rounded-2xl overflow-hidden aspect-[16/10] bg-lavender/10 shadow-inner mb-3">
                      <img
                        src={card.frontImage}
                        alt={card.title}
                        loading="lazy"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = FALLBACK_IMAGE;
                        }}
                        className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                      <p className="absolute bottom-2 left-3 right-3 text-xs text-white/90 truncate font-sans">
                        {card.frontSnippet}
                      </p>
                    </div>

                    {/* Front quote */}
                    <div className="p-2.5 rounded-xl bg-cream/70 dark:bg-black/20 border-l-3 border-lavender">
                      <p className="font-handwriting text-base text-deep-purple dark:text-cream italic">
                        {card.frontQuote}
                      </p>
                    </div>
                  </div>

                  {/* Card Bottom: Flip hint */}
                  <div className="pt-3 border-t border-lavender/15 flex items-center justify-between text-xs text-lavender-dark dark:text-lavender">
                    <span className="font-sans font-medium flex items-center gap-1.5">
                      <RotateCw size={13} className="animate-spin-slow" />
                      Tap to flip card
                    </span>
                    <span className="text-[11px] font-mono text-lavender-dark/60">
                      0{idx + 1}
                    </span>
                  </div>
                </div>

                {/* ================= BACK OF CARD ================= */}
                <div className="absolute inset-0 w-full h-full backface-hidden rotate-y-180 bg-gradient-to-b from-white via-cream/50 to-soft-pink/30 dark:from-deep-purple-light dark:via-deep-purple dark:to-deep-purple-dark rounded-3xl p-5 shadow-polaroid border border-lavender/40 flex flex-col justify-between overflow-hidden">
                  <div>
                    {/* Back Header */}
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Sparkles size={16} className="text-lavender" />
                        <span className="font-serif font-bold text-base text-deep-purple dark:text-cream">
                          {card.backDetails.headline}
                        </span>
                      </div>
                      <span className="p-1 rounded-full bg-lavender/20 text-deep-purple dark:text-cream">
                        <RotateCw size={12} />
                      </span>
                    </div>

                    {/* Detailed Items List */}
                    <div className="space-y-2 mt-3 overflow-y-auto max-h-[290px] pr-1">
                      {card.backDetails.items.map((item, i) => (
                        <div
                          key={i}
                          className="bg-white/80 dark:bg-black/30 p-2.5 rounded-xl border border-lavender/15"
                        >
                          <p className="font-semibold text-xs text-lavender-dark dark:text-soft-pink flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-lavender" />
                            {item.label}
                          </p>
                          <p className="text-[11px] text-deep-purple/80 dark:text-cream/80 mt-0.5 leading-snug">
                            {item.desc}
                          </p>
                        </div>
                      ))}

                      {/* Fun fact callout */}
                      {card.backDetails.funFact && (
                        <div className="mt-2 p-2.5 rounded-xl bg-soft-pink/60 dark:bg-purple-900/30 border border-lavender/30">
                          <p className="text-[11px] text-deep-purple dark:text-cream font-medium">
                            💡 <span className="font-bold">Did you know?</span> {card.backDetails.funFact}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Back Bottom Flip Hint */}
                  <div className="pt-2 border-t border-lavender/20 flex items-center justify-between text-xs text-lavender-dark dark:text-lavender">
                    <span className="font-handwriting text-sm">
                      "forever our golden boy" ♡
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFlip(card.id);
                      }}
                      className="font-sans text-[11px] font-semibold text-deep-purple dark:text-cream bg-lavender/20 px-2.5 py-1 rounded-full hover:bg-lavender/30"
                    >
                      Flip back ↺
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
