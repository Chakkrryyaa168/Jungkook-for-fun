import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles } from 'lucide-react';

export default function LoadingScreen({ isLoaded }) {
  return (
    <AnimatePresence>
      {!isLoaded && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: 'easeInOut' }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-cream dark:bg-deep-purple px-4 select-none"
        >
          {/* Glowing purple heart animation */}
          <div className="relative mb-6">
            <motion.div
              animate={{
                scale: [1, 1.25, 1],
                filter: [
                  'drop-shadow(0 0 10px rgba(185,160,217,0.5))',
                  'drop-shadow(0 0 30px rgba(185,160,217,0.9))',
                  'drop-shadow(0 0 10px rgba(185,160,217,0.5))',
                ],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              className="text-6xl sm:text-7xl"
            >
              💜
            </motion.div>

            {/* Orbiting sparkles */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
              className="absolute -inset-4 flex items-center justify-between pointer-events-none"
            >
              <span className="text-sm">✨</span>
              <span className="text-sm">🌸</span>
            </motion.div>
          </div>

          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="font-serif text-2xl sm:text-3xl font-bold text-deep-purple dark:text-cream tracking-tight text-center"
          >
            jungkook.zip
          </motion.h2>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="font-handwriting text-xl sm:text-2xl text-lavender-dark dark:text-lavender mt-2 text-center"
          >
            "Preparing a little happiness for you... 💜"
          </motion.p>

          <div className="mt-8 w-44 h-1.5 rounded-full bg-lavender/20 overflow-hidden">
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: '100%' }}
              transition={{
                duration: 1.2,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              className="w-1/2 h-full bg-gradient-to-r from-lavender to-soft-pink-dark rounded-full"
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
