import { useEffect, useRef, useState } from 'react';
import { RARITY } from '../constants';

export default function RollStrip({ items, spinning, winIndex = 50 }) {
  const wrapRef = useRef(null);
  const [cw, setCw] = useState(800);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const measure = () => { if (wrapRef.current) setCw(wrapRef.current.offsetWidth); };
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, []);

  useEffect(() => {
    if (spinning) {
      setReady(false);
      const t = setTimeout(() => setReady(true), 50);
      return () => clearTimeout(t);
    }
    setReady(false);
  }, [spinning, items]);

  const itemWidth = 108, gap = 10;
  const winCenter = winIndex * (itemWidth + gap) + itemWidth / 2;
  const targetX = cw / 2 - winCenter;
  const startX = cw;

  return (
    <div ref={wrapRef} className="absolute inset-0">
      <div
        className="flex h-full items-center absolute top-0 left-0"
        style={{
          gap: `${gap}px`,
          transform: `translateX(${ready ? targetX : startX}px)`,
          transition: ready ? 'transform 4.5s cubic-bezier(0.15, 0.9, 0.25, 1)' : 'none',
        }}
      >
        {items.map((it, i) => {
          const r = RARITY[it.rarity] || RARITY.common;
          const isWin = i === winIndex && !spinning;
          const isLegendary = it.rarity === 'legendary';
          return (
            <div
              key={i}
              className={`shrink-0 h-32 flex flex-col items-center justify-center rounded-2xl border-2 ${r.border} ${r.bg} ${isWin || isLegendary ? r.glow : ''} relative overflow-hidden`}
              style={{ width: itemWidth }}
            >
              <div
                className="absolute inset-0 opacity-50 pointer-events-none"
                style={{ background: `radial-gradient(circle at 50% 40%, ${r.color}, transparent 70%)` }}
              />
              <img
                src={it.image}
                alt={it.name}
                className="w-12 h-12 object-contain relative z-10 drop-shadow-lg"
                draggable={false}
              />
              <span className={`text-[10px] mt-1 text-center px-1 leading-tight relative z-10 ${r.text} font-medium`}>
                {it.name}
              </span>
              <span className="text-amber-300 text-xs font-bold mt-0.5 relative z-10">
                {it.value.toLocaleString()}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}