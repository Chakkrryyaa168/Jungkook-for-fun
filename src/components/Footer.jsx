import React from 'react';
import { Heart, ArrowUp, Sparkles, Moon, Sun } from 'lucide-react';

export default function Footer({ onScrollTop }) {
  return (
    <footer className="relative mt-24 border-t border-lavender/25 bg-white/40 dark:bg-deep-purple-dark/80 backdrop-blur-md pt-16 pb-12 px-4 sm:px-6 lg:px-8">
      {/* Ambient background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-80 h-32 bg-lavender/20 rounded-full blur-2xl pointer-events-none" />

      <div className="max-w-6xl mx-auto flex flex-col items-center text-center relative z-10">
        {/* Back to top floating pill */}
        <button
          onClick={onScrollTop}
          className="group mb-8 inline-flex items-center gap-2 px-5 py-2.5 rounded-full glass-pill text-xs font-semibold text-deep-purple dark:text-cream shadow-sm hover:shadow-dreamy transition-all hover:-translate-y-1"
        >
          <span>Back to Top</span>
          <ArrowUp size={14} className="group-hover:-translate-y-0.5 transition-transform" />
        </button>

        {/* Heart Emblem */}
        <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-lavender to-soft-pink flex items-center justify-center text-white shadow-dreamy mb-4">
          <Heart size={20} className="fill-white" />
        </div>

        {/* Title & Romantic Subtitle */}
        <h3 className="font-serif text-2xl font-bold text-deep-purple dark:text-cream mb-1">
          jungkook.zip ♡
        </h3>
        <p className="font-handwriting text-xl text-lavender-dark dark:text-lavender mb-6">
          "A Little World of Jungkook — Made with endless love for you"
        </p>

        {/* BTS Quotes & Aesthetic Badges */}
        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 text-xs text-deep-purple/75 dark:text-cream/70 mb-8 max-w-xl">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-lavender/10">
            <span className="text-xs">💜</span>
            <span className="font-medium">Borahae (I Purple You)</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-soft-pink/40 dark:bg-purple-900/30">
            <span className="text-xs">✨</span>
            <span className="font-medium">Apobangpo: ARMY Forever BTS Forever</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/10">
            <span className="text-xs">👑</span>
            <span className="font-medium">Forever Our Golden Maknae</span>
          </div>
        </div>

        {/* Dedication Text */}
        <div className="border-t border-lavender/15 pt-6 w-full max-w-md flex flex-col sm:flex-row items-center justify-between text-[11px] text-deep-purple/60 dark:text-cream/60">
          <span>
            Created with all my heart ♡
          </span>
          <span className="font-mono mt-1 sm:mt-0">
            jungkook.zip · 2026
          </span>
        </div>
      </div>
    </footer>
  );
}
