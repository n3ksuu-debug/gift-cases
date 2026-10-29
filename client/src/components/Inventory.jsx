import { RARITY } from '../constants';
import ItemCard from './ItemCard';

export default function Inventory({ inventory, onSell }) {
  const total = inventory.reduce((s, i) => s + i.value, 0);

  return (
    <div className="space-y-4">
      <div className="glass rounded-2xl p-4 flex justify-between">
        <div>
          <div className="text-slate-400 text-sm">Предметов</div>
          <div className="text-2xl font-bold font-display">{inventory.length}</div>
        </div>
        <div className="text-right">
          <div className="text-slate-400 text-sm">Общая стоимость</div>
          <div className="text-2xl font-bold text-amber-300 font-display">{total.toLocaleString()} 💰</div>
        </div>
      </div>

      {inventory.length === 0 ? (
        <div className="text-center text-slate-500 py-8">Инвентарь пуст</div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {inventory.map(item => {
            const r = RARITY[item.rarity] || RARITY.common;
            return (
              <div key={item.instanceId} className={`rounded-2xl p-3 border-2 ${r.border} ${r.bg} ${r.glow} card-hover`}>
                <div className="flex justify-center mb-2"><ItemCard item={item} size="md" showGlow={false} /></div>
                <div className="text-xs text-center truncate">{item.name}</div>
                <div className="text-amber-300 text-sm font-bold text-center">{item.value.toLocaleString()} 💰</div>
                <button
                  onClick={() => onSell(item.instanceId)}
                  className="w-full mt-2 bg-emerald-600 hover:bg-emerald-500 text-xs py-1.5 rounded-lg font-bold transition"
                >
                  Продать ({Math.floor(item.value * 0.9)})
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}