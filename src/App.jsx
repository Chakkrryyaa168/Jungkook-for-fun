import React, { lazy, Suspense, useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Gallery from './components/Gallery';
import PhotoBooth from './components/PhotoBooth';
import Timeline from './components/Timeline';
import FlipCards from './components/FlipCards';
import DailyFortune from './components/DailyFortune';
import SecretLetter from './components/SecretLetter';
import Footer from './components/Footer';
import HeartCursor from './components/HeartCursor';
import FavoritesModal from './components/FavoritesModal';
import LoadingScreen from './components/LoadingScreen';

const Arcade = lazy(() => import('./components/Arcade'));

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(() => {
    if (window.location.pathname === '/gallery') return 'gallery';
    if (window.location.pathname === '/photo-booth') return 'photobooth';
    if (window.location.pathname === '/arcade') return 'arcade';
    return 'home';
  });
  const [activeSection, setActiveSection] = useState(() => page);
  const [favorites, setFavorites] = useState([]);
  const [isFavoritesOpen, setIsFavoritesOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  // Load saved preferences from localStorage
  useEffect(() => {
    const handlePopState = () => {
      const currentPage = window.location.pathname === '/gallery'
        ? 'gallery'
        : window.location.pathname === '/photo-booth'
          ? 'photobooth'
          : window.location.pathname === '/arcade'
            ? 'arcade'
          : 'home';
      setPage(currentPage);
      setActiveSection(currentPage === 'home' ? 'home' : currentPage);
      window.scrollTo(0, 0);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  useEffect(() => {
    try {
      const savedFavs = localStorage.getItem('jungkook_favorites');
      if (savedFavs) {
        setFavorites(JSON.parse(savedFavs));
      } else {
        // Pre-favorite a couple iconic ones as a lovely default
        setFavorites(['jk-1', 'jk-5', 'jk-6']);
      }

      const savedTheme = localStorage.getItem('jungkook_theme');
      if (savedTheme === 'dark') {
        setDarkMode(true);
      }
    } catch (e) {
      console.error(e);
    }

    // Dismiss loading screen after gentle delay
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1200);

    return () => clearTimeout(timer);
  }, []);

  // Update HTML dark class
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('jungkook_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('jungkook_theme', 'light');
    }
  }, [darkMode]);

  // Track active section on scroll
  useEffect(() => {
    const handleScroll = () => {
      if (page !== 'home') return;
      const sections = ['home', 'timeline', 'little-things', 'daily-fortune', 'surprise'];
      const scrollY = window.scrollY;

      for (const sectionId of sections) {
        const el = document.getElementById(sectionId);
        if (el) {
          const top = el.offsetTop - 120;
          const height = el.offsetHeight;
          if (scrollY >= top && scrollY < top + height) {
            setActiveSection(sectionId);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [page]);

  // Toggle favorite photo
  const handleToggleFavorite = (photoId) => {
    setFavorites((prev) => {
      let updated;
      if (prev.includes(photoId)) {
        updated = prev.filter((id) => id !== photoId);
      } else {
        updated = [...prev, photoId];
      }
      try {
        localStorage.setItem('jungkook_favorites', JSON.stringify(updated));
      } catch (err) {}
      return updated;
    });
  };

  // Navigation scroll helper
  const navigate = (id) => {
    if (id === 'gallery' || id === 'photobooth' || id === 'arcade') {
      const path = id === 'gallery' ? '/gallery' : id === 'photobooth' ? '/photo-booth' : '/arcade';
      if (window.location.pathname !== path) {
        window.history.pushState({}, '', path);
      }
      setPage(id);
      setActiveSection(id);
      window.scrollTo(0, 0);
      return;
    }

    if (window.location.pathname !== '/') {
      window.history.pushState({}, '', '/');
    }
    setPage('home');
    setActiveSection(id);

    if (id === 'home') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
      });
    });
  };

  const scrollToTop = () => {
    navigate('home');
  };

  return (
    <div className="min-h-screen relative overflow-x-hidden transition-colors duration-500">
      {/* Initial Romantic Loading Screen */}
      <LoadingScreen isLoaded={!isLoading} />

      {/* Desktop Heart Follower & Click Sparkles */}
      <HeartCursor />

      {/* Sticky Glassmorphic Navbar */}
      <Navbar
        activeSection={activeSection}
        onNavigate={navigate}
        favoritesCount={favorites.length}
        onOpenFavorites={() => setIsFavoritesOpen(true)}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
      />

      <main>
        {page === 'gallery' ? (
          <Gallery
            favorites={favorites}
            onToggleFavorite={handleToggleFavorite}
          />
        ) : page === 'photobooth' ? (
          <PhotoBooth />
        ) : page === 'arcade' ? (
          <Suspense fallback={<div className="arcade-page text-center text-lavender-dark">Opening JK Arcade ♡</div>}>
            <Arcade onBack={() => navigate('home')} />
          </Suspense>
        ) : (
          <>
            <Hero onEnter={() => navigate('gallery')} />
            <Timeline />
            <FlipCards />
            <DailyFortune />
            <SecretLetter />
          </>
        )}
      </main>

      {/* Footer with quotes and back-to-top */}
      <Footer onScrollTop={scrollToTop} />

      {/* Favorites Modal */}
      <FavoritesModal
        isOpen={isFavoritesOpen}
        onClose={() => setIsFavoritesOpen(false)}
        favorites={favorites}
        onToggleFavorite={handleToggleFavorite}
        onSelectPhoto={() => {
          navigate('gallery');
        }}
      />
    </div>
  );
}
