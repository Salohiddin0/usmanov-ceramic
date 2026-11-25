'use client';
import { useEffect, useState } from 'react';
import { MAX_Q, MIN_Q, STEP_Q, clampQ } from '@/lib/cart';

// Dona soni: −/+ (10 tadan) yoki qo'lda yozish. Chegaralar: 10 … 1 000
export default function QtyInput({ id, value, onChange, label }) {
  const [text, setText] = useState(String(value));
  useEffect(() => setText(String(value)), [value]);
  const commit = (v) => {
    const q = clampQ(v);
    setText(String(q));
    if (q !== value) onChange(q);
  };
  const step = (d) => commit(value + d);
  return (
    <div className="qty">
      <button type="button" onClick={() => step(-STEP_Q)} disabled={value <= MIN_Q} aria-label={`−${STEP_Q}`}>
        −
      </button>
      <input
        id={id}
        type="number"
        inputMode="numeric"
        min={MIN_Q}
        max={MAX_Q}
        step="1"
        value={text}
        aria-label={label}
        onChange={(e) => setText(e.target.value)}
        onBlur={() => commit(text)}
        onKeyDown={(e) => e.key === 'Enter' && commit(text)}
      />
      <button type="button" onClick={() => step(STEP_Q)} disabled={value >= MAX_Q} aria-label={`+${STEP_Q}`}>
        +
      </button>
    </div>
  );
}
