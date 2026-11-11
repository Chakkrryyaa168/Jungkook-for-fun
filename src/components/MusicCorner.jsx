import React from 'react';
import { motion } from 'framer-motion';
import { Disc3, ExternalLink, Headphones, Music2 } from 'lucide-react';
import { songs } from '../data/songs';
import { FALLBACK_IMAGE, photos } from '../data/photos';

export default function MusicCorner() {
  return (
    <section className="music-page">
      <header className="page-heading">
        <span className="eyebrow-pill"><Music2 size={14} /> little songs, big feelings</span>
        <h1>JK’s Listening Room <em>♡</em></h1>
        <p>Six Jungkook favorites for whatever kind of day you’re having.</p>
      </header>

      <div className="music-layout">
        <div className="music-track-grid">
          {songs.map((song, index) => {
            const photo = photos.find((item) => item.id === song.photoId) || photos[index];
            return (
              <motion.article
                key={song.title}
                className="music-card"
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * .07 }}
                whileHover={{ y: -4 }}
              >
                <div className="music-cover">
                  <img
                    src={photo.url}
                    alt=""
                    loading="lazy"
                    onError={(event) => {
                      event.currentTarget.onerror = null;
                      event.currentTarget.src = FALLBACK_IMAGE;
                    }}
                  />
                  <span className="music-cover-year">{song.year}</span>
                  <span className="music-disc"><Disc3 size={22} /></span>
                </div>
                <div className="music-card-info">
                  <h2>{song.title}</h2>
                  <p>{song.subtitle}</p>
                  <div className="music-links">
                    <a href={song.spotify} target="_blank" rel="noreferrer"><Headphones size={14} /> Spotify <ExternalLink size={12} /></a>
                    <a href={song.apple} target="_blank" rel="noreferrer">Apple Music <ExternalLink size={12} /></a>
                  </div>
                </div>
              </motion.article>
            );
          })}
        </div>

        <aside className="music-embed-card">
          <div className="music-embed-heading">
            <span className="music-note-icon"><Music2 size={19} /></span>
            <div><h2>Listen along ♡</h2><p>Choose when you’re ready to play.</p></div>
          </div>
          <iframe
            title="Jung Kook Spotify artist player"
            src="https://open.spotify.com/embed/artist/6HaGTQPmzraVmaVxvz6EUc?utm_source=generator"
            width="100%"
            height="352"
            frameBorder="0"
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
            loading="lazy"
          />
          <p className="music-no-autoplay">No autoplay — only your kind of day, your kind of song.</p>
        </aside>
      </div>
    </section>
  );
}
