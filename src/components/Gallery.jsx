import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Heart, 
  Sparkles, 
  Camera, 
  Flame, 
  Crown, 
  Coffee, 
  Maximize2,
  Tag
} from 'lucide-react';
import { categories, photos, FALLBACK_IMAGE } from '../data/photos';
import Lightbox from './Lightbox';

// Icon mapper for categories
const iconMap = {
  Sparkles,
  Coffee,
  Camera,
  Flame,
  Crown,
  Heart,
};

export default function Gallery({ favorites, onToggleFavorite }) {
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [imageLoadedState, setImageLoadedState] = useState({});

  const filteredPhotos = activeCategory === 'all'
    ? photos
    : photos.filter((p) => p.category === activeCategory);

  const currentPhotoIndex = selectedPhoto
    ? filteredPhotos.findIndex((p) => p.id === selectedPhoto.id)
    : -1;

  const handlePrev = () => {
    if (currentPhotoIndex > 0) {
      setSelectedPhoto(filteredPhotos[currentPhotoIndex - 1]);
    } else {
      setSelectedPhoto(filteredPhotos[filteredPhotos.length - 1]);
    }
  };

  const handleNext = () => {
    if (currentPhotoIndex < filteredPhotos.length - 1) {
      setSelectedPhoto(filteredPhotos[currentPhotoIndex + 1]);
    } else {
      setSelectedPhoto(filteredPhotos[0]);
    }
  };

  const handleImageLoaded = (id) => {
    setImageLoadedState((prev) => ({ ...prev, [id]: true }));
  };

  return (
    <section id="gallery" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative">
      {/* Section Header */}
      <div className="text-center max-w-2xl mx-auto mb-12">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full glass-pill text-xs font-semibold uppercase tracking-wider text-lavender-dark dark:text-lavender mb-3">
          <Sparkles size={13} />
          <span>Photo Memories Gallery</span>
        </div>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-deep-purple dark:text-cream tracking-tight mb-3">
          Moments Frozen in Time.
        </h2>
        <p className="text-sm sm:text-base text-deep-purple/75 dark:text-cream/80 font-normal leading-relaxed">
          From electric concert stages to cozy airport mornings, explore every side of Jungkook. 
          Tap any picture to view full-screen, read cute captions, and save your favorites!
        </p>
      </div>

      {/* Category Filter Pills */}
      <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mb-10">
        {categories.map((cat) => {
          const Icon = iconMap[cat.icon] || Sparkles;
          const isActive = activeCategory === cat.id;
          const count = cat.id === 'all' 
            ? photos.length 
            : photos.filter((p) => p.category === cat.id).length;

          return (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs sm:text-sm font-medium transition-all duration-300 shadow-sm ${
                isActive
                  ? 'bg-lavender text-white shadow-dreamy scale-105'
                  : 'glass-pill text-deep-purple/80 dark:text-cream/80 hover:bg-lavender/20'
              }`}
            >
              <Icon size={14} className={isActive ? "text-white" : "text-lavender"} />
              <span>{cat.label}</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                isActive ? 'bg-white/20 text-white' : 'bg-lavender/20 text-deep-purple dark:text-cream'
              }`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Masonry / Pinterest Style Grid Layout */}
      <motion.div 
        layout
        className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6"
      >
        <AnimatePresence>
          {filteredPhotos.map((photo, index) => {
            const isFav = favorites.includes(photo.id);
            const isLoaded = imageLoadedState[photo.id];

            return (
              <motion.div
                key={photo.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4, delay: index * 0.04 }}
                className="break-inside-avoid group relative"
              >
                {/* Polaroid / Dreamy Scrapbook Card Frame */}
                <div 
                  onClick={() => setSelectedPhoto(photo)}
                  className="cursor-pointer bg-white dark:bg-deep-purple-light p-3 pb-4 rounded-2xl shadow-polaroid border border-white/80 dark:border-lavender/20 hover:shadow-dreamy transition-all duration-500 hover:-translate-y-1.5 hover:rotate-[-0.5deg]"
                >
                  {/* Image Container with Shimmer Skeleton */}
                  <div className={`relative overflow-hidden rounded-xl ${photo.aspect} bg-lavender/10`}>
                    {!isLoaded && (
                      <div className="absolute inset-0 bg-gradient-to-r from-lavender/10 via-soft-pink/20 to-lavender/10 animate-pulse" />
                    )}

                    <img
                      src={photo.url}
                      alt={photo.title}
                      loading="lazy"
                      onLoad={() => handleImageLoaded(photo.id)}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = FALLBACK_IMAGE;
                        handleImageLoaded(photo.id);
                      }}
                      className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-108 ${
                        isLoaded ? 'opacity-100' : 'opacity-0'
                      }`}
                    />

                    {/* Gradient Overlay for hover */}
                    <div className="absolute inset-0 bg-gradient-to-t from-deep-purple/80 via-deep-purple/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-4 text-white">
                      {/* Top actions on hover */}
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] uppercase font-mono tracking-wider bg-white/20 backdrop-blur-md px-2.5 py-1 rounded-full">
                          {photo.categoryLabel}
                        </span>
                        <div className="p-1.5 rounded-full bg-white/20 backdrop-blur-md">
                          <Maximize2 size={13} />
                        </div>
                      </div>

                      {/* Bottom note on hover */}
                      <div>
                        <p className="font-serif font-bold text-sm leading-tight text-white drop-shadow-md">
                          {photo.title}
                        </p>
                        {photo.note && (
                          <p className="font-handwriting text-sm text-soft-pink mt-0.5 line-clamp-1">
                            "{photo.note}"
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Card Bottom: Title & Favorite Button */}
                  <div className="mt-3 px-1 flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <h4 className="font-serif font-semibold text-sm text-deep-purple dark:text-cream truncate">
                        {photo.title}
                      </h4>
                      <p className="text-[11px] text-lavender-dark dark:text-lavender-light truncate font-sans">
                        {photo.date} · {photo.subtitle}
                      </p>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleFavorite(photo.id);
                      }}
                      className={`p-2 rounded-full transition-all duration-300 ${
                        isFav
                          ? 'bg-soft-pink text-deep-purple scale-110 shadow-sm'
                          : 'text-deep-purple/40 dark:text-cream/40 hover:text-lavender hover:bg-lavender/10'
                      }`}
                      title={isFav ? "Favorited" : "Save to favorites"}
                    >
                      <Heart
                        size={15}
                        className={isFav ? "fill-lavender-dark text-lavender-dark" : ""}
                      />
                    </button>
                  </div>

                  {/* Cute Handwritten tape caption if cute moment or golden */}
                  {photo.category === 'cute' && (
                    <div className="mt-2 pt-2 border-t border-lavender/15 flex items-center gap-1.5">
                      <span className="text-xs">🐰</span>
                      <span className="font-handwriting text-sm text-lavender-dark dark:text-lavender">
                        "the bunny smile we adore"
                      </span>
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </motion.div>

      {/* Full-screen Lightbox */}
      <Lightbox
        photo={selectedPhoto}
        isOpen={!!selectedPhoto}
        onClose={() => setSelectedPhoto(null)}
        onPrev={handlePrev}
        onNext={handleNext}
        isFavorite={selectedPhoto ? favorites.includes(selectedPhoto.id) : false}
        onToggleFavorite={onToggleFavorite}
        currentIndex={currentPhotoIndex}
        totalCount={filteredPhotos.length}
      />
    </section>
  );
}
