import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, Heart, Sparkles } from 'lucide-react';
import { FALLBACK_IMAGE, HERO_IMAGE, HERO_SECONDARY } from '../data/photos';

export default function Hero({ onEnter, onArcade, onMusic, onPhotoBooth }) {
  return (
    <section id="home" className="home-hero">
      <div className="hero-paper-hearts" aria-hidden="true">
        <motion.span animate={{ y: [0, -12, 0], rotate: [-12, 4, -12] }}>♡</motion.span>
        <motion.span animate={{ y: [0, 10, 0], rotate: [10, -3, 10] }}>୨୧</motion.span>
        <motion.span animate={{ y: [0, -9, 0], scale: [1, 1.1, 1] }}>✦</motion.span>
      </div>

      <div className="hero-inner">
        <motion.div
          className="hero-copy"
          initial={{ opacity: 0, x: -24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: .65 }}
        >
          <div className="eyebrow-pill"><Heart size={13} fill="currentColor" /> A scrapbook made with love</div>
          <p className="hero-logo-text">jungkook.zip ♡</p>
          <h1>A Little<br /><em>World of JK</em></h1>
          <p className="hero-subtitle">A little corner of happiness, made with love.</p>
          <div className="hero-buttons">
            <button type="button" className="button-primary" onClick={onEnter}>
              Open My Little World ♡ <ArrowUpRight size={17} />
            </button>
            <span className="hero-note">a tiny gift, just for you <span>🎀</span></span>
          </div>
          <div className="hero-shortcuts">
            <button onClick={onArcade}><span>🎮</span> Play in JK Arcade</button>
            <button onClick={onMusic}><span>♫</span> Visit the music room</button>
            <button onClick={onPhotoBooth}><span>📸</span> Make a photo strip</button>
          </div>
        </motion.div>

        <motion.div
          className="hero-photo-wrap"
          initial={{ opacity: 0, scale: .94, rotate: 2 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 100, damping: 16, delay: .12 }}
        >
          <div className="hero-photo-shadow" />
          <div className="hero-photo-card">
            <div className="hero-photo-sticker">♡</div>
            <img
              className="hero-photo-main"
              src={HERO_IMAGE}
              alt="Jungkook smiling in a soft portrait"
              onError={(event) => {
                event.currentTarget.onerror = null;
                event.currentTarget.src = FALLBACK_IMAGE;
              }}
            />
            <div className="hero-photo-caption">
              <span><Sparkles size={13} /> the golden maknae</span>
              <b>our favorite boy ♡</b>
            </div>
          </div>
          <div className="hero-mini-photo">
            <img
              src={HERO_SECONDARY}
              alt="Another Jungkook moment"
              onError={(event) => {
                event.currentTarget.onerror = null;
                event.currentTarget.src = FALLBACK_IMAGE;
              }}
            />
          </div>
          <span className="hero-bow">୨୧</span>
        </motion.div>
      </div>
      <div className="hero-bottom-note">made of little moments <span>·</span> held together with love</div>
    </section>
  );
}
