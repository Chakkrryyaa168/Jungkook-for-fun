import React, { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Archive, Check, Download, Heart, Images, Sparkles } from 'lucide-react';
import { categories, photos, FALLBACK_IMAGE } from '../data/photos';
import Lightbox from './Lightbox';

const iconMap = {
  Sparkles,
  Coffee: Sparkles,
  Camera: Images,
  Flame: Sparkles,
  Crown: Sparkles,
  Heart,
};

function safeFilename(value) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'jungkook-photo';
}

function saveBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  anchor.style.display = 'none';
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1200);
}

async function fetchPhoto(photo) {
  const response = await fetch(photo.url);
  if (!response.ok) throw new Error(`Could not download “${photo.title}” (${response.status}).`);
  return response.blob();
}

export default function Gallery({ favorites, onToggleFavorite }) {
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [selectedForDownload, setSelectedForDownload] = useState([]);
  const [imageLoadedState, setImageLoadedState] = useState({});
  const [downloadMessage, setDownloadMessage] = useState('');
  const [isDownloading, setIsDownloading] = useState(false);

  const filteredPhotos = useMemo(() => (
    activeCategory === 'all' ? photos : photos.filter((photo) => photo.category === activeCategory)
  ), [activeCategory]);

  const currentPhotoIndex = selectedPhoto
    ? filteredPhotos.findIndex((photo) => photo.id === selectedPhoto.id)
    : -1;

  const downloadOne = async (photo) => {
    setIsDownloading(true);
    setDownloadMessage('');
    try {
      const blob = await fetchPhoto(photo);
      const extension = blob.type.includes('png') ? 'png' : 'jpg';
      saveBlob(blob, `${safeFilename(photo.title)}.${extension}`);
      setDownloadMessage(`Saved “${photo.title}” to your downloads.`);
    } catch (error) {
      console.error('Gallery photo download failed.', error);
      setDownloadMessage(`${error.message} Open the source link to download it directly.`);
    } finally {
      setIsDownloading(false);
    }
  };

  const downloadZip = async (items) => {
    if (!items.length || isDownloading) return;
    setIsDownloading(true);
    setDownloadMessage('');
    try {
      const { default: JSZip } = await import('jszip');
      const zip = new JSZip();
      const results = await Promise.all(items.map(async (photo) => ({
        photo,
        blob: await fetchPhoto(photo),
      })));
      results.forEach(({ photo, blob }) => {
        const extension = blob.type.includes('png') ? 'png' : 'jpg';
        zip.file(`${safeFilename(photo.title)}.${extension}`, blob);
      });
      zip.file('ATTRIBUTION.txt', results.map(({ photo }) => (
        `${photo.title}\nCreator: ${photo.creator}\nLicense: ${photo.license}\nSource: ${photo.sourceUrl}\n`
      )).join('\n'));
      const archive = await zip.generateAsync({ type: 'blob' });
      saveBlob(archive, 'jungkook-zip-gallery.zip');
      setDownloadMessage(`Saved ${results.length} photos in jungkook-zip-gallery.zip.`);
    } catch (error) {
      console.error('Gallery ZIP download failed.', error);
      setDownloadMessage(`${error.message} Try downloading photos one at a time.`);
    } finally {
      setIsDownloading(false);
    }
  };

  const toggleSelected = (photoId) => {
    setSelectedForDownload((current) => current.includes(photoId)
      ? current.filter((id) => id !== photoId)
      : [...current, photoId]);
  };

  const movePhoto = (direction) => {
    if (currentPhotoIndex < 0 || !filteredPhotos.length) return;
    const nextIndex = (currentPhotoIndex + direction + filteredPhotos.length) % filteredPhotos.length;
    setSelectedPhoto(filteredPhotos[nextIndex]);
  };

  return (
    <section className="gallery-page">
      <header className="page-heading gallery-heading">
        <span className="eyebrow-pill"><Images size={14} /> little moments, kept forever</span>
        <h1>The JK <em>Photo Album</em></h1>
        <p>A polaroid-sized collection of the moments that make us smile.</p>
        <div className="gallery-count">{photos.length} lovely little moments <span>♡</span></div>
      </header>

      <div className="gallery-filters" aria-label="Filter photos by category">
        {categories.map((category) => {
          const Icon = iconMap[category.icon] || Sparkles;
          const count = category.id === 'all' ? photos.length : photos.filter((photo) => photo.category === category.id).length;
          return (
            <button
              type="button"
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`gallery-filter ${activeCategory === category.id ? 'active' : ''}`}
            >
              <Icon size={14} />
              {category.label}
              <span>{count}</span>
            </button>
          );
        })}
      </div>

      <div className="gallery-download-bar">
        <span>{selectedForDownload.length ? `${selectedForDownload.length} selected` : 'Save your favorites to your device'}</span>
        <div className="gallery-download-actions">
          {selectedForDownload.length > 0 && (
            <button
              type="button"
              className="button-secondary"
              onClick={() => downloadZip(photos.filter((photo) => selectedForDownload.includes(photo.id)))}
              disabled={isDownloading}
            >
              <Archive size={15} /> Download selected
            </button>
          )}
          <button type="button" className="button-secondary" onClick={() => downloadZip(photos)} disabled={isDownloading}>
            <Archive size={15} /> Download all as ZIP
          </button>
        </div>
      </div>
      {downloadMessage && <p className="gallery-download-message" role="status">{downloadMessage}</p>}

      <motion.div layout className="gallery-grid">
        <AnimatePresence mode="popLayout">
          {filteredPhotos.map((photo, index) => {
            const isFavorite = favorites.includes(photo.id);
            const isSelected = selectedForDownload.includes(photo.id);
            const isLoaded = imageLoadedState[photo.id];
            return (
              <motion.article
                key={photo.id}
                layout
                initial={{ opacity: 0, y: 16, rotate: -1 }}
                animate={{ opacity: 1, y: 0, rotate: index % 2 ? 1 : -1 }}
                exit={{ opacity: 0, scale: .94 }}
                transition={{ duration: .32, delay: Math.min(index * .025, .25) }}
                className={`polaroid-card ${isSelected ? 'selected' : ''}`}
              >
                <div className={`polaroid-image ${photo.aspect}`}>
                  {!isLoaded && <div className="image-shimmer" />}
                  <img
                    src={photo.url}
                    alt={photo.title}
                    loading="lazy"
                    onLoad={() => setImageLoadedState((state) => ({ ...state, [photo.id]: true }))}
                    onError={(event) => {
                      event.currentTarget.onerror = null;
                      event.currentTarget.src = FALLBACK_IMAGE;
                      setImageLoadedState((state) => ({ ...state, [photo.id]: true }));
                    }}
                    onClick={() => setSelectedPhoto(photo)}
                    className={isLoaded ? 'loaded' : ''}
                  />
                  <button
                    type="button"
                    className={`photo-select-button ${isSelected ? 'selected' : ''}`}
                    onClick={() => toggleSelected(photo.id)}
                    aria-label={`${isSelected ? 'Deselect' : 'Select'} ${photo.title} for download`}
                  >
                    {isSelected && <Check size={14} />}
                  </button>
                  <button
                    type="button"
                    className={`photo-heart-button ${isFavorite ? 'favorited' : ''}`}
                    onClick={() => onToggleFavorite(photo.id)}
                    aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
                  >
                    <Heart size={17} fill={isFavorite ? 'currentColor' : 'none'} />
                  </button>
                  <button
                    type="button"
                    className="photo-open-button"
                    onClick={() => setSelectedPhoto(photo)}
                    aria-label={`View ${photo.title}`}
                  >
                    View photo
                  </button>
                  <button
                    type="button"
                    className="photo-download-button"
                    disabled={isDownloading}
                    onClick={() => downloadOne(photo)}
                    aria-label={`Download ${photo.title}`}
                  >
                    <Download size={15} />
                  </button>
                </div>
                <div className="polaroid-caption">
                  <span className="photo-category-tag">{photo.categoryLabel}</span>
                  <h2 onClick={() => setSelectedPhoto(photo)}>{photo.title}</h2>
                  <p>{photo.date} <span>·</span> {photo.subtitle}</p>
                  {photo.note && <blockquote>“{photo.note}”</blockquote>}
                  <a className="photo-attribution" href={photo.sourceUrl} target="_blank" rel="noreferrer">
                    Photo: {photo.creator} · {photo.license} · source ↗
                  </a>
                </div>
              </motion.article>
            );
          })}
        </AnimatePresence>
      </motion.div>

      <p className="gallery-license-note">
        Images are from Wikimedia Commons and are shared under the listed terms. Please follow each source page’s attribution requirements when reusing them.
      </p>

      <Lightbox
        photo={selectedPhoto}
        isOpen={Boolean(selectedPhoto)}
        onClose={() => setSelectedPhoto(null)}
        onPrev={() => movePhoto(-1)}
        onNext={() => movePhoto(1)}
        isFavorite={selectedPhoto ? favorites.includes(selectedPhoto.id) : false}
        onToggleFavorite={(photoId) => onToggleFavorite(photoId)}
        onDownload={downloadOne}
        currentIndex={Math.max(currentPhotoIndex, 0)}
        totalCount={filteredPhotos.length}
      />
    </section>
  );
}
