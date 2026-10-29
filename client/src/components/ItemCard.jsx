import { RARITY } from '../constants';

const SIZES = {
  sm: { box: 'w-20 h-20', img: 'w-12 h-12' },
  md: { box: 'w-28 h-28', img: 'w-20 h-20' },
  lg: { box: 'w-40 h-40', img: 'w-28 h-28' },
  xl: { box: 'w-48 h-48', img: 'w-32 h-32' },
};

export default function ItemCard({ item, size = 'md', showGlow = true }) {
  if (!item) return null;
  const r = RARITY[item.rarity] || RARITY.common;
  const s = SIZES[size];
  const isLegendary = item.rarity === 'legendary';
  const glow = showGlow && isLegendary ? 'legendary-glow' : '';

  return (
    <div
      className={`${s.box} relative flex items-center justify-center rounded-2xl border-2 ${r.border} ${r.bg} ${r.glow} ${glow} overflow-hidden card-hover`}
    >
      <div
        className="absolute inset-0 opacity-40 pointer-events-none"
        style={{ background: `radial-gradient(circle at 50% 40%, ${r.color}, transparent 70%)` }}
      />
      <img
        src={item.image}
        alt={item.name}
        className={`${s.img} object-contain relative z-10 drop-shadow-[0_4px_12px_rgba(0,0,0,0.5)] select-none`}
        loading="lazy"
        draggable={false}
      />
    </div>
  );
}