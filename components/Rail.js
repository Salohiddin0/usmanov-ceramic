'use client';
import { useRef } from 'react';

// Mahsulotlar qatori: chapga/o'ngga aylantiriladi
export default function Rail({ children }) {
  const ref = useRef(null);
  const by = (d) => {
    const el = ref.current;
    if (el) el.scrollBy({ left: d * el.clientWidth * 0.8, behavior: 'smooth' });
  };
  return (
    <div className="railw">
      <button className="rbtn l" onClick={() => by(-1)} aria-label="←">
        ←
      </button>
      <button className="rbtn r" onClick={() => by(1)} aria-label="→">
        →
      </button>
      <div
        className="rail"
        ref={ref}
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'ArrowRight') {
            e.preventDefault();
            by(1);
          }
          if (e.key === 'ArrowLeft') {
            e.preventDefault();
            by(-1);
          }
        }}
      >
        {children}
      </div>
    </div>
  );
}
