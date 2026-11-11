import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Camera, Download, ImagePlus, RefreshCw, Palette, Smartphone, Monitor } from 'lucide-react';
import { photos, FALLBACK_IMAGE } from '../data/photos';

const STORAGE_KEY = 'jungkook_photo_booth';
const DATABASE_NAME = 'jungkook-scrapbook';
const DATABASE_STORE = 'photo-booth';

const STRIP_THEMES = [
  { id: 'lavender', name: 'Baby Pink', bg: 'bg-[#FFDDE8]', text: 'text-[#654454]', exportBackground: '#FFDDE8', exportText: '#654454' },
  { id: 'deep-purple', name: 'Rose Pink', bg: 'bg-[#E8B4C8]', text: 'text-[#654454]', exportBackground: '#E8B4C8', exportText: '#654454' },
  { id: 'soft-pink', name: 'Blush', bg: 'bg-[#FFF0F5]', text: 'text-[#654454]', exportBackground: '#FFF0F5', exportText: '#654454' },
  { id: 'classic-white', name: 'Classic Cream', bg: 'bg-white', text: 'text-[#654454]', exportBackground: '#FFFFFF', exportText: '#654454' },
];

const defaultStripPhotos = () => {
  const downloadablePhotos = photos.filter((photo) => (
    photo.url.startsWith('https://upload.wikimedia.org/')
    || photo.url.startsWith('https://thumb.wikimedia.org/')
  )).slice(0, 4);
  return downloadablePhotos.length === 4
    ? downloadablePhotos
    : [photos[0], photos[4], photos[5], photos[1]];
};

function getSavedPhotoBooth() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (!saved) return null;

    return {
      selectedPhotos: Array.isArray(saved.selectedPhotos) && saved.selectedPhotos.length === 4
        ? saved.selectedPhotos
        : defaultStripPhotos(),
      activeTheme: STRIP_THEMES.find((theme) => theme.id === saved.activeTheme) || STRIP_THEMES[0],
      customText: typeof saved.customText === 'string' ? saved.customText : 'jungkook.zip ♡ 2026',
    };
  } catch (error) {
    console.error('Unable to load saved photo strip.', error);
    return null;
  }
}

function openPhotoBoothDatabase() {
  return new Promise((resolve, reject) => {
    if (!window.indexedDB) {
      reject(new Error('Device storage is unavailable.'));
      return;
    }

    const request = window.indexedDB.open(DATABASE_NAME, 1);
    request.onupgradeneeded = () => {
      if (!request.result.objectStoreNames.contains(DATABASE_STORE)) {
        request.result.createObjectStore(DATABASE_STORE);
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error || new Error('Could not open device storage.'));
  });
}

async function readSavedPhotoBooth() {
  const database = await openPhotoBoothDatabase();
  return new Promise((resolve, reject) => {
    const request = database.transaction(DATABASE_STORE, 'readonly')
      .objectStore(DATABASE_STORE)
      .get(STORAGE_KEY);
    request.onsuccess = () => {
      database.close();
      resolve(request.result || null);
    };
    request.onerror = () => {
      database.close();
      reject(request.error || new Error('Could not read the saved photo strip.'));
    };
  });
}

async function writeSavedPhotoBooth(settings) {
  const database = await openPhotoBoothDatabase();
  return new Promise((resolve, reject) => {
    const transaction = database.transaction(DATABASE_STORE, 'readwrite');
    transaction.objectStore(DATABASE_STORE).put(settings, STORAGE_KEY);
    transaction.oncomplete = () => {
      database.close();
      resolve();
    };
    transaction.onerror = () => {
      database.close();
      reject(transaction.error || new Error('Could not save the photo strip.'));
    };
    transaction.onabort = () => {
      database.close();
      reject(transaction.error || new Error('Saving the photo strip was interrupted.'));
    };
  });
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

function loadImageForExport(url) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    if (!url.startsWith('data:')) image.crossOrigin = 'anonymous';
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error('A photo could not be loaded for saving. Try uploading your own photo into that frame.'));
    image.src = url;
  });
}

