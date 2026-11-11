import React, { useState, useEffect } from 'react';
import { 
  Heart, 
  Menu, 
  X, 
  Moon, 
  Sun, 
  Sparkles
} from 'lucide-react';

export default function Navbar({ 
  activeSection, 
  onNavigate, 
  favoritesCount, 
  onOpenFavorites, 
  darkMode,
  setDarkMode
}) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'gallery', label: 'Gallery' },
    { id: 'photobooth', label: 'Photo Booth' },
    { id: 'arcade', label: 'JK Arcade ♡' },
    { id: 'timeline', label: 'Timeline' },
    { id: 'little-things', label: 'Little Things' },
    { id: 'surprise', label: 'A Little Surprise ♡' },
  ];

  const handleNavClick = (id) => {
    onNavigate(id);
    setMobileMenuOpen(false);
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ${
          isScrolled
            ? 'glass-panel py-3 shadow-dreamy'
            : 'bg-transparent py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Logo */}
          <button
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-2 group text-left"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-lavender to-soft-pink flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
              <span className="text-xs">💜</span>
            </div>
            <div>
              <span className="font-serif tracking-wider font-semibold text-lg text-deep-purple dark:text-cream group-hover:text-lavender-dark dark:group-hover:text-lavender transition-colors">
                jungkook.zip
              </span>
              <span className="text-xs text-lavender-dark dark:text-lavender-light ml-1 font-handwriting">
                ♡ his world
              </span>
            </div>
          </button>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            {navItems.map((item) => {
              const isActive = activeSection === item.id;
              const isSpecial = item.id === 'surprise';
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-300 relative ${
                    isSpecial
                      ? 'bg-gradient-to-r from-soft-pink to-lavender-light text-deep-purple font-semibold shadow-sm hover:shadow-dreamy hover:scale-105'
                      : isActive
                      ? 'text-deep-purple dark:text-cream bg-lavender/20 dark:bg-lavender/30 font-semibold'
                      : 'text-deep-purple/75 dark:text-cream/80 hover:text-deep-purple dark:hover:text-cream hover:bg-black/5 dark:hover:bg-white/10'
                  }`}
                >
                  {item.label}
                  {isActive && !isSpecial && (
                    <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-lavender-dark dark:bg-lavender rounded-full" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Controls: Favorites, Theme, Mobile toggle */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Favorites Button with Badge */}
            <button
              onClick={onOpenFavorites}
              title="View Favorited Photos"
              className="relative p-2 rounded-full glass-pill text-deep-purple dark:text-cream hover:bg-lavender/20 transition-all hover:scale-105"
            >
              <Heart
                size={17}
                className={favoritesCount > 0 ? "fill-lavender text-lavender" : "text-deep-purple dark:text-cream"}
              />
              {favoritesCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-gradient-to-r from-lavender to-soft-pink-dark text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-sm animate-scale">
                  {favoritesCount}
                </span>
              )}
            </button>

            {/* Theme Toggle */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              title={darkMode ? "Switch to Lavender Day" : "Switch to Midnight Purple"}
              className="p-2 rounded-full glass-pill text-deep-purple dark:text-cream hover:bg-lavender/20 transition-transform hover:rotate-12"
            >
              {darkMode ? <Sun size={17} className="text-amber-300" /> : <Moon size={17} />}
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-full md:hidden glass-pill text-deep-purple dark:text-cream"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Animated Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-30 md:hidden bg-deep-purple-dark/60 backdrop-blur-md flex flex-col justify-center items-center px-6">
          <div className="w-full max-w-sm glass-panel p-6 rounded-3xl shadow-dreamy-purple flex flex-col gap-3 text-center border border-lavender/30">
            <div className="w-12 h-12 mx-auto rounded-full bg-lavender/20 flex items-center justify-center mb-1">
              <span className="text-xl">🐰</span>
            </div>
            <h3 className="font-serif text-xl font-bold text-deep-purple dark:text-cream">
              jungkook.zip
            </h3>
            <p className="text-xs text-lavender-dark dark:text-lavender-light mb-2">
              explore his dreamy world
            </p>

            <div className="flex flex-col gap-2">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`py-2.5 px-4 rounded-2xl text-base font-medium transition-all ${
                    activeSection === item.id
                      ? 'bg-lavender text-white font-semibold shadow-sm'
                      : 'text-deep-purple dark:text-cream hover:bg-lavender/20'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>

            <button
              onClick={() => setMobileMenuOpen(false)}
              className="mt-3 text-xs text-lavender hover:underline"
            >
              Close menu ✕
            </button>
          </div>
        </div>
      )}
    </>
  );
}
