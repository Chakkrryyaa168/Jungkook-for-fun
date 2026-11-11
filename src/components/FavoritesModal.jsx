import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Heart, Trash2, ExternalLink, Sparkles } from 'lucide-react';
import { photos, FALLBACK_IMAGE } from '../data/photos';

export default function FavoritesModal({ isOpen, onClose, favorites, onToggleFavorite, onSelectPhoto }) {
  if (!isOpen) return null;

  const favoritePhotos = photos.filter((p) => favorites.includes(p.id));

  return (
    <AnimatePresence>
      <div 
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 20 }}
          className="relative w-full max-w-2xl bg-white dark:bg-deep-purple-light rounded-3xl p-6 sm:p-8 shadow-2xl border border-lavender/30 max-h-[85vh] flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-lavender/20">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-full bg-soft-pink dark:bg-lavender/20 text-lavender-dark dark:text-lavender">
                <Heart size={18} className="fill-lavender-dark text-lavender-dark dark:fill-lavender dark:text-lavender" />
              </div>
              <div>
                <h3 className="font-serif text-xl font-bold text-deep-purple dark:text-cream">
                  My Favorite Moments
                </h3>
                <p className="text-xs text-lavender-dark dark:text-lavender">
                  {favoritePhotos.length} {favoritePhotos.length === 1 ? 'photo' : 'photos'} saved in your scrapbook
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-lavender/20 text-deep-purple dark:text-cream transition-colors"
            >
              <X size={18} />
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto py-4 pr-1">
            {favoritePhotos.length === 0 ? (
              <div className="text-center py-16 flex flex-col items-center">
                <div className="w-16 h-16 rounded-full bg-lavender/10 flex items-center justify-center text-2xl mb-3">
                  🐰
                </div>
                <p className="font-serif text-lg font-semibold text-deep-purple dark:text-cream mb-1">
                  No favorite moments yet!
                </p>
                <p className="text-xs text-deep-purple/70 dark:text-cream/70 max-w-xs leading-relaxed font-sans">
                  Tap the little heart ♡ icon on any photo in the gallery to collect your absolute favorite Jungkook moments here.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {favoritePhotos.map((photo) => (
                  <div
                    key={photo.id}
                    className="flex items-center gap-3 p-3 rounded-2xl bg-cream/50 dark:bg-black/20 border border-lavender/15 hover:border-lavender/40 transition-all group"
                  >
                    <div 
                      onClick={() => {
                        onSelectPhoto(photo);
                        onClose();
                      }}
                      className="relative w-16 h-16 rounded-xl overflow-hidden cursor-pointer flex-shrink-0 bg-lavender/10"
                    >
                      <img
                        src={photo.url}
                        alt={photo.title}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = FALLBACK_IMAGE;
                        }}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <h4 
                        onClick={() => {
                          onSelectPhoto(photo);
                          onClose();
                        }}
                        className="font-serif font-bold text-xs text-deep-purple dark:text-cream truncate cursor-pointer hover:underline"
                      >
                        {photo.title}
                      </h4>
                      <p className="text-[10px] text-lavender-dark dark:text-lavender truncate font-sans">
                        {photo.categoryLabel} · {photo.date}
                      </p>
                      {photo.note && (
                        <p className="font-handwriting text-xs text-lavender-dark dark:text-soft-pink truncate mt-0.5">
                          "{photo.note}"
                        </p>
                      )}
                    </div>

                    <button
                      onClick={() => onToggleFavorite(photo.id)}
                      className="p-1.5 rounded-full text-rose-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
                      title="Remove from favorites"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer note */}
          <div className="pt-3 border-t border-lavender/20 flex items-center justify-between text-xs text-lavender-dark dark:text-lavender">
            <span className="font-handwriting text-base">
              "You are the cause of my euphoria" ♡
            </span>
            <button
              onClick={onClose}
              className="px-4 py-1.5 rounded-full bg-lavender text-white font-medium hover:bg-lavender-dark transition-colors"
            >
              Done
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
