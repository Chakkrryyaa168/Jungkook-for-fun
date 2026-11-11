import React, { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import { ArrowLeft, Gamepad2, Heart, Medal, Volume2, VolumeX } from 'lucide-react';
import GuessEraGame from './arcade/GuessEraGame';
import MemoryMatchGame from './arcade/MemoryMatchGame';
import CatchHeartsGame from './arcade/CatchHeartsGame';
import JungkookQuizGame from './arcade/JungkookQuizGame';
import PhotoPuzzleGame from './arcade/PhotoPuzzleGame';

const STORAGE_KEY = 'jungkook_arcade_progress';
const GAMES = [
  { id: 'era', title: 'Guess the Jungkook Era', description: 'Can you place these unforgettable moments?', icon: '📸', color: 'from-[#f6e8ff] to-[#fbe6f0]' },
  { id: 'memory', title: 'Jungkook Memory Match', description: 'Find all eight matching photo pairs.', icon: '🃏', color: 'from-[#eee9ff] to-[#e9f2ff]' },
  { id: 'catch', title: 'Catch the Purple Hearts', description: 'Catch the hearts and dodge the stars!', icon: '💜', color: 'from-[#fae8f4] to-[#f4eaff]' },
  { id: 'quiz', title: 'How Well Do You Know Jungkook?', description: 'Ten little questions for a true ARMY.', icon: '🐰', color: 'from-[#fff2dc] to-[#f9e6ef]' },
  { id: 'puzzle', title: 'Jungkook Photo Puzzle', description: 'Put a favorite photo back together.', icon: '🧩', color: 'from-[#e8f3ed] to-[#f0eaff]' },
];

const EMPTY_PROGRESS = { gamesPlayed: 0, completedGames: [], bestScores: {}, muted: false };

function readProgress() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (!saved || typeof saved !== 'object') return EMPTY_PROGRESS;
    return {
      gamesPlayed: Number.isFinite(saved.gamesPlayed) ? saved.gamesPlayed : 0,
      completedGames: Array.isArray(saved.completedGames) ? saved.completedGames : [],
      bestScores: saved.bestScores && typeof saved.bestScores === 'object' ? saved.bestScores : {},
      muted: Boolean(saved.muted),
    };
  } catch (error) {
    console.error('Unable to load arcade progress.', error);
    return EMPTY_PROGRESS;
  }
}

