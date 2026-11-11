import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { RotateCcw } from 'lucide-react';

const GAME_LENGTH = 30;

export default function CatchHeartsGame({ onBack, onFinished, playSound }) {
  const [status, setStatus] = useState('intro');
  const [seconds, setSeconds] = useState(GAME_LENGTH);
  const [score, setScore] = useState(0);
  const [basketX, setBasketX] = useState(50);
  const [falling, setFalling] = useState([]);
  const positionRef = useRef(50);
  const scoreRef = useRef(0);
  const itemIdRef = useRef(0);

  const start = () => {
    positionRef.current = 50;
    scoreRef.current = 0;
    itemIdRef.current = 0;
    setBasketX(50);
    setScore(0);
    setSeconds(GAME_LENGTH);
    setFalling([]);
    setStatus('playing');
  };

  const finish = () => {
    setStatus('result');
    onFinished('catch', scoreRef.current);
  };

  useEffect(() => {
    if (status !== 'playing') return undefined;
    const timer = window.setInterval(() => {
      setSeconds((remaining) => {
        if (remaining <= 1) {
          window.clearInterval(timer);
          window.setTimeout(finish, 0);
          return 0;
        }
        return remaining - 1;
      });
    }, 1000);
    return () => window.clearInterval(timer);
  }, [status]);

  useEffect(() => {
    if (status !== 'playing') return undefined;
    let tick = 0;
    const gameLoop = window.setInterval(() => {
      tick += 1;
      setFalling((items) => {
        const current = tick % 9 === 0
          ? [...items, {
            id: itemIdRef.current++,
            x: 7 + Math.random() * 86,
            y: -8,
            obstacle: Math.random() < 0.2,
            symbol: Math.random() > 0.5 ? '💜' : '🩷',
          }]
          : items;
        const remaining = [];

        current.forEach((item) => {
          const next = { ...item, y: item.y + 1.15 };
          const nearBasket = next.y > 82 && next.y < 95 && Math.abs(next.x - positionRef.current) < 11;
          if (nearBasket) {
            if (next.obstacle) {
              scoreRef.current = Math.max(0, scoreRef.current - 5);
            } else {
              scoreRef.current += 10;
              playSound('good');
            }
            setScore(scoreRef.current);
          } else if (next.y < 105) {
            remaining.push(next);
          }
        });
        return remaining;
      });
    }, 60);
    return () => window.clearInterval(gameLoop);
  }, [status, playSound]);

  useEffect(() => {
    if (status !== 'playing') return undefined;
    const handleKey = (event) => {
      if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
      event.preventDefault();
      move(event.key === 'ArrowLeft' ? -7 : 7);
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [status]);

  const move = (delta) => {
    const next = Math.max(7, Math.min(93, positionRef.current + delta));
    positionRef.current = next;
    setBasketX(next);
  };

  return (
    <div className="arcade-game-card">
      {status === 'intro' && (
        <div className="arcade-intro">
          <div className="arcade-game-icon">💜</div>
          <h3>Catch the Purple Hearts</h3>
          <p>Catch the falling hearts and dodge the little dark stars. Use arrow keys or the on-screen buttons. You have 30 seconds!</p>
          <button className="arcade-primary" onClick={start}>Start catching ♡</button>
        </div>
      )}
      {status === 'playing' && (
        <>
          <div className="arcade-game-topline">
            <button className="arcade-text-button" onClick={onBack}>← All games</button>
            <span>Time: <strong>{seconds}s</strong></span>
            <strong>Score {score}</strong>
            <button className="arcade-text-button" onClick={start}><RotateCcw size={14} /> Restart</button>
            <strong>Score {score}</strong>
          </div>
          <div className="arcade-catch-board">
            <div className="arcade-catch-sky">Catch hearts 💜 &nbsp; Dodge stars ✦</div>
            {falling.map((item) => (
              <span
                key={item.id}
                className={`arcade-falling-item ${item.obstacle ? 'obstacle' : ''}`}
                style={{ left: `${item.x}%`, top: `${item.y}%` }}
                aria-hidden="true"
              >
                {item.obstacle ? '✦' : item.symbol}
              </span>
            ))}
            <motion.div className="arcade-basket" animate={{ left: `${basketX}%` }} transition={{ duration: 0.08 }}>
              🧺
            </motion.div>
          </div>
          <div className="arcade-touch-controls">
            <button className="arcade-secondary" onClick={() => move(-10)} aria-label="Move basket left">← Move left</button>
            <button className="arcade-secondary" onClick={() => move(10)} aria-label="Move basket right">Move right →</button>
          </div>
        </>
      )}
      <AnimatePresence>
        {status === 'result' && (
          <motion.div className="arcade-win-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="arcade-intro">
              <div className="arcade-game-icon">{score >= 50 ? '🏆' : '💗'}</div>
              <h3>{score >= 50 ? 'Heart-catching superstar!' : 'You caught some lovely hearts!'}</h3>
              <p>Your final score is <strong>{score}</strong> 💜</p>
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