async function createStripImage(selectedPhotos, themeId, caption) {
  const images = await Promise.all(selectedPhotos.map((photo) => loadImageForExport(photo.url)));
  const width = 900;
  const padding = 48;
  const photoWidth = width - padding * 2;
  const photoHeight = Math.round(photoWidth * 3 / 4);
  const headerHeight = 85;
  const gap = 22;
  const footerHeight = 190;
  const height = padding * 2 + headerHeight + photoHeight * images.length + gap * (images.length - 1) + footerHeight;
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext('2d');
  if (!context) throw new Error('Your browser could not create the photo strip image.');

  const theme = STRIP_THEMES.find((item) => item.id === themeId) || STRIP_THEMES[0];
  const background = theme.exportBackground;
  const textColor = theme.exportText;
  context.fillStyle = background;
  context.fillRect(0, 0, width, height);
  context.fillStyle = textColor;
  context.textAlign = 'center';
  context.font = '600 23px Georgia, serif';
  context.fillText('★  JUNGKOOK PHOTO STUDIO  ★', width / 2, padding + 34);

  let y = padding + headerHeight;
  images.forEach((image) => {
    const imageRatio = image.naturalWidth / image.naturalHeight;
    const frameRatio = photoWidth / photoHeight;
    let sourceX = 0;
    let sourceY = 0;
    let sourceWidth = image.naturalWidth;
    let sourceHeight = image.naturalHeight;
    if (imageRatio > frameRatio) {
      sourceWidth = image.naturalHeight * frameRatio;
      sourceX = (image.naturalWidth - sourceWidth) / 2;
    } else {
      sourceHeight = image.naturalWidth / frameRatio;
      sourceY = (image.naturalHeight - sourceHeight) / 2;
    }
    context.drawImage(image, sourceX, sourceY, sourceWidth, sourceHeight, padding, y, photoWidth, photoHeight);
    y += photoHeight + gap;
  });

  y += 14;
  context.fillStyle = textColor;
  context.globalAlpha = 0.9;
  context.font = 'italic 36px cursive';
  context.fillText(caption || 'jungkook.zip ♡', width / 2, y + 34, width - padding * 2);
  context.globalAlpha = 0.68;
  context.font = '18px Georgia, serif';
  context.fillText('970901  •  FOR MY GIRL  •  ♡', width / 2, y + 76);
  context.globalAlpha = 1;

  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) resolve(blob);
      else reject(new Error('Your browser could not finish the photo strip image.'));
    }, 'image/png');
  });
}

