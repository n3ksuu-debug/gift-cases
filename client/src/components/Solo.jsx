import { useState } from 'react';
import RollStrip from './RollStrip';
import ItemCard from './ItemCard';

export default function Solo({ cases, balance, roll, won, spinning, onOpen, proof, seedInfo, onSetClientSeed, onResetSeed }) {
  const [seedInput, setSeedInput] = useState('');

  return (
    <div className="space-y-4">
      <div className="h-44 glass rounded-2xl overflow-hidden relative">
        {roll ? <RollStrip items={roll} spinning={spinning} /> : (
          <div className="flex items-center justify-center h-full text-slate-500 text-sm">
            Выберите кейс ниже
          </div>
        )}
        <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-rose-500 via-rose-400 to-rose-500 -translate-x-1/2 z-10 shadow-[0_0_12px_rgba(244,63,94,0.8)]" />
        <div className="absolute left-1/2 top-0 w-3 h-3 bg-rose-500 rounded-full -translate-x-1/2 -translate-y-1/2 z-10 shadow-[0_0_10px_rgba(244,63,94,0.9)]" />
      </div>

      {won && !spinning && (
        <div className="max-w-md mx-auto text-center animate-fade-in-up">
          <div className="text-slate-400 text-sm mb-2">Выпало:</div>
          <div className="flex items-center justify-center gap-4">
            <ItemCard item={won} size="lg" />
            <div className="text-left">
              <div className="font-bold text-lg font-display">{won.name}</div>
              <div className="text-amber-300 text-xl font-bold">{won.value.toLocaleString()} 💰</div>
            </div>
          </div>
          {proof && (
            <div className="text-xs text-slate-500 mt-2 font-mono">
              nonce={proof.nonce} · client={proof.clientSeed}
            </div>
          )}
        </div>
      )}

      <div className="glass rounded-2xl p-3 text-sm">
        <div className="flex flex-wrap gap-3 items-center">
          <div className="flex-1 min-w-0">
            <div className="text-xs text-slate-400">Server Seed Hash</div>
            <div className="truncate text-slate-300 font-mono text-xs">{seedInfo.serverSeedHash}</div>
          </div>
          <div>
            <div className="text-xs text-slate-400">Nonce</div>
            <div className="text-slate-300 font-mono">{seedInfo.nonce}</div>
          </div>
        </div>
        <div className="flex gap-2 mt-3 flex-wrap">
          <input
            value={seedInput}
            onChange={e => setSeedInput(e.target.value)}
            placeholder={`client seed: ${seedInfo.clientSeed}`}
            className="flex-1 min-w-[150px] bg-black/30 border border-white/10 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:border-indigo-400/60"
          />
          <button
            onClick={() => onSetClientSeed(seedInput)}
            className="bg-indigo-600 hover:bg-indigo-500 px-3 py-1.5 rounded-lg text-sm font-medium transition"
          >
            Применить
          </button>
          <button
            onClick={onResetSeed}
            className="bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-lg text-sm font-medium transition"
          >
            Сбросить seed
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {cases.map(c => {
          const topItem = [...c.items].sort((a, b) => b.value - a.value)[0];
          const disabled = spinning || balance < c.price;
          return (
            <div key={c.id} className="glass rounded-2xl p-4 card-hover">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <img src={c.image} alt={c.name} className="w-9 h-9 object-contain" />
                  <h2 className="font-bold font-display">{c.name}</h2>
                </div>
                <span className="text-amber-300 font-bold text-sm">{c.price.toLocaleString()} 💰</span>
              </div>
              <div className="flex justify-center my-3"><ItemCard item={topItem} size="md" /></div>
              <button
                onClick={() => onOpen(c.id)}
                disabled={disabled}
                className="w-full bg-gradient-to-r from-indigo-600 to-fuchsia-600 hover:from-indigo-500 hover:to-fuchsia-500 disabled:from-slate-700 disabled:to-slate-700 disabled:cursor-not-allowed py-2.5 rounded-xl font-bold transition shadow-lg shadow-indigo-500/20"
              >
                {balance < c.price ? 'Недостаточно 💰' : 'Открыть'}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}