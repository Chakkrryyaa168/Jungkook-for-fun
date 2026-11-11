import React from 'react';
import { motion } from 'framer-motion';
import { Heart, House, Images, Gamepad2, Music2, Mail, Moon, Sun } from 'lucide-react';

const navItems = [
  { id: 'home', label: 'Home', icon: House },
  { id: 'gallery', label: 'Gallery', icon: Images },
  { id: 'arcade', label: 'JK Arcade', icon: Gamepad2 },
  { id: 'music', label: 'Music', icon: Music2 },
  { id: 'surprise', label: 'Surprise', icon: Mail },
];

export default function Navbar({ activeSection, onNavigate, favoritesCount, onOpenFavorites, darkMode, setDarkMode }) {
  return (
    <>
      <header className="site-header">
        <button className="site-brand" onClick={() => onNavigate('home')} aria-label="jungkook.zip home">
          <span className="brand-bow">୨୧</span>
          <span>jungkook.zip <i>♡</i></span>
        </button>

        <nav className="desktop-nav" aria-label="Main navigation">
          {navItems.map(({ id, label, icon: Icon }) => (
            <button
              type="button"
              key={id}
              onClick={() => onNavigate(id)}
              className={`nav-item ${activeSection === id ? 'active' : ''}`}
              aria-current={activeSection === id ? 'page' : undefined}
            >
              <Icon size={16} strokeWidth={1.8} />
              <span>{label}</span>
              {activeSection === id && <motion.span layoutId="active-nav" className="nav-active-pill" />}
            </button>
          ))}
        </nav>

        <div className="header-actions">
          <button type="button" className="header-icon" onClick={onOpenFavorites} aria-label={`Open ${favoritesCount} saved favorites`}>
            <Heart size={18} />
            {favoritesCount > 0 && <span className="favorite-badge">{favoritesCount}</span>}
          </button>
          <button
            type="button"
            className="header-icon theme-icon"
            onClick={() => setDarkMode(!darkMode)}
            aria-label={darkMode ? 'Switch to soft pink theme' : 'Switch to rose evening theme'}
            title={darkMode ? 'Soft pink' : 'Rose evening'}
          >
            {darkMode ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </div>
      </header>

      <nav className="mobile-nav" aria-label="Mobile navigation">
        {navItems.map(({ id, label, icon: Icon }) => (
          <button
            type="button"
            key={id}
            onClick={() => onNavigate(id)}
            className={`mobile-nav-item ${activeSection === id ? 'active' : ''}`}
            aria-current={activeSection === id ? 'page' : undefined}
          >
            <span className="mobile-nav-icon"><Icon size={19} strokeWidth={1.8} /></span>
            <span>{label}</span>
          </button>
        ))}
      </nav>
    </>
  );
}
