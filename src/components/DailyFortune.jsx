import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { Sparkles, RefreshCw, Heart, MessageCircleHeart, Star } from 'lucide-react';
import { fortunes } from '../data/fortunes';

export default function DailyFortune() {
  const [currentFortune, setCurrentFortune] = useState(fortunes[0]);
  const [isRevealed, setIsRevealed] = useState(false);
  const [isDrawing, setIsDrawing] = useState(false);

  const drawNewFortune = () => {
    setIsDrawing(true);
    // confetti pop
    try {
      confetti({
        particleCount: 30,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#B9A0D9', '#F4DCEB', '#FCD34D']
      });
    } catch (e) {}

    setTimeout(() => {
      const nextIndex = Math.floor(Math.random() * fortunes.length);
      setCurrentFortune(fortunes[nextIndex]);
      setIsRevealed(true);
      setIsDrawing(false);
    }, 450);
  };

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto relative">
      <div className="bg-gradient-to-br from-white/90 via-cream/80 to-soft-pink/40 dark:from-deep-purple-light dark:via-deep-purple dark:to-deep-purple-dark p-8 sm:p-10 rounded-3xl shadow-polaroid border border-white/80 dark:border-lavender/30 text-center relative overflow-hidden">
        {/* Floating background blur */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-lavender/20 rounded-full blur-2xl pointer-events-none" />

        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full glass-pill text-xs font-semibold uppercase tracking-wider text-lavender-dark dark:text-lavender mb-3">
          <MessageCircleHeart size={14} />
          <span>A Little Daily Sparkle</span>
        </div>

        <h3 className="font-serif text-2xl sm:text-3xl font-bold text-deep-purple dark:text-cream mb-2">
          Today's Note for You ♡
        </h3>
        <p className="text-xs sm:text-sm text-deep-purple/75 dark:text-cream/80 max-w-md mx-auto mb-6">
          Draw a sweet reminder from Jungkook and a romantic message from me whenever you need a smile!
        </p>

        {/* Fortune Card Box */}
        <div className="max-w-xl mx-auto">
          {!isRevealed ? (
            <motion.div
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              onClick={drawNewFortune}
              className="cursor-pointer bg-white/70 dark:bg-black/20 p-8 rounded-2xl border-2 border-dashed border-lavender/50 hover:border-lavender transition-all shadow-sm flex flex-col items-center"
            >
              <div className="w-16 h-16 rounded-full bg-lavender/20 flex items-center justify-center text-3xl mb-3 animate-bounce">
                🥠
              </div>
              <p className="font-serif text-lg font-bold text-deep-purple dark:text-cream mb-1">
                Tap to Open Your Daily Note
              </p>
              <p className="text-xs text-lavender-dark dark:text-lavender font-handwriting text-base">
                "a little happiness is waiting inside" ✨
              </p>
            </motion.div>
          ) : (
            <AnimatePresence mode="wait">
              <motion.div
                key={currentFortune.id}
                initial={{ opacity: 0, scale: 0.9, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="bg-white dark:bg-black/30 p-6 sm:p-8 rounded-2xl border border-lavender/30 text-left shadow-md space-y-4 relative"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-lavender/20 text-deep-purple dark:text-lavender-light">
                    {currentFortune.tag} {currentFortune.vibe}
                  </span>
                  <span className="text-xs text-lavender font-mono">
                    #JK_LoveNote
                  </span>
                </div>

                <div>
                  <p className="font-serif text-lg sm:text-xl font-bold text-deep-purple dark:text-cream leading-relaxed">
                    "{currentFortune.quote}"
                  </p>
                  <p className="text-xs text-lavender-dark dark:text-lavender font-mono mt-1">
                    — {currentFortune.author}
                  </p>
                </div>

                <div className="pt-3 border-t border-lavender/20 flex items-start gap-2.5">
                  <Heart size={16} className="text-lavender fill-lavender flex-shrink-0 mt-0.5" />
                  <p className="font-handwriting text-xl text-deep-purple dark:text-cream leading-tight">
                    {currentFortune.sweetNote}
                  </p>
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    onClick={drawNewFortune}
                    disabled={isDrawing}
                    className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full glass-pill text-xs font-semibold text-deep-purple dark:text-cream hover:bg-lavender/20 shadow-sm"
                  >
                    <RefreshCw size={12} className={isDrawing ? "animate-spin" : ""} />
                    <span>Pick Another Note ♡</span>
                  </button>
                </div>
              </motion.div>
            </AnimatePresence>
          )}
        </div>
      </div>
    </section>
  );
}
