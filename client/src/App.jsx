import { useEffect, useState } from 'react';
import { socket } from './socket';
import Solo from './components/Solo';
import Battles from './components/Battles';
import Inventory from './components/Inventory';

export default function App() {
  const [tab, setTab] = useState('solo');
  const [cases, setCases] = useState([]);
  const [balance, setBalance] = useState(0);
  const [inventory, setInventory] = useState([]);
  const [seedInfo, setSeedInfo] = useState({ serverSeedHash: '', clientSeed: '', nonce: 0 });
  const [myId, setMyId] = useState('');

  const [soloRoll, setSoloRoll] = useState(null);
  const [soloWon, setSoloWon] = useState(null);
  const [soloSpinning, setSoloSpinning] = useState(false);
  const [soloProof, setSoloProof] = useState(null);

  const [battlesList, setBattlesList] = useState([]);
  const [activeBattle, setActiveBattle] = useState(null);
  const [battleSpinning, setBattleSpinning] = useState(false);

  useEffect(() => {
    fetch('http://localhost:4000/api/cases').then(r => r.json()).then(setCases);
    socket.connect();

    socket.on('connect', () => setMyId(socket.id));
    socket.on('state', s => {
      setBalance(s.balance);
      setInventory(s.inventory);
      setSeedInfo({ serverSeedHash: s.serverSeedHash, clientSeed: s.clientSeed, nonce: s.nonce });
    });
    socket.on('error_msg', m => alert(m));
    socket.on('case_opened', ({ wonItem, roll, nonce, clientSeed }) => {
      setSoloWon(null); setSoloProof(null);
      setSoloRoll(roll); setSoloSpinning(true);
      setTimeout(() => {
        setSoloSpinning(false);
        setSoloWon(wonItem);
        setSoloProof({ nonce, clientSeed });
      }, 4500);
    });
    socket.on('seed_revealed', d => {
      alert(`Старый server seed: ${d.oldServerSeed}\nХэш был: ${d.oldHash}`);
    });
    socket.on('battles_list', setBattlesList);
    socket.on('battle_update', b => setActiveBattle(prev => prev && prev.id === b.id ? b : (prev || b)));
    socket.on('battle_spinning', b => { setActiveBattle(b); setBattleSpinning(true); });
    socket.on('battle_finished', b => { setActiveBattle(b); setBattleSpinning(false); });

    return () => socket.disconnect();
  }, []);

  const openCase = id => { if (!soloSpinning) socket.emit('open_case', { caseId: id }); };
  const sellItem = id => socket.emit('sell_item', { instanceId: id });
  const setClientSeed = s => socket.emit('set_client_seed', { clientSeed: s });
  const resetSeed = () => socket.emit('reset_seed');
  const createBattle = (caseId, maxPlayers) => socket.emit('create_battle', { caseId, maxPlayers });
  const joinBattle = id => socket.emit('join_battle', { battleId: id });
  const leaveBattleView = () => { setActiveBattle(null); setBattleSpinning(false); };

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-30 glass border-b border-white/5">
        <div className="max-w-6xl mx-auto flex justify-between items-center px-4 py-3">
          <h1 className="text-xl md:text-2xl font-display font-bold bg-gradient-to-r from-amber-300 via-pink-400 to-fuchsia-500 bg-clip-text text-transparent">
            ✦ Gift Cases
          </h1>
          <div className="glass px-4 py-1.5 rounded-xl flex items-center gap-2">
            <span className="text-lg">💰</span>
            <span className="text-amber-300 font-bold text-sm md:text-base">
              {balance.toLocaleString()}
            </span>
          </div>
        </div>
        <div className="max-w-6xl mx-auto flex gap-1 px-4 pb-2">
          {[
            { id: 'solo', label: '🎰 Кейсы' },
            { id: 'battles', label: '⚔️ Битвы' },
            { id: 'inventory', label: '🎒 Инвентарь' },
          ].map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`px-4 py-2 rounded-t-lg text-sm font-medium transition-all ${
                tab === t.id
                  ? 'bg-white/10 text-white shadow-[0_0_20px_rgba(168,85,247,0.3)]'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-4">
        {tab === 'solo' && (
          <Solo cases={cases} balance={balance} roll={soloRoll} won={soloWon}
            spinning={soloSpinning} onOpen={openCase} proof={soloProof}
            seedInfo={seedInfo} onSetClientSeed={setClientSeed} onResetSeed={resetSeed} />
        )}
        {tab === 'battles' && (
          <Battles cases={cases} balance={balance} battlesList={battlesList}
            activeBattle={activeBattle} spinning={battleSpinning}
            onCreate={createBattle} onJoin={joinBattle} onClose={leaveBattleView} myId={myId} />
        )}
        {tab === 'inventory' && <Inventory inventory={inventory} onSell={sellItem} />}
      </main>
    </div>
  );
}