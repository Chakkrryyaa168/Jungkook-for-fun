import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Camera, Download, ImagePlus, RefreshCw, Palette } from 'lucide-react';
import { photos, FALLBACK_IMAGE } from '../data/photos';

const STORAGE_KEY = 'jungkook_photo_booth';

const STRIP_THEMES = [
  { id: 'lavender', name: 'Lavender Dream', bg: 'bg-[#B9A0D9]', text: 'text-[#211B38]' },
  { id: 'deep-purple', name: 'Midnight Purple', bg: 'bg-[#211B38]', text: 'text-[#FFF8F0]' },
  { id: 'soft-pink', name: 'Strawberry Milk', bg: 'bg-[#F4DCEB]', text: 'text-[#211B38]' },
  { id: 'classic-white', name: 'Classic Polaroid', bg: 'bg-white', text: 'text-neutral-800' },
];

function getSavedPhotoBooth() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (!saved) return null;

    return {
      selectedPhotos: Array.isArray(saved.selectedPhotos) && saved.selectedPhotos.length === 4
        ? saved.selectedPhotos
        : [photos[0], photos[4], photos[5], photos[1]],
      activeTheme: STRIP_THEMES.find((theme) => theme.id === saved.activeTheme) || STRIP_THEMES[0],
      customText: typeof saved.customText === 'string' ? saved.customText : 'jungkook.zip ♡ 2026',
    };
  } catch (error) {
    console.error('Unable to load saved photo strip.', error);
    return null;
  }
}

function resizeImage(file) {
  return new Promise((resolve, reject) => {
    const imageUrl = URL.createObjectURL(file);
    const image = new Image();

    image.onload = () => {
      URL.revokeObjectURL(imageUrl);
      const maxDimension = 1200;
      const scale = Math.min(1, maxDimension / Math.max(image.naturalWidth, image.naturalHeight));
      const canvas = document.createElement('canvas');
      canvas.width = Math.round(image.naturalWidth * scale);
      canvas.height = Math.round(image.naturalHeight * scale);

      const context = canvas.getContext('2d');
      if (!context) {
        reject(new Error('Your browser could not prepare that image.'));
        return;
      }

      context.drawImage(image, 0, 0, canvas.width, canvas.height);
      resolve(canvas.toDataURL('image/jpeg', 0.82));
    };

    image.onerror = () => {
      URL.revokeObjectURL(imageUrl);
      reject(new Error('That image could not be opened. Try another photo.'));
    };

    image.src = imageUrl;
  });
}

