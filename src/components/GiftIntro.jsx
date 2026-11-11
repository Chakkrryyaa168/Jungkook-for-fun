import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import confetti from 'canvas-confetti';

export default function GiftIntro({ onFinish }) {
  const [isOpening, setIsOpening] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  const dismiss = () => setIsVisible(false);

  useEffect(() => {
    if (!isOpening) return undefined;
    const timer = window.setTimeout(dismiss, 1250);
    return () => window.clearTimeout(timer);
  }, [isOpening]);

  const openGift = () => {
    if (isOpening) return;
    setIsOpening(true);
    confetti({
      particleCount: 85,
      spread: 78,
      origin: { y: .56 },
      colors: ['#FFDDE8', '#F8C9DA', '#E8B4C8', '#FFF8F2'],
      shapes: ['circle', 'square'],
      scalar: .9,
    });
  };

  return (
    <AnimatePresence onExitComplete={onFinish}>
      {isVisible && <motion.div
        className="gift-intro"
        initial={{ opacity: 1 }}
        exit={{ opacity: 0, scale: 1.04 }}
        transition={{ duration: .55 }}
      >
        <motion.span className="gift-floating gift-floating-left" animate={{ y: [0, -13, 0], rotate: [-10, 4, -10] }}>♡</motion.span>
        <motion.span className="gift-floating gift-floating-right" animate={{ y: [0, 12, 0], rotate: [8, -5, 8] }}>✦</motion.span>

        <motion.button
          type="button"
          className={`gift-box-button ${isOpening ? 'opening' : ''}`}
          onClick={openGift}
          whileHover={!isOpening ? { scale: 1.04, y: -3 } : undefined}
          whileTap={!isOpening ? { scale: .96 } : undefined}
          aria-label="Open your little gift"
        >
          <motion.span
            className="gift-box-lid"
            animate={isOpening ? { y: -86, rotate: -13, opacity: 0 } : { y: 0, rotate: 0, opacity: 1 }}
            transition={{ duration: .65, ease: 'easeOut' }}
          >
            <span className="gift-ribbon gift-ribbon-top" />
            <span className="gift-bow">୨୧</span>
          </motion.span>
          <span className="gift-box-body"><span className="gift-ribbon gift-ribbon-front" /></span>
          <motion.span className="gift-heart-burst" animate={isOpening ? { y: -100, opacity: [0, 1, 0], scale: [0.7, 1.3, .7] } : { y: 0, opacity: 0 }} transition={{ duration: .8 }}>♡</motion.span>
        </motion.button>

        <motion.h1 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .15 }}>
          A little gift for you ♡
        </motion.h1>
        <p>Something sweet is waiting inside.</p>
        {!isOpening && <span className="gift-hint">tap the little box to open</span>}
        <button type="button" className="gift-skip" onClick={dismiss}>Skip intro <span>→</span></button>
      </motion.div>}
    </AnimatePresence>
  );
}
