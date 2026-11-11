import React from 'react';
import { motion } from 'framer-motion';
import { Heart, Sparkles, Star, ArrowDown } from 'lucide-react';
import { HERO_IMAGE, HERO_SECONDARY } from '../data/photos';

export default function Hero({ onEnter }) {
  return (
    <section 
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20 pb-16 px-4 sm:px-6 lg:px-8"
    >
      {/* Dreamy Ambient Background Blurs */}
      <div className="absolute top-1/4 left-1/10 w-72 h-72 sm:w-96 sm:h-96 bg-lavender/30 dark:bg-lavender/15 rounded-full blur-3xl pointer-events-none animate-float-slow" />
      <div className="absolute bottom-1/4 right-1/10 w-80 h-80 sm:w-[28rem] sm:h-[28rem] bg-soft-pink/40 dark:bg-purple-900/20 rounded-full blur-3xl pointer-events-none animate-float-reverse" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[34rem] h-[34rem] bg-lavender-light/20 dark:bg-deep-purple-light/20 rounded-full blur-[100px] pointer-events-none" />

      {/* Floating Sparkles & Little Stars */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[
          { top: '15%', left: '12%', delay: 0, size: 18, color: '#B9A0D9' },
          { top: '22%', right: '15%', delay: 1.2, size: 14, color: '#F4DCEB' },
          { top: '75%', left: '8%', delay: 2.1, size: 16, color: '#FCD34D' },
          { top: '65%', right: '12%', delay: 0.8, size: 20, color: '#B9A0D9' },
          { top: '35%', left: '4%', delay: 1.8, size: 12, color: '#FFFFFF' },
          { top: '80%', right: '25%', delay: 2.5, size: 15, color: '#F4DCEB' },
        ].map((star, idx) => (
          <motion.div
            key={idx}
            className="absolute text-lavender select-none"
            style={{ top: star.top, left: star.left, right: star.right }}
            animate={{
              y: [0, -14, 0],
              opacity: [0.4, 0.9, 0.4],
              scale: [0.9, 1.15, 0.9],
              rotate: [0, 15, -15, 0],
            }}
            transition={{
              duration: 4 + idx,
              repeat: Infinity,
              delay: star.delay,
              ease: 'easeInOut',
            }}
          >
            <Sparkles size={star.size} style={{ color: star.color }} />
          </motion.div>
        ))}

        {/* Floating Mini Hearts */}
        {[
          { top: '28%', left: '22%', delay: 0.5 },
          { top: '45%', right: '8%', delay: 1.7 },
          { top: '82%', left: '20%', delay: 2.2 },
          { top: '18%', right: '28%', delay: 3.1 },
        ].map((h, i) => (
          <motion.div
            key={`heart-${i}`}
            className="absolute select-none text-lavender/60 dark:text-lavender-light/40"
            style={{ top: h.top, left: h.left, right: h.right }}
            animate={{
              y: [0, -18, 0],
              opacity: [0.3, 0.8, 0.3],
              rotate: [0, -10, 10, 0],
            }}
            transition={{
              duration: 5 + i,
              repeat: Infinity,
              delay: h.delay,
              ease: 'easeInOut',
            }}
          >
            <Heart size={16} fill="currentColor" />
          </motion.div>
        ))}
      </div>

      <div className="relative max-w-6xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
        {/* Left Column: Romantic Content */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: 'easeOut' }}
          className="lg:col-span-7 text-center lg:text-left z-10"
        >
          {/* Cute Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-pill mb-6 shadow-sm border border-lavender/30"
          >
            <span className="w-2 h-2 rounded-full bg-lavender animate-pulse" />
            <span className="text-xs sm:text-sm font-medium tracking-wide text-deep-purple/90 dark:text-cream/90 font-sans">
              a special digital scrapbook gift 💜
            </span>
          </motion.div>

          {/* Website Title */}
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="font-handwriting text-2xl sm:text-3xl text-lavender-dark dark:text-lavender tracking-wider mb-2"
          >
            jungkook.zip ♡
          </motion.p>

          {/* Main Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.7 }}
            className="text-4xl sm:text-5xl md:text-6xl font-serif font-extrabold text-deep-purple dark:text-cream tracking-tight leading-tight mb-4"
          >
            Welcome to <br className="hidden sm:inline" />
            <span className="relative inline-block text-transparent bg-clip-text bg-gradient-to-r from-deep-purple via-lavender-dark to-soft-pink-dark dark:from-cream dark:via-lavender dark:to-soft-pink">
              His World.
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.7 }}
            className="text-base sm:text-lg text-deep-purple/75 dark:text-cream/80 max-w-xl mx-auto lg:mx-0 font-normal leading-relaxed mb-8"
          >
            A little place filled with moments worth remembering. Savor his smiles, 
            explore his journey, and unfold a secret surprise made specially for you.
          </motion.p>

          {/* Action Button & Floating Details */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.7 }}
            className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4"
          >
            <button
              onClick={onEnter}
              className="group relative inline-flex items-center gap-3 px-8 py-4 rounded-full bg-gradient-to-r from-lavender via-lavender-dark to-deep-purple text-white font-medium text-base shadow-dreamy hover:shadow-dreamy-glow hover:scale-105 active:scale-95 transition-all duration-300"
            >
              <span>Enter His World ♡</span>
              <motion.div
                animate={{ x: [0, 5, 0] }}
                transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
              >
                <ArrowDown size={18} />
              </motion.div>
            </button>

            <span className="text-xs sm:text-sm text-lavender-dark dark:text-lavender-light/70 font-handwriting text-center sm:text-left">
              A little place for all the moments that make us smile ✨
            </span>
          </motion.div>

          {/* Quick aesthetic stats/tags */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.8 }}
            className="mt-10 pt-6 border-t border-lavender/20 flex flex-wrap items-center justify-center lg:justify-start gap-4 sm:gap-6 text-xs text-deep-purple/70 dark:text-cream/70"
          >
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-lavender" />
              <span>Golden Era Magic</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-soft-pink-dark" />
              <span>Golden Discography</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
              <span>Forever Our Maknae 🐰</span>
            </div>
          </motion.div>
        </motion.div>

        {/* Right Column: Beautiful Polaroid / Romantic JK Hero Frame */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, rotate: 2 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ duration: 1, delay: 0.3, ease: 'easeOut' }}
          className="lg:col-span-5 flex justify-center z-10"
        >
          <div className="relative group max-w-sm sm:max-w-md w-full">
            {/* Washi Tape on top */}
            <div className="washi-tape" />

            {/* Glowing Backdrop */}
            <div className="absolute -inset-2 bg-gradient-to-tr from-lavender/40 via-soft-pink/30 to-purple-400/30 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-500 opacity-80" />

            {/* Main Polaroid Frame */}
            <div className="relative bg-white dark:bg-deep-purple-light p-4 pb-6 rounded-2xl shadow-polaroid border border-white/60 dark:border-lavender/20 transition-transform duration-500 group-hover:-rotate-1 group-hover:scale-[1.02]">
              {/* Image Container */}
              <div className="relative overflow-hidden rounded-xl aspect-[4/5] bg-lavender/10">
                <img
                  src={HERO_IMAGE}
                  alt="Jeon Jungkook"
                  className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
                  loading="eager"
                />

                {/* Gentle Gradient Scrim at bottom of image */}
                <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/50 to-transparent pointer-events-none" />

                <div className="absolute bottom-3 left-3 text-white">
                  <span className="text-xs uppercase tracking-widest font-mono bg-white/20 backdrop-blur-sm px-2 py-0.5 rounded-md">
                    Golden Soul
                  </span>
                </div>
              </div>

              {/* Polaroid Handwritten Caption */}
              <div className="mt-4 px-2 flex items-center justify-between">
                <div>
                  <p className="font-handwriting text-xl sm:text-2xl text-deep-purple dark:text-cream leading-tight">
                    Jeon Jungkook ♡
                  </p>
                  <p className="text-[11px] text-lavender-dark dark:text-lavender-light/80 font-sans tracking-wide">
                    September 1, 1997 · Busan, South Korea
                  </p>
                </div>
                <div className="w-9 h-9 rounded-full bg-soft-pink/50 dark:bg-lavender/20 flex items-center justify-center text-sm shadow-inner">
                  💜
                </div>
              </div>
            </div>

            {/* Mini Floating Secondary Polaroid badge */}
            <motion.div
              animate={{ y: [0, -8, 0], rotate: [-4, -2, -4] }}
              transition={{ repeat: Infinity, duration: 5, ease: 'easeInOut' }}
              className="absolute -bottom-6 -left-6 sm:-left-8 hidden sm:block bg-white dark:bg-deep-purple p-2 pb-3 rounded-xl shadow-polaroid border border-lavender/30 max-w-[130px]"
            >
              <img
                src={HERO_SECONDARY}
                alt="Jungkook Casual"
                className="w-full h-24 object-cover rounded-lg"
              />
              <p className="font-handwriting text-xs text-center mt-1 text-deep-purple dark:text-cream">
                "still with you" 🌧️
              </p>
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Subtle Scroll Indicator */}
      <motion.button
        onClick={onEnter}
        animate={{ y: [0, 8, 0] }}
        transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
        className="absolute bottom-4 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-xs text-lavender-dark dark:text-lavender-light opacity-70 hover:opacity-100 transition-opacity"
      >
        <span className="font-handwriting text-sm">scroll down to explore</span>
        <ArrowDown size={14} />
      </motion.button>
    </section>
  );
}
