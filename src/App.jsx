import React, { lazy, Suspense, useCallback, useEffect, useState } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Gallery from './components/Gallery';
import PhotoBooth from './components/PhotoBooth';
import Timeline from './components/Timeline';
import FlipCards from './components/FlipCards';
import SecretLetter from './components/SecretLetter';
import MusicCorner from './components/MusicCorner';
import Footer from './components/Footer';
import FavoritesModal from './components/FavoritesModal';
import GiftIntro from './components/GiftIntro';

const Arcade = lazy(() => import('./components/Arcade'));
const PAGE_PATHS = {
  home: '/',
  gallery: '/gallery',
  photobooth: '/photo-booth',
  arcade: '/arcade',
  music: '/music',
  surprise: '/surprise',
};

function pageFromPath() {
  return Object.entries(PAGE_PATHS).find(([, path]) => path === window.location.pathname)?.[0] || 'home';
}

function hasSeenIntro() {
  try {
    return localStorage.getItem('jungkook_gift_intro_seen') === 'true';
  } catch (error) {
    console.error('Unable to read intro preference.', error);
    return false;
  }
}

export default function App() {
  const [page, setPage] = useState(pageFromPath);
  const [showGiftIntro, setShowGiftIntro] = useState(() => !hasSeenIntro());
  const [favorites, setFavorites] = useState([]);
  const [isFavoritesOpen, setIsFavoritesOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  const finishGiftIntro = useCallback(() => {
    try {
      localStorage.setItem('jungkook_gift_intro_seen', 'true');
    } catch (error) {
      console.error('Unable to save intro preference.', error);
    }
    setShowGiftIntro(false);
  }, []);

  useEffect(() => {
    const handlePopState = () => {
      setPage(pageFromPath());
      window.scrollTo(0, 0);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  useEffect(() => {
    try {
      const savedFavorites = localStorage.getItem('jungkook_favorites');
      setFavorites(savedFavorites ? JSON.parse(savedFavorites) : []);
      setDarkMode(localStorage.getItem('jungkook_theme') === 'dark');
    } catch (error) {
      console.error('Unable to load scrapbook preferences.', error);
    }
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
    try {
      localStorage.setItem('jungkook_theme', darkMode ? 'dark' : 'light');
    } catch (error) {
      console.error('Unable to save theme preference.', error);
    }
  }, [darkMode]);

  const navigate = useCallback((destination) => {
    const nextPage = PAGE_PATHS[destination] ? destination : 'home';
    const path = PAGE_PATHS[nextPage];
    if (window.location.pathname !== path) window.history.pushState({}, '', path);
    setPage(nextPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const toggleFavorite = (photoId) => {
    setFavorites((current) => {
      const updated = current.includes(photoId)
        ? current.filter((id) => id !== photoId)
        : [...current, photoId];
      try {
        localStorage.setItem('jungkook_favorites', JSON.stringify(updated));
      } catch (error) {
        console.error('Unable to save favorite photos.', error);
      }
      return updated;
    });
  };

  return (
    <div className="app-shell">
      <Navbar
        activeSection={page}
        onNavigate={navigate}
        favoritesCount={favorites.length}
        onOpenFavorites={() => setIsFavoritesOpen(true)}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
      />

      <main className="app-main">
        {page === 'gallery' ? (
          <Gallery favorites={favorites} onToggleFavorite={toggleFavorite} />
        ) : page === 'photobooth' ? (
          <PhotoBooth />
        ) : page === 'arcade' ? (
          <Suspense fallback={<div className="arcade-page text-center">Opening JK Arcade ♡</div>}>
            <Arcade onBack={() => navigate('home')} />
          </Suspense>
        ) : page === 'music' ? (
          <MusicCorner />
        ) : page === 'surprise' ? (
          <SecretLetter />
        ) : (
          <>
            <Hero
              onEnter={() => navigate('gallery')}
              onArcade={() => navigate('arcade')}
              onMusic={() => navigate('music')}
              onPhotoBooth={() => navigate('photobooth')}
            />
            <div className="home-extras">
              <Timeline />
              <FlipCards />
            </div>
          </>
        )}
      </main>

      <Footer onScrollTop={() => navigate('home')} />

      <FavoritesModal
        isOpen={isFavoritesOpen}
        onClose={() => setIsFavoritesOpen(false)}
        favorites={favorites}
        onToggleFavorite={toggleFavorite}
        onSelectPhoto={() => navigate('gallery')}
      />

      {showGiftIntro && <GiftIntro onFinish={finishGiftIntro} />}
    </div>
  );
}