export default function PhotoBooth() {
  const [savedSettings] = useState(getSavedPhotoBooth);
  const [selectedPhotos, setSelectedPhotos] = useState(
    savedSettings?.selectedPhotos || [photos[0], photos[4], photos[5], photos[1]]
  );
  const [activeTheme, setActiveTheme] = useState(savedSettings?.activeTheme || STRIP_THEMES[0]);
  const [customText, setCustomText] = useState(savedSettings?.customText || 'jungkook.zip ♡ 2026');
  const [notice, setNotice] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        selectedPhotos,
        activeTheme: activeTheme.id,
        customText,
      }));
      setError('');
    } catch (storageError) {
      console.error('Unable to save photo strip on this device.', storageError);
      setError('This browser could not save the strip. Try a smaller image or free up browser storage.');
    }
  }, [selectedPhotos, activeTheme, customText]);

  const shufflePhotos = () => {
    const shuffled = [...photos].sort(() => 0.5 - Math.random()).slice(0, 4);
    setSelectedPhotos(shuffled);
  };

  const handleSelectSlot = (slotIndex) => {
    // Cycle to next available photo
    const currentPhoto = selectedPhotos[slotIndex];
    const currentIndex = photos.findIndex((p) => p.id === currentPhoto.id);
    const nextPhoto = photos[(currentIndex + 1) % photos.length];
    
    const updated = [...selectedPhotos];
    updated[slotIndex] = nextPhoto;
    setSelectedPhotos(updated);
  };

  const handleUploadPhoto = async (slotIndex, file) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setError('Please choose an image file.');
      return;
    }

    try {
      const imageData = await resizeImage(file);
      const updated = [...selectedPhotos];
      updated[slotIndex] = {
        ...updated[slotIndex],
        id: `custom-${slotIndex}-${Date.now()}`,
        title: file.name,
        url: imageData,
        isCustom: true,
      };
      setSelectedPhotos(updated);
      setError('');
      setNotice('Your photo is saved on this device ♡');
    } catch (uploadError) {
      console.error('Unable to add photo to strip.', uploadError);
      setError(uploadError.message || 'Unable to add that photo. Please try another image.');
    }
  };

  const handlePrint = () => {
    setNotice('Choose “Save as PDF” in the print window to keep your photo strip.');
    window.print();
  };

  return (
    <section id="photobooth" className="py-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto relative">
      <div className="text-center max-w-2xl mx-auto mb-12">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full glass-pill text-xs font-semibold uppercase tracking-wider text-lavender-dark dark:text-lavender mb-3">
          <Camera size={14} />
          <span>Korean 4-Cut Studio (인생네컷)</span>
        </div>
        <h3 className="text-3xl sm:text-4xl font-serif font-bold text-deep-purple dark:text-cream tracking-tight mb-2">
          Make Your 4-Cut JK Photo Strip ♡
        </h3>
        <p className="text-xs sm:text-sm text-deep-purple/75 dark:text-cream/80 font-normal leading-relaxed">
          Upload your own photos into the frames, choose a color and caption, then print or save your strip. Your choices stay saved on this device.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Strip Preview on Left */}
        <div className="lg:col-span-5 flex justify-center">
          <div className="photo-strip-print relative group max-w-[280px] w-full">
            {/* Washi Tape */}
            <div className="washi-tape" />

            {/* 4-Cut Strip Frame */}
            <div
              className={`p-4 pb-8 rounded-2xl shadow-polaroid border border-white/40 transition-colors duration-500 ${activeTheme.bg} ${activeTheme.text}`}
            >
              {/* Top Header */}
              <div className="text-center pb-3">
                <span className="font-mono text-[10px] tracking-widest uppercase opacity-80">
                  ★ JUNGKOOK PHOTO STUDIO ★
                </span>
              </div>

              {/* 4 Frames */}
              <div className="space-y-2.5">
                {selectedPhotos.map((photo, i) => (
                  <div
                    key={i}
                    className="relative aspect-[4/3] rounded-lg overflow-hidden bg-black/10 group/slot shadow-inner"
                  >
                    <img
                      src={photo.url}
                      alt={photo.title}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = FALLBACK_IMAGE;
                      }}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover/slot:scale-105"
                    />
                    <div className="absolute inset-x-0 bottom-0 flex justify-center gap-2 bg-gradient-to-t from-black/70 to-transparent p-2 pt-6 opacity-100 sm:opacity-0 sm:group-hover/slot:opacity-100 transition-opacity">
                      <button
                        type="button"
                        onClick={() => handleSelectSlot(i)}
                        className="inline-flex items-center gap-1 rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-semibold text-deep-purple shadow"
                        aria-label={`Choose another Jungkook photo for frame ${i + 1}`}
                      >
                        <RefreshCw size={11} />
                        Next
                      </button>
                      <label className="inline-flex cursor-pointer items-center gap-1 rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-semibold text-deep-purple shadow">
                        <ImagePlus size={12} />
                        {photo.isCustom ? 'Replace' : 'Your photo'}
                        <input
                          type="file"
                          accept="image/*"
                          className="sr-only"
                          aria-label={`Upload your own photo for frame ${i + 1}`}
                          onChange={(event) => {
                            handleUploadPhoto(i, event.target.files?.[0]);
                            event.target.value = '';
                          }}
                        />
                      </label>
                    </div>
                  </div>
                ))}
              </div>

              {/* Bottom Strip Footer */}
              <div className="mt-4 pt-3 border-t border-black/10 text-center">
                <p className="font-handwriting text-xl font-bold tracking-wide">
                  {customText}
                </p>
                <div className="flex items-center justify-center gap-1.5 text-[9px] font-mono mt-1 opacity-70">
                  <span>970901</span>
                  <span>•</span>
                  <span>FOR MY GIRL</span>
                  <span>•</span>
                  <span>💜</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Customization Controls on Right */}
        <div className="lg:col-span-7 bg-white dark:bg-deep-purple-light p-6 sm:p-8 rounded-3xl shadow-polaroid border border-white/80 dark:border-lavender/20 space-y-6">
          <div>
            <h4 className="font-serif text-lg font-bold text-deep-purple dark:text-cream mb-1">
              Customize Your Strip
            </h4>
            <p className="text-xs text-lavender-dark dark:text-lavender">
              Pick a frame color, write a caption, or upload your own photo in any frame. Your strip is saved automatically in this browser.
            </p>
          </div>

          {/* Border Theme Selector */}
          <div>
            <label className="block text-xs font-semibold text-deep-purple dark:text-cream mb-2 flex items-center gap-1.5">
              <Palette size={13} />
              <span>Frame Color:</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {STRIP_THEMES.map((theme) => (
                <button
                  key={theme.id}
                  onClick={() => setActiveTheme(theme)}
                  className={`p-2.5 rounded-xl border text-xs font-medium text-center transition-all ${
                    activeTheme.id === theme.id
                      ? 'border-lavender shadow-dreamy ring-2 ring-lavender/30 scale-102'
                      : 'border-lavender/20 hover:border-lavender/50'
                  }`}
                >
                  <span className={`w-4 h-4 rounded-full ${theme.bg} inline-block mb-1 border border-black/10`} />
                  <p className="text-[11px] text-deep-purple dark:text-cream">{theme.name}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Custom Text Input */}
          <div>
            <label className="block text-xs font-semibold text-deep-purple dark:text-cream mb-1">
              Bottom Caption:
            </label>
            <input
              type="text"
              value={customText}
              onChange={(e) => setCustomText(e.target.value)}
              maxLength={30}
              className="w-full px-3 py-2 rounded-xl border border-lavender/40 bg-cream/30 dark:bg-black/30 text-sm font-handwriting text-deep-purple dark:text-cream focus:outline-none focus:ring-2 focus:ring-lavender"
            />
          </div>

          {/* Action Buttons */}
          <div className="pt-2 flex flex-wrap gap-3">
            <button
              onClick={shufflePhotos}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full glass-pill text-xs font-semibold text-deep-purple dark:text-cream hover:bg-lavender/20 shadow-sm transition-all"
            >
              <RefreshCw size={13} />
              <span>Randomize Photos 🔀</span>
            </button>

            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-5 py-2 rounded-full bg-lavender text-white text-xs font-bold shadow-dreamy hover:bg-lavender-dark transition-all hover:scale-105"
            >
              <Download size={13} />
              <span>Print / Save Strip 🖨️</span>
            </button>
          </div>
          {(notice || error) && (
            <p role={error ? 'alert' : 'status'} className={`text-xs ${error ? 'text-rose-600' : 'text-lavender-dark dark:text-lavender'}`}>
              {error || notice}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
