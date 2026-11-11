import React, { useEffect, useState } from 'react';

export default function HeartCursor() {
  const [cursorPos, setCursorPos] = useState({ x: -100, y: -100 });
  const [trails, setTrails] = useState([]);
  const [bursts, setBursts] = useState([]);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    // Only enable on non-touch devices with pointers
    const checkDesktop = () => {
      setIsDesktop(window.matchMedia('(hover: hover) and (pointer: fine)').matches);
    };
    checkDesktop();
    window.addEventListener('resize', checkDesktop);

    const handleMouseMove = (e) => {
      setCursorPos({ x: e.clientX, y: e.clientY });

      // Add trail star/heart occasionally
      if (Math.random() < 0.2) {
        const id = Math.random().toString(36).substring(7);
        const newTrail = {
          id,
          x: e.clientX,
          y: e.clientY,
          size: Math.random() * 8 + 8,
          rotation: Math.random() * 30 - 15,
        };
        setTrails((prev) => [...prev.slice(-12), newTrail]);

        setTimeout(() => {
          setTrails((prev) => prev.filter((t) => t.id !== id));
        }, 800);
      }
    };

    const handleClick = (e) => {
      // Create a cute burst of 5 mini hearts on click
      const newBursts = Array.from({ length: 6 }).map((_, i) => ({
        id: Math.random().toString(36).substring(7) + i,
        x: e.clientX,
        y: e.clientY,
        vx: (Math.random() - 0.5) * 80,
        vy: -Math.random() * 60 - 30,
        scale: Math.random() * 0.6 + 0.7,
        color: ['#B9A0D9', '#F4DCEB', '#9373BE', '#FCD34D', '#FFF'][Math.floor(Math.random() * 5)],
      }));

      setBursts((prev) => [...prev, ...newBursts]);
      setTimeout(() => {
        setBursts((prev) => prev.filter((b) => !newBursts.some((nb) => nb.id === b.id)));
      }, 1000);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('click', handleClick);

    return () => {
      window.removeEventListener('resize', checkDesktop);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('click', handleClick);
    };
  }, []);

  if (!isDesktop) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden">
      {/* Primary cute heart follower */}
      <div
        className="fixed top-0 left-0 transition-transform duration-75 ease-out will-change-transform"
        style={{
          transform: `translate3d(${cursorPos.x - 10}px, ${cursorPos.y - 10}px, 0)`,
        }}
      >
        <span className="text-sm select-none opacity-80 filter drop-shadow-[0_0_6px_rgba(185,160,217,0.8)]">
          💜
        </span>
      </div>

      {/* Sparkling trailing hearts */}
      {trails.map((trail) => (
        <div
          key={trail.id}
          className="fixed top-0 left-0 transition-all duration-700 ease-out select-none"
          style={{
            transform: `translate3d(${trail.x}px, ${trail.y}px, 0) scale(0) rotate(${trail.rotation}deg)`,
            opacity: 0,
            fontSize: `${trail.size}px`,
          }}
        >
          ✨
        </div>
      ))}

      {/* Click explosion hearts */}
      {bursts.map((burst) => (
        <div
          key={burst.id}
          className="fixed top-0 left-0 transition-all duration-1000 ease-out select-none animate-float-up"
          style={{
            transform: `translate3d(${burst.x + burst.vx}px, ${burst.y + burst.vy}px, 0) scale(${burst.scale})`,
            color: burst.color,
          }}
        >
          ♡
        </div>
      ))}
    </div>
  );
}
