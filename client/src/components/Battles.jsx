import { useState } from 'react';
import RollStrip from './RollStrip';
import ItemCard from './ItemCard';

export default function Battles({ cases, balance, battlesList, activeBattle, spinning, onCreate, onJoin, onClose, myId }) {
  const [selectedCase, setSelectedCase] = useState(cases[0]?.id || '');
  const [maxPlayers, setMaxPlayers] = useState(2);

  if (activeBattle) {
    return <BattleView battle={activeBattle} spinning={spinning} myId={myId} onClose={onClose} />;
  }

  return (
    <div className="space-y-4">
      <div className="glass rounded-2xl p-4">
        <h2 className="font-bold font-display mb-3">Создать битву</h2>
        <div className="flex flex-wrap gap-2 items-center">
          <select
            value={selectedCase}
            onChange={e => setSelectedCase(e.target.value)}
            className="bg-black/30 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-400/60"
          >
            {cases.map(c => <option key={c.id} value={c.id}>{c.name} ({c.price})</option>)}
          </select>
          <select
            value={maxPlayers}
            onChange={e => setMaxPlayers(Number(e.target.value))}
            className="bg-black/30 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-400/60"
          >
            <option value={2}>2 игрока</option>
            <option value={3}>3 игрока</option>
            <option value={4}>4 игрока</option>
          </select>
          <button
            onClick={() => onCreate(selectedCase, maxPlayers)}
            className="bg-gradient-to-r from-indigo-600 to-fuchsia-600 hover:from-indigo-500 hover:to-fuchsia-500 px-4 py-2 rounded-lg font-bold text-sm shadow-lg shadow-indigo-500/20 transition"
          >
            Создать
          </button>
        </div>
      </div>

      <div>
        <h2 className="font-bold font-display mb-3">Открытые битвы ({battlesList.length})</h2>
        {battlesList.length === 0 && <div className="text-slate-500 text-sm">Нет открытых битв. Создайте свою!</div>}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {battlesList.map(b => (
            <div key={b.id} className="glass rounded-xl p-3 flex justify-between items-center card-hover">
              <div className="flex items-center gap-3">
                <img src={b.caseImage} alt="" className="w-10 h-10 object-contain" />
                <div>
                  <div className="font-bold">{b.caseName}</div>
                  <div className="text-xs text-slate-400">
                    {b.players}/{b.maxPlayers} игроков · Вход: {b.entryCost.toLocaleString()} 💰
                  </div>
                </div>
              </div>
              <button
                onClick={() => onJoin(b.id)}
                disabled={balance < b.entryCost}
                className="bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-700 disabled:cursor-not-allowed px-4 py-2 rounded-lg font-bold text-sm transition"
              >
                Войти
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function BattleView({ battle, spinning, myId, onClose }) {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold font-display flex items-center gap-3">
          <img src={battle.caseImage} alt="" className="w-9 h-9 object-contain" />
          {battle.caseName} · {battle.state === 'waiting' ? 'Ожидание' : battle.state === 'spinning' ? 'Игра' : 'Завершено'}
        </h2>
        <button onClick={onClose} className="text-slate-400 hover:text-white transition">✕ Закрыть</button>
      </div>

      {battle.state === 'waiting' && (
        <div className="glass rounded-2xl p-6 text-center">
          <div className="text-lg font-display">Ожидание игроков: {battle.players.length}/{battle.maxPlayers}</div>
          <div className="mt-2 text-sm text-slate-400">
            ID битвы: <span className="font-mono text-slate-300">{battle.id}</span>
          </div>
        </div>
      )}

      {battle.results && (
        <div className="grid gap-4 md:grid-cols-2">
          {battle.results.map(r => {
            const isWinner = battle.state === 'finished' && battle.winner === r.playerId;
            const isMe = r.playerId === myId;
            return (
              <div
                key={r.playerId}
                className={`rounded-2xl p-3 border-2 transition-all ${
                  isWinner
                    ? 'border-amber-400 shadow-[0_0_28px_rgba(250,204,21,0.5)]'
                    : 'border-white/10'
                } glass`}
              >
                <div className="text-sm mb-2 font-bold">
                  {isMe ? '🫵 Вы' : `Игрок ${r.playerId.slice(0, 4)}`}
                  {isWinner && ' 🏆'}
                </div>
                <div className="h-32 bg-black/30 rounded-xl overflow-hidden relative">
                  {r.roll.length > 0 && <RollStrip items={r.roll} spinning={spinning} />}
                  <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-rose-500 -translate-x-1/2 z-10" />
                </div>
                {!spinning && r.item && (
                  <div className="flex items-center gap-3 mt-3">
                    <ItemCard item={r.item} size="sm" />
                    <div>
                      <div className="text-sm font-bold">{r.item.name}</div>
                      <div className="text-xs text-amber-300 font-bold">{r.item.value.toLocaleString()} 💰</div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {!battle.results && battle.players.length > 0 && (
        <div className="glass rounded-2xl p-4">
          <div className="text-sm text-slate-400 mb-2">Игроки:</div>
          <div className="flex gap-2 flex-wrap">
            {battle.players.map((p, i) => (
              <div key={i} className="bg-black/30 rounded-lg px-2 py-1 text-xs">
                {p.id === myId ? '🫵 Вы' : `Игрок ${p.id.slice(0, 4)}`}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}