import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, Heart, Calendar, Tag, Sparkles, Download } from 'lucide-react';
import { FALLBACK_IMAGE } from '../data/photos';

export default function Lightbox({ 
  photo, 
  isOpen, 
  onClose, 
  onPrev, 
  onNext, 
  isFavorite, 
  onToggleFavorite,
  onDownload,
  currentIndex,
  totalCount
}) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isOpen) return;
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') onPrev();
      if (e.key === 'ArrowRight') onNext();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, onPrev, onNext]);

  if (!isOpen || !photo) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-deep-purple-dark/85 backdrop-blur-xl select-none"
        onClick={onClose}
      >
        {/* Navigation Buttons (Floating left/right) */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onPrev();
          }}
          className="absolute left-2 sm:left-6 z-20 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-md transition-all hover:scale-110 active:scale-95 shadow-lg"
          aria-label="Previous photo"
        >
          <ChevronLeft size={24} />
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onNext();
          }}
          className="absolute right-2 sm:right-6 z-20 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-md transition-all hover:scale-110 active:scale-95 shadow-lg"
          aria-label="Next photo"
        >
          <ChevronRight size={24} />
        </button>

        {/* Top bar controls */}
        <div 
          className="absolute top-4 right-4 sm:top-6 sm:right-6 z-20 flex items-center gap-3"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Favorite button */}
          <button
            onClick={() => onToggleFavorite(photo.id)}
            className={`p-3 rounded-full backdrop-blur-md transition-all shadow-md ${
              isFavorite
                ? 'bg-soft-pink text-deep-purple hover:scale-110'
                : 'bg-white/15 text-white hover:bg-white/25 hover:scale-105'
            }`}
            title={isFavorite ? "Remove from favorites" : "Add to favorites"}
          >
            <Heart
              size={20}
              className={isFavorite ? "fill-lavender-dark text-lavender-dark" : "text-white"}
            />
          </button>

          <button
            onClick={() => onDownload(photo)}
            className="p-3 rounded-full bg-white/15 hover:bg-white/25 text-white backdrop-blur-md transition-all hover:scale-105 shadow-md"
            title="Download photo"
            aria-label={`Download ${photo.title}`}
          >
            <Download size={19} />
          </button>

          {/* Close button */}
          <button
            onClick={onClose}
            className="p-3 rounded-full bg-white/15 hover:bg-white/25 text-white backdrop-blur-md transition-all hover:scale-110 active:scale-95 shadow-md"
            aria-label="Close lightbox"
          >
            <X size={20} />
          </button>
        </div>

        {/* Counter indicator */}
        <div className="absolute top-5 left-4 sm:top-6 sm:left-6 z-20 font-mono text-xs text-lavender-light bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
          {currentIndex + 1} / {totalCount}
        </div>

        {/* Main Lightbox Card */}
        <motion.div
          initial={{ scale: 0.92, opacity: 0, y: 15 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.92, opacity: 0, y: 15 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative max-w-4xl w-full max-h-[90vh] bg-white dark:bg-deep-purple-light rounded-3xl overflow-hidden shadow-2xl border border-white/20 dark:border-lavender/20 flex flex-col md:flex-row"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Image Side */}
          <div className="relative md:w-3/5 bg-black/90 flex items-center justify-center min-h-[300px] md:min-h-[500px]">
            <img
              src={photo.url}
              alt={photo.title}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = FALLBACK_IMAGE;
              }}
              className="max-h-[60vh] md:max-h-[85vh] w-full object-contain p-2"
            />
          </div>

          {/* Details & Caption Side */}
          <div className="md:w-2/5 p-6 flex flex-col justify-between overflow-y-auto max-h-[40vh] md:max-h-[85vh] bg-gradient-to-b from-cream/90 to-soft-pink/30 dark:from-deep-purple dark:to-deep-purple-light">
            <div>
              {/* Category & Date badge */}
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-lavender/30 dark:bg-lavender/20 text-deep-purple dark:text-lavender-light">
                  {photo.categoryLabel}
                </span>
                <span className="flex items-center gap-1 text-xs text-lavender-dark dark:text-lavender-light/70">
                  <Calendar size={12} />
                  {photo.date}
                </span>
              </div>

              {/* Title & Subtitle */}
              <h3 className="font-serif text-2xl font-bold text-deep-purple dark:text-cream leading-snug mb-1">
                {photo.title}
              </h3>
              <p className="text-sm text-lavender-dark dark:text-lavender mb-4">
                {photo.subtitle}
              </p>

              {/* Caption Description */}
              <div className="bg-white/60 dark:bg-black/20 p-4 rounded-2xl mb-4 border border-lavender/20">
                <p className="text-sm text-deep-purple/85 dark:text-cream/90 leading-relaxed font-sans">
                  {photo.caption}
                </p>
              </div>

              {/* Handwritten Note */}
              {photo.note && (
                <div className="p-3 rounded-2xl bg-soft-pink/50 dark:bg-purple-950/40 border-l-4 border-lavender mb-4">
                  <div className="flex items-center gap-1.5 text-xs text-lavender-dark dark:text-lavender font-semibold mb-1">
                    <Sparkles size={12} />
                    <span>Memory Note</span>
                  </div>
                  <p className="font-handwriting text-lg text-deep-purple dark:text-cream leading-tight">
                    "{photo.note}"
                  </p>
                </div>
              )}

              {/* Tags */}
              <div className="flex flex-wrap gap-1.5 mt-2">
                {photo.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 text-[11px] text-deep-purple/70 dark:text-cream/60 bg-lavender/15 px-2.5 py-0.5 rounded-md"
                  >
                    <Tag size={10} />
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="mt-6 pt-4 border-t border-lavender/20 flex items-center justify-between">
              <button
                onClick={() => onToggleFavorite(photo.id)}
                className="flex items-center gap-2 text-xs font-medium text-lavender-dark dark:text-lavender hover:underline"
              >
                <Heart size={14} className={isFavorite ? "fill-lavender" : ""} />
                {isFavorite ? "Favorited in your scrapbook ♡" : "Tap to save to favorites"}
              </button>

              <span className="text-[11px] font-mono text-lavender/80">
                jungkook.zip
              </span>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
