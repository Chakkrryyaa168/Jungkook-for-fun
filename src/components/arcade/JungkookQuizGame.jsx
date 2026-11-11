import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { RotateCcw } from 'lucide-react';
import { jungkookQuizQuestions } from '../../data/arcadeQuestions';

const messages = [
  [0, 3, 'A sweet beginning! There’s lots more JK magic to discover ♡'],
  [4, 6, 'You know your Jungkook moments! Keep shining, ARMY ✨'],
  [7, 9, 'Wow, you know him so well! Golden Maknae expert 💜'],
  [10, 10, 'Perfect score! You’re Jungkook’s biggest trivia star 🌟'],
];

export default function JungkookQuizGame({ onBack, onFinished, playSound }) {
  const [status, setStatus] = useState('intro');
  const [questionIndex, setQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [answer, setAnswer] = useState('');

  const start = () => {
    setQuestionIndex(0);
    setScore(0);
    setAnswer('');
    setStatus('playing');
  };

  const question = jungkookQuizQuestions[questionIndex];

  const choose = (option) => {
    if (answer) return;
    setAnswer(option);
    if (option === question.answer) {
      setScore((value) => value + 1);
      playSound('good');
    } else {
      playSound('miss');
    }
  };

  const next = () => {
    if (questionIndex < jungkookQuizQuestions.length - 1) {
      setQuestionIndex((value) => value + 1);
      setAnswer('');
      return;
    }
    const total = score;
    setStatus('result');
    onFinished('quiz', total);
  };

  const resultMessage = messages.find(([min, max]) => score >= min && score <= max)?.[2];

  return (
    <div className="arcade-game-card">
      {status === 'intro' && (
        <div className="arcade-intro">
          <div className="arcade-game-icon">🐰</div>
          <h3>How Well Do You Know Jungkook?</h3>
          <p>Ten multiple-choice questions about his journey, hobbies, and memorable moments.</p>
          <button className="arcade-primary" onClick={start}>Start quiz ♡</button>
        </div>
      )}
      {status === 'playing' && (
        <AnimatePresence mode="wait">
          <motion.div key={questionIndex} initial={{ opacity: 0, x: 14 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -14 }}>
            <div className="arcade-game-topline">
              <button className="arcade-text-button" onClick={onBack}>← All games</button>
              <span>Question {questionIndex + 1} / 10</span>
              <button className="arcade-text-button" onClick={start}><RotateCcw size={14} /> Restart</button>
            </div>
            <div className="arcade-progress"><span style={{ width: `${((questionIndex + 1) / 10) * 100}%` }} /></div>
            <div className="arcade-quiz-content">
              <h3>{question.question}</h3>
              <div className="arcade-options">
                {question.options.map((option) => (
                  <button
                    key={option}
                    disabled={Boolean(answer)}
                    onClick={() => choose(option)}
                    className={`arcade-option ${answer && option === question.answer ? 'correct' : ''} ${answer === option && option !== question.answer ? 'incorrect' : ''}`}
                  >
                    {option}
                  </button>
                ))}
              </div>
              {answer && (
                <motion.div className="arcade-fact" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <strong>{answer === question.answer ? 'That’s right! ♡' : `The answer is ${question.answer}`}</strong>
                  <p>{question.fact}</p>
                  <button className="arcade-primary arcade-next" onClick={next}>
                    {questionIndex === 9 ? 'See my result' : 'Next question'} ♡
                  </button>
                </motion.div>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      )}
      {status === 'result' && (
        <div className="arcade-intro">
          <div className="arcade-game-icon">✨</div>
          <h3>{score} / 10 — {score >= 7 ? 'Golden Maknae expert!' : 'Thanks for playing!'}</h3>
          <p>{resultMessage}</p>
          <div className="arcade-result-actions">
            <button className="arcade-primary" onClick={start}><RotateCcw size={15} /> Try again</button>
            <button className="arcade-secondary" onClick={onBack}>Back to arcade</button>
          </div>
        </div>
      )}
    </div>
  );
}