export default function PhotoBooth() {
  const [savedSettings] = useState(getSavedPhotoBooth);
  const [selectedPhotos, setSelectedPhotos] = useState(savedSettings?.selectedPhotos || defaultStripPhotos);
  const [activeTheme, setActiveTheme] = useState(savedSettings?.activeTheme || STRIP_THEMES[0]);
  const [customText, setCustomText] = useState(savedSettings?.customText || 'jungkook.zip ♡ 2026');
  const [notice, setNotice] = useState('');
  const [error, setError] = useState('');
  const [storageReady, setStorageReady] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  useEffect(() => {
    let isMounted = true;
    readSavedPhotoBooth()
      .then((saved) => {
        if (!isMounted || !saved) return;
        const theme = STRIP_THEMES.find((item) => item.id === saved.activeTheme);
        if (Array.isArray(saved.selectedPhotos) && saved.selectedPhotos.length === 4) {
          setSelectedPhotos(saved.selectedPhotos);
        }
        if (theme) setActiveTheme(theme);
        if (typeof saved.customText === 'string') setCustomText(saved.customText);
      })
      .catch((storageError) => {
        console.error('Unable to load photo strip from device storage.', storageError);
      })
      .finally(() => {
        if (isMounted) setStorageReady(true);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (!storageReady) return;
    const settings = { selectedPhotos, activeTheme: activeTheme.id, customText };
    try {
      writeSavedPhotoBooth(settings)
        .then(() => {
          setError('');
        })
        .catch((storageError) => {
          console.error('Unable to save photo strip to device storage.', storageError);
          try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
            setError('');
          } catch (fallbackError) {
            console.error('Unable to save photo strip in browser storage.', fallbackError);
            setError('Could not save on this device. Try a smaller photo or free up browser storage.');
          }
        });
    } catch (storageError) {
      console.error('Unable to save photo strip.', storageError);
      setError('Could not save on this device. Please try again.');
    }
  }, [selectedPhotos, activeTheme, customText, storageReady]);

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
    setNotice('Choose “Save as PDF” in the print window to keep your strip.');
    window.print();
  };

  const handleSaveImage = async () => {
    if (isExporting) return;
    setIsExporting(true);
    setNotice('Preparing your photo strip…');
    setError('');
    try {
      const isTouchDevice = window.matchMedia('(pointer: coarse)').matches;
      const fileHandlePromise = !isTouchDevice && 'showSaveFilePicker' in window
        ? window.showSaveFilePicker({
          suggestedName: 'jungkook-photo-strip.png',
          types: [{ description: 'PNG image', accept: { 'image/png': ['.png'] } }],
        }).catch((pickerError) => {
          if (pickerError.name === 'AbortError') return { canceled: true };
          console.error('Unable to open the save-file dialog.', pickerError);
          return null;
        })
        : null;
      const blob = await createStripImage(selectedPhotos, activeTheme.id, customText);
      const file = new File([blob], 'jungkook-photo-strip.png', { type: 'image/png' });

      if (fileHandlePromise) {
        const fileHandle = await fileHandlePromise;
        if (fileHandle?.canceled) {
          setNotice('Save cancelled. Your photo strip is still saved in this browser.');
          return;
        }
        if (fileHandle) {
          try {
            const writable = await fileHandle.createWritable();
            await writable.write(blob);
            await writable.close();
            setNotice('Photo strip saved to your chosen folder ♡');
            return;
          } catch (writeError) {
            console.error('Unable to save photo strip to the chosen folder.', writeError);
            setNotice('Could not save to that folder. Downloading the photo strip instead…');
          }
        }
      }

      if (isTouchDevice && navigator.canShare?.({ files: [file] }) && navigator.share) {
        try {
          await navigator.share({ files: [file], title: 'My Jungkook photo strip' });
          setNotice('Choose Save Image or Save to Files in the share menu ♡');
          return;
        } catch (shareError) {
          if (shareError.name === 'AbortError') throw shareError;
          console.error('Unable to open the mobile share menu.', shareError);
          setNotice('Share menu unavailable. Downloading your photo strip instead…');
        }
      }

      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'jungkook-photo-strip.png';
      link.style.display = 'none';
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.setTimeout(() => URL.revokeObjectURL(url), 1000);
      setNotice('Photo strip downloaded to your device ♡');
    } catch (saveError) {
      if (saveError.name === 'AbortError') {
        setNotice('Save or sharing was cancelled. Your photo strip is still saved in this browser.');
        return;
      }
      console.error('Unable to export photo strip.', saveError);
      setError(`${saveError.message} If a photo cannot be exported, replace it with an uploaded image and try again. You can also use “Save as PDF”.`);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <section id="photobooth" className="photo-booth-page py-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto relative">
      <div className="text-center max-w-2xl mx-auto mb-12">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full glass-pill text-xs font-semibold uppercase tracking-wider text-lavender-dark dark:text-lavender mb-3">
          <Camera size={14} />
          <span>Korean 4-Cut Studio (인생네컷)</span>
        </div>
        <h3 className="text-3xl sm:text-4xl font-serif font-bold text-deep-purple dark:text-cream tracking-tight mb-2">
          Make Your 4-Cut JK Photo Strip ♡
        </h3>
        <p className="text-xs sm:text-sm text-deep-purple/75 dark:text-cream/80 font-normal leading-relaxed">
          Upload your own photos into the frames, choose a color and caption, then save the finished strip to your device. Your choices stay saved on this device too.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Strip Preview on Left */}
        <div className="lg:col-span-5 flex justify-center">
          <div className="photo-strip-print relative group max-w-[280px] w-full">
            {/* Washi Tape */}
            <div className="washi-tape" />

            {/* 4-Cut Strip Frame */}
            <div className={`photo-strip-frame p-4 pb-8 rounded-2xl shadow-polaroid border border-white/60 transition-colors duration-500 ${activeTheme.bg} ${activeTheme.text}`}>
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
        <div className="photo-booth-controls lg:col-span-7 bg-white dark:bg-deep-purple-light p-6 sm:p-8 rounded-3xl shadow-polaroid border border-white/80 dark:border-lavender/20 space-y-6">
          <div>
            <h4 className="font-serif text-lg font-bold text-deep-purple dark:text-cream mb-1">
              Customize Your Strip
            </h4>
            <p className="text-xs text-lavender-dark dark:text-lavender">
              Pick a frame color, write a caption, or upload your own photo in any frame. Your design is saved in this browser, and you can download a copy to your phone or computer.
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
                      ? 'photo-theme-option-active border-lavender shadow-dreamy ring-2 ring-lavender/30 scale-102'
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

          <div className="photo-save-note">
            <span><Smartphone size={15} /> On mobile: choose “Save Image” or “Save to Files” in the share menu.</span>
            <span><Monitor size={15} /> On computer: save the PNG to a folder or use “Save as PDF”.</span>
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
              onClick={handleSaveImage}
              disabled={isExporting}
              className="photo-save-button inline-flex items-center gap-1.5 px-5 py-2 rounded-full bg-lavender text-white text-xs font-bold shadow-dreamy hover:bg-lavender-dark transition-all hover:scale-105 disabled:cursor-wait disabled:opacity-70"
            >
              <Download size={13} className={isExporting ? 'animate-bounce' : ''} />
              <span>{isExporting ? 'Preparing your strip…' : 'Save Photo Strip to Device ♡'}</span>
            </button>

            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full glass-pill text-xs font-semibold text-deep-purple dark:text-cream hover:bg-lavender/20 shadow-sm transition-all"
            >
              <span>Save as PDF</span>
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
