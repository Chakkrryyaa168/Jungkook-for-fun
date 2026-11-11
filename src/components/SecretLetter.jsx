import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { 
  Heart, 
  Mail, 
  Edit3,
  Check,
  RotateCcw,
  X,
  Plus, 
  Trash2, 
  Camera
} from 'lucide-react';

const LETTER = {
  greeting: 'For My Favorite Girl ♡',
  message: 'I know how much you love him, so I made this little corner of the internet just for you. I hope every time you visit, it brings a little happiness to your day. You deserve all the happiness in the world. ♡',
  signOff: 'Forever yours ♡',
  date: 'Always & Forever'
};

export default function SecretLetter() {
  const [isOpen, setIsOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [letterContent, setLetterContent] = useState(LETTER);
  const [coupleMemories, setCoupleMemories] = useState([]);
  const [showAddMemoryModal, setShowAddMemoryModal] = useState(false);
  const [newMemory, setNewMemory] = useState({ title: '', caption: '', image: '', sticker: '💜' });
  const [memoryError, setMemoryError] = useState('');
  const [letterError, setLetterError] = useState('');

  // Load saved message and personal memories, removing only the old sample cards.
  useEffect(() => {
    try {
      const savedLetter = localStorage.getItem('jungkook_secret_letter');
      if (savedLetter) setLetterContent({ ...LETTER, ...JSON.parse(savedLetter) });
      const savedMemories = localStorage.getItem('jungkook_couple_memories');
      if (savedMemories) {
        const memories = JSON.parse(savedMemories);
        const personalMemories = Array.isArray(memories)
          ? memories.filter((memory) => !['memory-1', 'memory-2', 'memory-3'].includes(memory.id))
          : [];
        setCoupleMemories(personalMemories);
        if (Array.isArray(memories) && personalMemories.length !== memories.length) {
          localStorage.setItem('jungkook_couple_memories', JSON.stringify(personalMemories));
        }
      }
    } catch (e) {
      console.error('Failed to load saved surprise content from localStorage', e);
    }
  }, []);

  const saveLetter = (event) => {
    event.preventDefault();
    try {
      localStorage.setItem('jungkook_secret_letter', JSON.stringify(letterContent));
      setIsEditing(false);
      setLetterError('');
    } catch (error) {
      console.error('Unable to save personalized letter.', error);
      setLetterError('Your letter could not be saved on this device. Please try again.');
    }
  };

  const resetLetter = () => {
    setLetterContent(LETTER);
    setIsEditing(false);
    setLetterError('');
    try {
      localStorage.removeItem('jungkook_secret_letter');
    } catch (error) {
      console.error('Unable to reset personalized letter.', error);
    }
  };

  // Add new couple memory
  const handleAddMemory = (e) => {
    e.preventDefault();
    if (!newMemory.title || !newMemory.image) {
      setMemoryError('Please add a title and choose a photo for this memory.');
      return;
    }

    const memoryToAdd = {
      id: 'memory-' + Date.now(),
      title: newMemory.title,
      caption: newMemory.caption || 'A precious moment together ♡',
      date: 'Special Memory',
      image: newMemory.image,
      sticker: newMemory.sticker || '💜'
    };

    const updated = [memoryToAdd, ...coupleMemories];
    try {
      localStorage.setItem('jungkook_couple_memories', JSON.stringify(updated));
    } catch (error) {
      console.error('Unable to save couple memory.', error);
      setMemoryError('This photo could not be saved on your device. Try a smaller image.');
      return;
    }

    setCoupleMemories(updated);
    setMemoryError('');
    setNewMemory({ title: '', caption: '', image: '', sticker: '💜' });
    setShowAddMemoryModal(false);
    triggerConfetti();
  };

  const handleDeleteMemory = (id) => {
    const updated = coupleMemories.filter((m) => m.id !== id);
    try {
      localStorage.setItem('jungkook_couple_memories', JSON.stringify(updated));
    } catch (error) {
      console.error('Unable to delete couple memory.', error);
      setMemoryError('This memory could not be removed from this device. Please try again.');
      return;
    }
    setCoupleMemories(updated);
    setMemoryError('');
  };

  // Image file picker helper
  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewMemory((prev) => ({ ...prev, image: reader.result }));
      };
      reader.onerror = () => setMemoryError('This photo could not be opened. Please choose another image.');
      reader.readAsDataURL(file);
    }
  };

  // Confetti explosion trigger
  const triggerConfetti = () => {
    try {
      // Gentle romantic pastel burst
      confetti({
        particleCount: 60,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#FFDDE8', '#F8C9DA', '#E8B4C8', '#FFF0F5', '#FFFFFF'],
      });
      setTimeout(() => {
        confetti({
          particleCount: 40,
          angle: 60,
          spread: 60,
          origin: { x: 0.2, y: 0.7 },
          colors: ['#FFDDE8', '#F8C9DA', '#FFFFFF'],
        });
        confetti({
          particleCount: 40,
          angle: 120,
          spread: 60,
          origin: { x: 0.8, y: 0.7 },
          colors: ['#FFDDE8', '#F8C9DA', '#FFFFFF'],
        });
      }, 250);
    } catch (error) {
      console.error('Unable to play the surprise animation.', error);
    }
  };

  const handleOpenEnvelope = () => {
    setIsOpen(true);
    triggerConfetti();
  };

  return (
    <section id="surprise" className="surprise-page py-24 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto relative">
      {/* Decorative floating blur behind envelope */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-96 h-96 bg-soft-pink/40 dark:bg-lavender/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-16">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full glass-pill text-xs font-semibold uppercase tracking-wider text-lavender-dark dark:text-lavender mb-3">
          <Heart size={13} className="fill-lavender text-lavender" />
          <span>A Secret For You</span>
        </div>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-deep-purple dark:text-cream tracking-tight mb-3">
          A Little Surprise ♡
        </h2>
        <p className="text-sm sm:text-base text-deep-purple/75 dark:text-cream/80 font-normal leading-relaxed">
          Behind every line of code on this website is a heartfelt reason. 
          Tap below to open the wax-sealed letter.
        </p>
      </div>

      {/* ENVELOPE INTERACTION CONTAINER */}
      <div className="flex flex-col items-center justify-center mb-24">
        {!isOpen ? (
          /* Closed Wax-Sealed Envelope */
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="relative w-full max-w-md sm:max-w-lg cursor-pointer group"
            onClick={handleOpenEnvelope}
          >
            {/* Washi Tape */}
            <div className="washi-tape" />

            {/* Envelope Exterior */}
            <div className="surprise-envelope relative p-8 sm:p-12 rounded-3xl shadow-polaroid border-2 border-lavender/40 text-center flex flex-col items-center transition-all duration-500 group-hover:scale-102 group-hover:shadow-dreamy">
              {/* Envelope flap aesthetic triangle */}
              <div className="w-full border-b border-lavender/30 pb-4 mb-6 flex justify-between items-center text-xs font-mono text-lavender-dark dark:text-lavender-light">
                <span>SPECIAL AIRMAIL ✈</span>
                <span>TO: MY FAVORITE GIRL</span>
              </div>

              {/* Wax Seal Button */}
              <motion.div
                whileHover={{ scale: 1.15, rotate: 5 }}
                whileTap={{ scale: 0.95 }}
                className="surprise-seal w-20 h-20 rounded-full text-white flex items-center justify-center shadow-lg border-2 relative my-4"
              >
                <div className="text-center">
                  <span className="font-serif text-2xl font-bold tracking-wider block">JK</span>
                  <span className="text-[10px] block font-mono">♡</span>
                </div>
                <div className="absolute inset-0 rounded-full border border-dashed border-amber-200/50" />
              </motion.div>

              <p className="font-handwriting text-2xl sm:text-3xl text-deep-purple dark:text-cream font-bold mt-2">
                "Open a Little Surprise ♡"
              </p>
              <p className="text-xs text-lavender-dark dark:text-lavender-light/80 mt-1 font-sans">
                (Click the envelope or wax seal to unfold)
              </p>

              {/* Stamp on right corner */}
              <div className="absolute top-6 right-6 w-12 h-14 border-2 border-dashed border-lavender/50 bg-white/60 dark:bg-black/20 p-1 flex flex-col items-center justify-center rounded-sm rotate-6 shadow-sm">
                <span className="text-[10px] font-mono">BTS</span>
                <span className="text-xs">💜</span>
                <span className="text-[8px] font-mono">1997</span>
              </div>
            </div>
          </motion.div>
        ) : (
          /* Opened Unfolded Letter */
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
            className="w-full max-w-2xl relative"
          >
            {/* Washi Tape */}
            <div className="washi-tape washi-tape-purple" />

            {/* Letter actions */}
            <div className="flex items-center justify-between mb-4 px-2">
              <button
                onClick={() => setIsOpen(false)}
                className="text-xs font-sans text-lavender-dark dark:text-lavender hover:underline flex items-center gap-1"
              >
                <span>← Fold envelope back</span>
              </button>
              <button
                type="button"
                onClick={() => setIsEditing((editing) => !editing)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full glass-pill text-xs font-semibold text-deep-purple shadow-sm"
              >
                {isEditing ? <X size={13} /> : <Edit3 size={13} />}
                {isEditing ? 'Close editor' : 'Personalize this letter'}
              </button>
            </div>

            {/* Letter Parchment Frame */}
            <div className="letter-paper relative p-8 sm:p-12 rounded-3xl shadow-polaroid border border-lavender/40">
              {/* Subtle vintage lined paper effect */}
              <div className="absolute inset-0 bg-[radial-gradient(#E8B4C8_1px,transparent_1px)] [background-size:24px_24px] opacity-20 pointer-events-none rounded-3xl" />

              {isEditing ? (
                <form onSubmit={saveLetter} className="relative z-10 space-y-4">
                  <h3 className="font-serif text-xl font-bold text-deep-purple">Make this note yours ♡</h3>
                  {letterError && <p className="surprise-error" role="alert">{letterError}</p>}
                  <label className="block text-xs font-semibold text-deep-purple">
                    Greeting
                    <input
                      value={letterContent.greeting}
                      onChange={(event) => setLetterContent({ ...letterContent, greeting: event.target.value })}
                      className="mt-1 w-full rounded-xl border border-lavender/40 bg-white/80 px-3 py-2 font-handwriting text-xl"
                      required
                    />
                  </label>
                  <label className="block text-xs font-semibold text-deep-purple">
                    Your message
                    <textarea
                      rows={5}
                      value={letterContent.message}
                      onChange={(event) => setLetterContent({ ...letterContent, message: event.target.value })}
                      className="mt-1 w-full rounded-xl border border-lavender/40 bg-white/80 px-3 py-2 font-handwriting text-xl"
                      required
                    />
                  </label>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <label className="block text-xs font-semibold text-deep-purple">
                      Sign-off
                      <input
                        value={letterContent.signOff}
                        onChange={(event) => setLetterContent({ ...letterContent, signOff: event.target.value })}
                        className="mt-1 w-full rounded-xl border border-lavender/40 bg-white/80 px-3 py-2 font-handwriting text-xl"
                      />
                    </label>
                    <label className="block text-xs font-semibold text-deep-purple">
                      Small note
                      <input
                        value={letterContent.date}
                        onChange={(event) => setLetterContent({ ...letterContent, date: event.target.value })}
                        className="mt-1 w-full rounded-xl border border-lavender/40 bg-white/80 px-3 py-2 font-handwriting text-xl"
                      />
                    </label>
                  </div>
                  <div className="flex flex-wrap justify-between gap-2 pt-2">
                    <button type="button" onClick={resetLetter} className="arcade-text-button">
                      <RotateCcw size={13} /> Reset message
                    </button>
                    <button type="submit" className="button-primary"><Check size={14} /> Save my letter ♡</button>
                  </div>
                </form>
              ) : (
                <div className="relative z-10 space-y-6">
                  {/* Letter Header */}
                  <div className="border-b border-lavender/20 pb-4 flex items-center justify-between">
                    <h3 className="font-handwriting text-3xl sm:text-4xl text-lavender-dark dark:text-lavender font-bold">
                      {letterContent.greeting}
                    </h3>
                    <span className="font-handwriting text-lg text-deep-purple/60 dark:text-cream/60">
                      {letterContent.date}
                    </span>
                  </div>

                  {/* Main Emotional Message (The exact requested text by default) */}
                  <div className="py-2">
                    <p className="font-handwriting text-2xl sm:text-3xl text-deep-purple dark:text-cream leading-relaxed tracking-wide whitespace-pre-line">
                      "{letterContent.message}"
                    </p>
                  </div>

                  {/* Cute Romantic Footnote & Sign-off */}
                  <div className="pt-6 border-t border-lavender/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-2 text-xs font-sans text-lavender-dark dark:text-lavender-light">
                      <span className="text-sm">🐰</span>
                      <span>Always remembering: Apobangpo (ARMY Forever BTS Forever)</span>
                    </div>

                    <div className="text-right">
                      <p className="font-handwriting text-2xl sm:text-3xl font-bold text-deep-purple dark:text-cream">
                        {letterContent.signOff}
                      </p>
                    </div>
                  </div>
              </div>
                )}
            </div>
          </motion.div>
        )}
      </div>

      {/* ================= OUR OWN MEMORIES TOGETHER SECTION ================= */}
      <div className="mt-20 pt-16 border-t border-lavender/25">
        <div className="text-center max-w-xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-soft-pink/60 dark:bg-lavender/20 text-xs font-semibold text-deep-purple dark:text-lavender-light mb-2">
            <Camera size={13} />
            <span>Our Little World Together</span>
          </div>
          <h3 className="font-serif text-2xl sm:text-3xl font-bold text-deep-purple dark:text-cream">
            Our Own Pictures & Memories ♡
          </h3>
          <p className="text-xs sm:text-sm text-deep-purple/70 dark:text-cream/70 mt-1">
            Beside all the love for Jungkook, this corner is dedicated to our sweetest memories.
          </p>

          <button
            onClick={() => setShowAddMemoryModal(true)}
            className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-lavender to-soft-pink-dark text-white text-xs font-semibold shadow-sm hover:shadow-dreamy transition-all hover:scale-105"
          >
            <Plus size={14} />
            <span>Add Our Memory 📸</span>
          </button>
        </div>
        {memoryError && <p className="surprise-error" role="alert">{memoryError}</p>}

        {/* Couple Polaroids Scrapbook Grid */}
        {coupleMemories.length === 0 ? (
          <div className="empty-memory-note">
            <span>୨୧</span>
            <p>Your little memory book is waiting for its first page.</p>
            <small>Add a photo that makes you both smile ♡</small>
          </div>
        ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {coupleMemories.map((mem, idx) => (
            <motion.div
              key={mem.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="relative group"
            >
              {/* Top Washi Tape */}
              <div className={`washi-tape ${idx % 2 === 0 ? 'rotate-[-2deg]' : 'rotate-[2deg]'}`} />

              {/* Polaroid Frame */}
              <div className="bg-white dark:bg-deep-purple-light p-4 pb-6 rounded-2xl shadow-polaroid border border-white/80 dark:border-lavender/20 transition-all duration-300 group-hover:-translate-y-2 group-hover:shadow-dreamy">
                {/* Photo container */}
                <div className="relative aspect-square overflow-hidden rounded-xl bg-lavender/10 shadow-inner">
                  <img
                    src={mem.image}
                    alt={mem.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute top-2 right-2 text-xl filter drop-shadow">
                    {mem.sticker}
                  </div>
                </div>

                {/* Handwritten details */}
                <div className="mt-4 text-center">
                  <p className="font-handwriting text-2xl font-bold text-deep-purple dark:text-cream leading-tight">
                    {mem.title}
                  </p>
                  <p className="text-[11px] font-sans text-lavender-dark dark:text-lavender-light/70 uppercase tracking-wider mt-0.5">
                    {mem.date}
                  </p>
                  <p className="font-handwriting text-base text-deep-purple/80 dark:text-cream/80 mt-2 px-1">
                    "{mem.caption}"
                  </p>
                </div>

                <button
                  onClick={() => handleDeleteMemory(mem.id)}
                  className="absolute top-4 right-4 p-1.5 rounded-full bg-black/40 hover:bg-rose-500 text-white opacity-0 group-hover:opacity-100 transition-opacity text-xs"
                  title="Delete this memory"
                >
                  <Trash2 size={12} />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
        )}
      </div>

      {/* Modal: Add Custom Couple Memory */}
      {showAddMemoryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-full max-w-md bg-white dark:bg-deep-purple-light rounded-3xl p-6 shadow-2xl border border-lavender/30"
          >
            <h4 className="font-serif text-xl font-bold text-deep-purple dark:text-cream mb-1">
              Add a Couple Polaroid ♡
            </h4>
            <p className="text-xs text-lavender-dark dark:text-lavender mb-4">
              Add a picture of the two of you to cherish on this page forever.
            </p>
            {memoryError && <p className="surprise-error mb-4" role="alert">{memoryError}</p>}

            <form onSubmit={handleAddMemory} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold mb-1 text-deep-purple dark:text-cream">
                  Memory Title:
                </label>
                <input
                  type="text"
                  placeholder="e.g. Our Anniversary Date"
                  value={newMemory.title}
                  onChange={(e) => setNewMemory({ ...newMemory, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-lavender/40 bg-cream/30 dark:bg-black/30 text-xs text-deep-purple dark:text-cream focus:outline-none focus:ring-2 focus:ring-lavender"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1 text-deep-purple dark:text-cream">
                  Handwritten Caption:
                </label>
                <input
                  type="text"
                  placeholder="e.g. When we stayed up till 3 AM talking..."
                  value={newMemory.caption}
                  onChange={(e) => setNewMemory({ ...newMemory, caption: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-lavender/40 bg-cream/30 dark:bg-black/30 text-xs text-deep-purple dark:text-cream focus:outline-none focus:ring-2 focus:ring-lavender"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1 text-deep-purple dark:text-cream">
                  Upload Photo or Paste Image URL:
                </label>
                <div className="space-y-2">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="w-full text-xs text-deep-purple dark:text-cream file:mr-2 file:py-1.5 file:px-3 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-lavender file:text-white hover:file:bg-lavender-dark cursor-pointer"
                  />
                  <div className="text-center text-[10px] text-lavender-dark dark:text-lavender">
                    — OR —
                  </div>
                  <input
                    type="url"
                    placeholder="https://...image-url"
                    value={newMemory.image.startsWith('data:') ? '' : newMemory.image}
                    onChange={(e) => setNewMemory({ ...newMemory, image: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-lavender/40 bg-cream/30 dark:bg-black/30 text-xs text-deep-purple dark:text-cream focus:outline-none focus:ring-2 focus:ring-lavender"
                  />
                </div>
              </div>

              {/* Preview */}
              {newMemory.image && (
                <div className="w-20 h-20 rounded-xl overflow-hidden mx-auto border-2 border-lavender shadow-sm">
                  <img src={newMemory.image} alt="Preview" className="w-full h-full object-cover" />
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold mb-1 text-deep-purple dark:text-cream">
                  Pick a Cute Sticker:
                </label>
                <div className="flex gap-3 text-lg">
                  {['💜', '✨', '☕', '🚗', '🌸', '🐰', '🧸'].map((s) => (
                    <button
                      type="button"
                      key={s}
                      onClick={() => setNewMemory({ ...newMemory, sticker: s })}
                      className={`p-1 rounded-lg ${newMemory.sticker === s ? 'bg-lavender/30 scale-125' : ''}`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddMemoryModal(false)}
                  className="px-4 py-2 rounded-full text-xs font-medium glass-pill text-deep-purple dark:text-cream"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!newMemory.title || !newMemory.image}
                  className="px-5 py-2 rounded-full text-xs font-bold bg-lavender text-white shadow-dreamy hover:bg-lavender-dark disabled:opacity-50 transition-colors"
                >
                  Add Polaroid ♡
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </section>
  );
}
