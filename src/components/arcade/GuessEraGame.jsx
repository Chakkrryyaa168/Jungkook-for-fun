import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Check, RotateCcw, Sparkles } from 'lucide-react';
import { photos } from '../../data/photos';
import { eraRounds } from '../../data/arcadeQuestions';

const shuffle = (items) => [...items].sort(() => Math.random() - 0.5);

export default function GuessEraGame({ onBack, onFinished, playSound }) {
  const [rounds, setRounds] = useState([]);
  const [roundIndex, setRoundIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [answer, setAnswer] = useState('');
  const [status, setStatus] = useState('intro');

  const start = () => {
    setRounds(shuffle(eraRounds).slice(0, 5));
    setRoundIndex(0);
    setScore(0);
    setAnswer('');
    setStatus('playing');
  };

  const round = rounds[roundIndex];
  const photo = round && photos.find((item) => item.id === round.photoId);

  const choose = (option) => {
    if (answer) return;
    setAnswer(option);
    if (option === round.era) {
      setScore((value) => value + 1);
      playSound('good');
    } else {
      playSound('miss');
    }
  };

  const next = () => {
    if (roundIndex + 1 < rounds.length) {
      setRoundIndex((value) => value + 1);
      setAnswer('');
      return;
    }
    const finalScore = score;
    setStatus('result');
    onFinished('era', finalScore);
  };

  return (
    <div className="arcade-game-card">
      {status === 'intro' && (
        <div className="arcade-intro">
          <div className="arcade-game-icon">📸</div>
          <h3>Guess the Jungkook Era</h3>
          <p>Look at five photos and pick the era they belong to. You’ll get a little fact after each answer.</p>
          <button className="arcade-primary" onClick={start}>Start game ♡</button>
        </div>
      )}

      {status === 'playing' && round && photo && (
        <AnimatePresence mode="wait">
          <motion.div key={roundIndex} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
            <div className="arcade-game-topline">
              <button className="arcade-text-button" onClick={onBack}>← All games</button>
              <span>Question {roundIndex + 1} / {rounds.length}</span>
              <strong>Score {score}</strong>
              <button className="arcade-text-button" onClick={start}><RotateCcw size={14} /> Restart</button>
            </div>
            <div className="arcade-era-layout">
              <img src={photo.url} alt="Jungkook" className="arcade-era-photo" />
              <div>
                <h3>Which era is this?</h3>
                <p className="arcade-muted">Choose the best answer, ARMY ♡</p>
                <div className="arcade-options">
                  {round.options.map((option) => (
                    <button
                      key={option}
                      disabled={Boolean(answer)}
                      onClick={() => choose(option)}
                      className={`arcade-option ${answer === option ? (option === round.era ? 'correct' : 'incorrect') : ''} ${answer && option === round.era ? 'correct' : ''}`}
                    >
                      {option}
                      {answer && option === round.era && <Check size={16} />}
                    </button>
                  ))}
                </div>
                {answer && (
                  <motion.div className="arcade-fact" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}>
                    <strong>{answer === round.era ? 'You got it! ✨' : `It was ${round.era} (${round.year})`}</strong>
                    <p>{round.fact}</p>
                    <button className="arcade-primary arcade-next" onClick={next}>
                      {roundIndex + 1 === rounds.length ? 'See my score' : 'Next photo'} ♡
                    </button>
                  </motion.div>
                )}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      )}

      {status === 'result' && (
        <div className="arcade-intro">
          <div className="arcade-game-icon">💜</div>
          <h3>{score === rounds.length ? 'True ARMY memory!' : 'What a lovely trip through the eras!'}</h3>
          <p>You guessed <strong>{score} out of {rounds.length}</strong> eras correctly.</p>
          <div className="arcade-result-actions">
            <button className="arcade-primary" onClick={start}><RotateCcw size={15} /> Play again</button>
            <button className="arcade-secondary" onClick={onBack}><Sparkles size={15} /> Back to arcade</button>
          </div>
        </div>
      )}
    </div>
  );
}
