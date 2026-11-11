import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { RotateCcw, Check } from 'lucide-react';
import { photos } from '../../data/photos';

const makePuzzle = (size) => {
  const pieces = Array.from({ length: size * size }, (_, index) => index);
  let shuffled = [...pieces];
  while (shuffled.every((piece, index) => piece === index)) {
    shuffled = [...pieces].sort(() => Math.random() - 0.5);
  }
  return shuffled;
};

export default function PhotoPuzzleGame({ onBack, onFinished, playSound }) {
  const [status, setStatus] = useState('intro');
  const [photo, setPhoto] = useState(photos[0]);
  const [size, setSize] = useState(3);
  const [pieces, setPieces] = useState([]);
  const [selected, setSelected] = useState(null);
  const [dragged, setDragged] = useState(null);
  const [seconds, setSeconds] = useState(0);

  const start = () => {
    setPieces(makePuzzle(size));
    setSelected(null);
    setSeconds(0);
    setStatus('playing');
  };

  useEffect(() => {
    if (status !== 'playing') return undefined;
    const timer = window.setInterval(() => setSeconds((value) => value + 1), 1000);
    return () => window.clearInterval(timer);
  }, [status]);

  const swap = (first, second) => {
    if (first === second) return;
    const next = [...pieces];
    [next[first], next[second]] = [next[second], next[first]];
    setPieces(next);
    setSelected(null);
    playSound('flip');
    if (next.every((piece, index) => piece === index)) {
      setStatus('result');
      onFinished('puzzle', Math.max(0, 1000 - seconds));
      playSound('good');
    }
  };

  const selectPiece = (index) => {
    if (selected === null) {
      setSelected(index);
    } else {
      swap(selected, index);
    }
  };

  const handleDrop = (index) => {
    if (dragged !== null) swap(dragged, index);
    setDragged(null);
  };

  return (
    <div className="arcade-game-card">
      {status === 'intro' && (
        <div className="arcade-intro">
          <div className="arcade-game-icon">🧩</div>
          <h3>Jungkook Photo Puzzle</h3>
          <p>Pick one of the photos and put its mixed-up pieces back in order. Drag a piece onto another, or tap two pieces to swap them.</p>
          <div className="arcade-puzzle-choices">
            {photos.slice(0, 6).map((item) => (
              <button
                type="button"
                key={item.id}
                onClick={() => setPhoto(item)}
                className={`arcade-puzzle-choice ${photo.id === item.id ? 'selected' : ''}`}
                aria-label={`Choose ${item.title}`}
              >
                <img src={item.url} alt="" />
                {photo.id === item.id && <Check size={16} />}
              </button>
            ))}
          </div>
          <div className="arcade-puzzle-start-controls">
            <label>
              <span>Difficulty</span>
              <select value={size} onChange={(event) => setSize(Number(event.target.value))}>
                <option value={3}>3 × 3 · Cozy</option>
                <option value={4}>4 × 4 · Challenge</option>
              </select>
            </label>
            <button className="arcade-primary" onClick={start}>Start puzzle ♡</button>
          </div>
        </div>
      )}
      {status === 'playing' && (
        <>
          <div className="arcade-game-topline">
            <button className="arcade-text-button" onClick={onBack}>← All games</button>
            <span>Time: <strong>{Math.floor(seconds / 60)}:{String(seconds % 60).padStart(2, '0')}</strong></span>
            <button className="arcade-text-button" onClick={start}><RotateCcw size={14} /> Restart</button>
          </div>
          <p className="arcade-puzzle-hint">Drag pieces to swap them, or tap two pieces ♡</p>
          <div className="arcade-puzzle-preview">
            <span>Picture to recreate</span>
            <img src={photo.url} alt={`Puzzle preview: ${photo.title}`} />
          </div>
          <div
            className="arcade-puzzle-grid"
            style={{ '--puzzle-size': size }}
          >
            {pieces.map((piece, position) => {
              const row = Math.floor(piece / size);
              const column = piece % size;
              return (
                <motion.button
                  type="button"
                  key={position}
                  layout
                  draggable
                  onDragStart={() => setDragged(position)}
                  onDragOver={(event) => event.preventDefault()}
                  onDrop={() => handleDrop(position)}
                  onClick={() => selectPiece(position)}
                  className={`arcade-puzzle-piece ${selected === position ? 'selected' : ''}`}
                  aria-label={`Puzzle piece ${position + 1}`}
                  style={{
                    backgroundImage: `url("${photo.url}")`,
                    backgroundSize: `${size * 100}% ${size * 100}%`,
                    backgroundPosition: `${size === 1 ? 0 : (column / (size - 1)) * 100}% ${size === 1 ? 0 : (row / (size - 1)) * 100}%`,
                  }}
                />
              );
            })}
          </div>
        </>
      )}
      <AnimatePresence>
        {status === 'result' && (
          <motion.div className="arcade-win-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="arcade-intro">
              <div className="arcade-game-icon">🎊</div>
              <h3>You pieced it together!</h3>
              <p>Lovely work — your puzzle is complete in {Math.floor(seconds / 60)}:{String(seconds % 60).padStart(2, '0')}.</p>
              <img src={photo.url} alt={photo.title} className="arcade-puzzle-complete" />
              <div className="arcade-result-actions">
                <button className="arcade-primary" onClick={() => setStatus('intro')}><RotateCcw size={15} /> New puzzle</button>
                <button className="arcade-secondary" onClick={onBack}>Back to arcade</button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
