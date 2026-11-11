import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { photos } from '../../data/photos';
import { RotateCcw } from 'lucide-react';

const makeDeck = () => [...photos.slice(0, 8), ...photos.slice(0, 8)]
  .map((photo, index) => ({ ...photo, cardId: `${photo.id}-${index}-${Math.random()}` }))
  .sort(() => Math.random() - 0.5);

export default function MemoryMatchGame({ onBack, onFinished, playSound }) {
  const [status, setStatus] = useState('intro');
  const [deck, setDeck] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [matched, setMatched] = useState([]);
  const [moves, setMoves] = useState(0);
  const [seconds, setSeconds] = useState(0);

  const start = () => {
    setDeck(makeDeck());
    setFlipped([]);
    setMatched([]);
    setMoves(0);
    setSeconds(0);
    setStatus('playing');
  };

  useEffect(() => {
    if (status !== 'playing') return undefined;
    const timer = window.setInterval(() => setSeconds((value) => value + 1), 1000);
    return () => window.clearInterval(timer);
  }, [status]);

  const flip = (card) => {
    if (status !== 'playing' || flipped.length === 2 || flipped.includes(card.cardId) || matched.includes(card.id)) return;
    const nextFlipped = [...flipped, card.cardId];
    setFlipped(nextFlipped);
    playSound('flip');

    if (nextFlipped.length === 2) {
      setMoves((value) => value + 1);
      const firstCard = deck.find((item) => item.cardId === nextFlipped[0]);
      if (firstCard.id === card.id) {
        const nextMatched = [...matched, card.id];
        setMatched(nextMatched);
        setFlipped([]);
        playSound('good');
        if (nextMatched.length === 8) {
          const result = Math.max(0, 1000 - (moves + 1) * 20 - seconds);
          setStatus('result');
          onFinished('memory', result);
        }
      } else {
        window.setTimeout(() => setFlipped([]), 850);
      }
    }
  };

  return (
    <div className="arcade-game-card">
      {status === 'intro' && (
        <div className="arcade-intro">
          <div className="arcade-game-icon">🃏</div>
          <h3>Jungkook Memory Match</h3>
          <p>Flip two cards at a time and find all eight photo pairs. Fewer moves and a faster time earn a higher score.</p>
          <button className="arcade-primary" onClick={start}>Start matching ♡</button>
        </div>
      )}
      {status === 'playing' && (
        <>
          <div className="arcade-game-topline">
            <button className="arcade-text-button" onClick={onBack}>← All games</button>
            <span>Moves: <strong>{moves}</strong></span>
            <span>Time: <strong>{Math.floor(seconds / 60)}:{String(seconds % 60).padStart(2, '0')}</strong></span>
            <button className="arcade-text-button" onClick={start}><RotateCcw size={14} /> Restart</button>
            <span>Time: <strong>{Math.floor(seconds / 60)}:{String(seconds % 60).padStart(2, '0')}</strong></span>
          </div>
          <div className="arcade-memory-grid">
            {deck.map((card) => {
              const isFaceUp = flipped.includes(card.cardId) || matched.includes(card.id);
              return (
                <motion.button
                  key={card.cardId}
                  whileTap={{ scale: 0.93 }}
                  onClick={() => flip(card)}
                  aria-label={isFaceUp ? card.title : 'Flip a card'}
                  className={`arcade-memory-card ${isFaceUp ? 'is-flipped' : ''} ${matched.includes(card.id) ? 'is-matched' : ''}`}
                >
                  {isFaceUp
                    ? <img src={card.url} alt={card.title} />
                    : <span>♡</span>}
                </motion.button>
              );
            })}
          </div>
        </>
      )}
      <AnimatePresence>
        {status === 'result' && (
          <motion.div className="arcade-win-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="arcade-intro">
              <div className="arcade-game-icon">🎉</div>
              <h3>All the pairs found!</h3>
              <p>You matched all eight pairs in {moves} moves and {Math.floor(seconds / 60)}:{String(seconds % 60).padStart(2, '0')}.</p>
              <div className="arcade-result-actions">
                <button className="arcade-primary" onClick={start}><RotateCcw size={15} /> Play again</button>
                <button className="arcade-secondary" onClick={onBack}>Back to arcade</button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