export default function Arcade({ onBack }) {
  const [progress, setProgress] = useState(readProgress);
  const [activeGame, setActiveGame] = useState(null);
  const [surpriseShown, setSurpriseShown] = useState(false);
  const unlocked = GAMES.every((game) => progress.completedGames.includes(game.id));
  const wasUnlocked = useRef(unlocked);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    } catch (error) {
      console.error('Unable to save arcade progress.', error);
    }
  }, [progress]);

  useEffect(() => {
    if (unlocked && !wasUnlocked.current) {
      setSurpriseShown(true);
      confetti({
        particleCount: 130,
        spread: 75,
        origin: { y: 0.65 },
        colors: ['#B9A0D9', '#F4DCEB', '#fff8f0'],
      });
    }
    wasUnlocked.current = unlocked;
  }, [unlocked]);

  const playSound = useCallback((type = 'flip') => {
    if (progress.muted) return;
    try {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (!AudioContextClass) return;
      const context = new AudioContextClass();
      const oscillator = context.createOscillator();
      const gain = context.createGain();
      oscillator.type = 'sine';
      oscillator.frequency.value = type === 'good' ? 660 : type === 'miss' ? 220 : 440;
      gain.gain.setValueAtTime(0.055, context.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, context.currentTime + 0.16);
      oscillator.connect(gain);
      gain.connect(context.destination);
      oscillator.start();
      oscillator.stop(context.currentTime + 0.17);
      oscillator.onended = () => context.close();
    } catch (error) {
      console.error('Unable to play arcade sound.', error);
    }
  }, [progress.muted]);

  const finishGame = useCallback((gameId, score) => {
    setProgress((current) => {
      const completedGames = current.completedGames.includes(gameId)
        ? current.completedGames
        : [...current.completedGames, gameId];
      const next = {
        ...current,
        gamesPlayed: current.gamesPlayed + 1,
        completedGames,
        bestScores: {
          ...current.bestScores,
          [gameId]: Math.max(current.bestScores[gameId] ?? 0, score),
        },
      };
      return next;
    });
  }, []);

  const toggleMute = () => setProgress((current) => ({ ...current, muted: !current.muted }));

  const gameComponents = {
    era: GuessEraGame,
    memory: MemoryMatchGame,
    catch: CatchHeartsGame,
    quiz: JungkookQuizGame,
    puzzle: PhotoPuzzleGame,
  };
  const ActiveGame = activeGame ? gameComponents[activeGame] : null;

  return (
    <section className="arcade-page">
      <div className="arcade-orb arcade-orb-one" />
      <div className="arcade-orb arcade-orb-two" />
      <div className="arcade-content">
        <div className="arcade-page-top">
          <button type="button" className="arcade-back-home" onClick={onBack}>
            <ArrowLeft size={16} /> Back to his world
          </button>
          <button
            type="button"
            className="arcade-sound-toggle"
            onClick={toggleMute}
            aria-label={progress.muted ? 'Turn game sounds on' : 'Mute game sounds'}
          >
            {progress.muted ? <VolumeX size={17} /> : <Volume2 size={17} />}
            <span>{progress.muted ? 'Sound off' : 'Sound on'}</span>
          </button>
        </div>

        <motion.header className="arcade-heading" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }}>
          <div className="arcade-eyebrow"><Gamepad2 size={14} /> A tiny world of play</div>
          <h1>JK Arcade <span>♡</span></h1>
          <p>Little games, lots of purple hearts, and a whole lot of Jungkook.</p>
        </motion.header>

        <div className="arcade-stats">
          <div><span className="arcade-stat-icon">🎮</span><span><strong>{progress.gamesPlayed}</strong><small>games played</small></span></div>
          <div><span className="arcade-stat-icon">🌟</span><span><strong>{progress.completedGames.length} / 5</strong><small>games completed</small></span></div>
          <div><span className="arcade-stat-icon"><Medal size={19} /></span><span><strong>{Object.keys(progress.bestScores).length}</strong><small>personal bests</small></span></div>
        </div>

        <AnimatePresence mode="wait">
          {ActiveGame ? (
            <motion.div key={activeGame} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
              <ActiveGame
                onBack={() => setActiveGame(null)}
                onFinished={finishGame}
                playSound={playSound}
              />
            </motion.div>
          ) : (
            <motion.div key="lobby" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
              <div className="arcade-lobby-title">
                <h2>Choose your little adventure</h2>
                <span>Complete all five to unlock a surprise ♡</span>
              </div>
              <div className="arcade-game-grid">
                {GAMES.map((game, index) => (
                  <motion.button
                    type="button"
                    key={game.id}
                    className={`arcade-game-tile bg-gradient-to-br ${game.color}`}
                    onClick={() => setActiveGame(game.id)}
                    whileHover={{ y: -5, scale: 1.015 }}
                    whileTap={{ scale: 0.98 }}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.07 }}
                  >
                    <span className="arcade-tile-icon">{game.icon}</span>
                    <span className="arcade-tile-copy">
                      <strong>{game.title}</strong>
                      <small>{game.description}</small>
                      <span className="arcade-tile-best">
                        {progress.completedGames.includes(game.id)
                          ? `Best score · ${progress.bestScores[game.id] ?? 0}  ✓`
                          : 'Tap to play ♡'}
                      </span>
                    </span>
                    <span className="arcade-tile-arrow">↗</span>
                  </motion.button>
                ))}
              </div>

              {unlocked && (
                <motion.section
                  className="arcade-surprise"
                  initial={{ opacity: 0, scale: 0.9, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                >
                  <div className="arcade-surprise-sparkles">✦　♡　✧</div>
                  <span className="arcade-surprise-label"><Heart size={14} fill="currentColor" /> You Unlocked a Little Happiness ♡</span>
                  <h2>{surpriseShown ? 'A little celebration, just for you!' : 'You made it through every game!'}</h2>
                  <p>
                    I made this little arcade just for you, to bring a smile to your day.
                    Thank you for filling this world with your lovely heart. You deserve all
                    the happiness in the world — today, tomorrow, and always. ♡
                  </p>
                  <span className="arcade-signature">Made with love, just for you ♡</span>
                </motion.section>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        <footer className="arcade-footer">A little happiness, one game at a time <span>♡</span></footer>
      </div>
    </section>
  );
}
