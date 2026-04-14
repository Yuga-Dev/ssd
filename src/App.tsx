import { useEffect, useState } from 'react';
import { useGameStore } from './store/gameStore';
import { socket } from './lib/socket';
import './App.css';

function getDeviceId() {
  let id = localStorage.getItem('deviceId');
  if (!id) {
     id = Math.random().toString(36).substring(2, 15);
     localStorage.setItem('deviceId', id);
  }
  return id;
}

function CountdownTimer({ endTime }: { endTime: number }) {
  const [timeLeft, setTimeLeft] = useState(endTime - Date.now());

  useEffect(() => {
    const interval = setInterval(() => {
      const remaining = endTime - Date.now();
      if (remaining <= 0) {
        setTimeLeft(0);
        clearInterval(interval);
      } else {
        setTimeLeft(remaining);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [endTime]);

  const minutes = Math.floor(timeLeft / 60000);
  const seconds = Math.floor((timeLeft % 60000) / 1000);

  return (
    <div className="text-5xl font-mono mb-6 text-emerald-400 border border-emerald-500/20 bg-emerald-500/10 p-4 rounded-xl shadow-inner font-black">
      {minutes}:{seconds.toString().padStart(2, '0')}
    </div>
  );
}

function App() {
  const store = useGameStore();
  const [joinName, setJoinName] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  
  const [isWordRevealed, setIsWordRevealed] = useState(false);
  const [timerDuration, setTimerDuration] = useState(5);
  const [selectedPlayerIds, setSelectedPlayerIds] = useState<string[]>([]);

  useEffect(() => {
     const savedName = localStorage.getItem('displayName');
     if (savedName) {
         setJoinName(savedName);
     }
  }, []);

  useEffect(() => {
    socket.on('connect', () => {
      store.setConnected(true);
      // Auto reconnect identity if we have credentials
      const savedName = localStorage.getItem('displayName');
      if (savedName) {
         socket.emit('register_device', { displayName: savedName, deviceId: getDeviceId() });
      }
    });

    socket.on('disconnect', () => {
      store.setConnected(false);
      store.resetGame();
      store.setIdentity('', '', ''); // Reset identity
    });

    socket.on('device_registered', (data: { playerId: string, displayName: string }) => {
       store.setIdentity(data.playerId, getDeviceId(), data.displayName);
       localStorage.setItem('displayName', data.displayName);
       socket.emit('get_active_players');
       setErrorMsg('');
    });

    socket.on('active_players_list', (players) => {
       store.setActivePlayers(players);
    });

    socket.on('route_players_to_room', ({ code, targetPlayerIds }) => {
       const state = useGameStore.getState();
       // if we are explicitly invited to this room mapping, forcefully join it
       if (state.playerId && targetPlayerIds.includes(state.playerId)) {
          socket.emit('join_room', { code, name: state.playerName, playerId: state.playerId });
       }
    });

    socket.on('room_created', (data: { code: string }) => {
      const state = useGameStore.getState();
      state.setHost(true);
      state.setRoom(data.code, [], 'lobby');
      
      // Auto-join the host as a player
      if (state.playerId && state.playerName) {
         socket.emit('join_room', { code: data.code, name: state.playerName, playerId: state.playerId });
      }
      
      setErrorMsg('');
    });

    socket.on('room_state_update', (room: any) => {
      store.setRoom(room.code, room.players, room.status);
    });

    socket.on('game_started', (room: any) => {
      store.setRoom(room.code, room.players, 'active');
    });

    socket.on('role_assigned', (data: { role: 'Imposter' | 'Crewmate', word: string, endTime: number }) => {
      store.setRole(data.role === 'Imposter', data.word, data.endTime);
    });

    socket.on('game_ended', (data: { imposterId: string, realWord: string, imposterWord: string }) => {
      store.setReveal({
         imposterId: data.imposterId,
         realWord: data.realWord,
         imposterWord: data.imposterWord
      });
    });

    socket.on('error', (data: { message: string }) => {
      setErrorMsg(data.message);
    });

    socket.on('room_closed', () => {
      store.resetGame();
      setErrorMsg('The room has been closed.');
    });

    return () => {
      socket.off('connect');
      socket.off('disconnect');
      socket.off('device_registered');
      socket.off('active_players_list');
      socket.off('route_players_to_room');
      socket.off('room_created');
      socket.off('room_state_update');
      socket.off('game_started');
      socket.off('role_assigned');
      socket.off('game_ended');
      socket.off('error');
      socket.off('room_closed');
    };
  }, [store]);

  const handleIdentify = () => {
     if (!joinName.trim()) return setErrorMsg('Please enter a display name.');
     socket.emit('register_device', { displayName: joinName, deviceId: getDeviceId() });
  };

  const togglePlayerSelection = (id: string) => {
     setSelectedPlayerIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const handleCreateRoom = () => {
     // A Host creates the room and forcibly pulls selected players
     const allTargets = Array.from(new Set([...selectedPlayerIds, store.playerId as string]));
     // Note: Imposter game requires minimum 3 players
     if (allTargets.length < 3) return setErrorMsg('You must play with at least 3 players.');
     
     socket.emit('create_room', { playerIds: allTargets });
  };

  const handleStartGame = () => store.roomCode && socket.emit('start_game', { code: store.roomCode, duration: timerDuration });
  const handleEndGame = () => store.roomCode && socket.emit('end_game', { code: store.roomCode });

  if (!store.isConnected) {
    return <div className="p-8 text-center text-white">Connecting to server...</div>;
  }

  // REVEAL LOGIC
  if (store.status === 'reveal' && store.revealState) {
    const imposterPlayer = store.players.find(p => p.socketId === store.revealState?.imposterId);
    
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-4 leading-normal font-sans">
        <h1 className="text-4xl font-black mb-8 text-transparent bg-clip-text bg-gradient-to-br from-rose-500 to-orange-500 pb-2">GAME OVER</h1>
        
        <div className="bg-gray-800 p-8 rounded-xl shadow-2xl max-w-md w-full border border-gray-700 text-center">
          <p className="text-gray-400 font-bold uppercase tracking-widest text-sm mb-2">The Imposter was...</p>
          <h2 className="text-4xl font-black text-rose-500 mb-8">{imposterPlayer?.name || 'Unknown'}</h2>
          
          <div className="grid grid-cols-2 gap-4 text-left">
            <div className="bg-gray-900 p-4 rounded-lg border border-cyan-500/30">
               <span className="text-xs font-bold text-cyan-500 uppercase tracking-wider block mb-1">Crewmate Word</span>
               <span className="text-xl font-bold">{store.revealState.realWord}</span>
            </div>
            <div className="bg-gray-900 p-4 rounded-lg border border-rose-500/30">
               <span className="text-xs font-bold text-rose-500 uppercase tracking-wider block mb-1">Imposter Word</span>
               <span className="text-xl font-bold">{store.revealState.imposterWord}</span>
            </div>
          </div>
          
          <button
             onClick={() => store.resetGame()}
             className="mt-8 w-full py-3 bg-gray-700 hover:bg-gray-600 rounded-xl font-bold transition-all shadow text-white tracking-wider uppercase text-sm"
          >
             Return to Home
          </button>
        </div>
      </div>
    )
  }

  // ACTIVE LOGIC
  if (store.status === 'active') {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-4 select-none">
        
        {store.isHost && (
          <div className="bg-gray-800 p-6 rounded-xl shadow-lg text-center border border-rose-500/30 max-w-sm w-full mb-6 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-rose-500"></div>
            <h2 className="text-sm font-bold mb-4 text-rose-400 tracking-widest uppercase">Host Controls</h2>
            {store.endTime && <CountdownTimer endTime={store.endTime} />}
            <button
               onClick={handleEndGame}
               className="mt-2 w-full py-3 bg-rose-600 hover:bg-rose-500 rounded font-bold transition-all shadow-lg text-white tracking-wide"
            >
               Force End Game
            </button>
          </div>
        )}

        {store.assignedWord && (
          <div className="bg-gray-800 rounded-xl shadow-2xl text-center border border-gray-700 max-w-sm w-full flex flex-col overflow-hidden">
            <div className="p-6 bg-gray-900/50 border-b border-gray-700">
               <h2 className="text-lg text-gray-400 font-medium">Your Identity is</h2>
               {store.isImposter ? (
                  <div className="text-rose-500 text-3xl font-black uppercase tracking-wider mt-1">IMPOSTER</div>
               ) : (
                  <div className="text-cyan-400 text-3xl font-black uppercase tracking-wider mt-1">CREWMATE</div>
               )}
            </div>
            
            <div className="p-8">
               <p className="text-gray-400 mb-6 text-sm">Make sure no one is looking at your screen.</p>
               
               <div 
                  className={`relative cursor-pointer select-none rounded-xl border-2 transition-all duration-200 ease-in-out p-8 ${isWordRevealed ? 'border-indigo-500 bg-indigo-500/10' : 'border-gray-600 bg-gray-700 hover:bg-gray-600 active:scale-95'}`}
                  onMouseDown={() => setIsWordRevealed(true)}
                  onMouseUp={() => setIsWordRevealed(false)}
                  onMouseLeave={() => setIsWordRevealed(false)}
                  onTouchStart={(e) => { e.preventDefault(); setIsWordRevealed(true); }}
                  onTouchEnd={(e) => { e.preventDefault(); setIsWordRevealed(false); }}
               >
                  {isWordRevealed ? (
                     <div className="text-4xl font-black text-white tracking-wide animate-pulse">{store.assignedWord}</div>
                  ) : (
                     <div className="flex flex-col items-center">
                        <svg className="w-10 h-10 mb-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                        <span className="font-bold text-gray-300">HOLD TO REVEAL</span>
                     </div>
                  )}
               </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // LOBBY LOGIC
  if (store.roomCode) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-4 leading-normal font-sans">
        <div className="bg-gray-800 p-8 rounded-xl shadow-2xl max-w-md w-full border border-gray-700">

          <h2 className="text-2xl font-bold mb-4">Pregame Dashboard</h2>
          <div className="bg-gray-900 rounded p-4 mb-6 min-h-[150px]">
            {store.players.length === 0 ? (
              <p className="text-gray-500 italic text-center mt-8">Waiting for players...</p>
            ) : (
              <ul className="space-y-2">
                {store.players.map((p, i) => (
                  <li key={i} className="bg-gray-800 px-3 py-2 rounded font-medium flex items-center shadow-sm">
                     <span className="w-6 h-6 rounded-full bg-indigo-500 text-xs flex items-center justify-center mr-3 font-bold">
                        {p.name.charAt(0).toUpperCase()}
                     </span>
                     {p.name}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {store.isHost ? (
            <div className="space-y-4 shadow-lg border border-gray-700 bg-gray-900/40 p-4 rounded-xl">
               <div>
                  <label className="text-xs uppercase font-bold text-gray-400 mb-2 block tracking-wider">Game Duration</label>
                  <select 
                     className="w-full bg-gray-800 border-gray-600 rounded text-white p-3 outline-none focus:ring-2 focus:ring-emerald-500 shadow-inner cursor-pointer"
                     value={timerDuration}
                     onChange={(e) => setTimerDuration(Number(e.target.value))}
                  >
                     <option value={3}>3 Minutes (Fast)</option>
                     <option value={5}>5 Minutes (Standard)</option>
                     <option value={10}>10 Minutes (Long)</option>
                  </select>
               </div>
               <button
                 onClick={handleStartGame}
                 disabled={store.players.length < 3}
                 className="w-full py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 disabled:from-gray-700 disabled:to-gray-800 disabled:text-gray-500 rounded-lg font-bold transition-all shadow-lg text-lg uppercase tracking-wide"
               >
                 Start Session ({store.players.length}/12)
               </button>
            </div>
          ) : (
             <div className="p-4 bg-indigo-500/10 text-indigo-300 rounded text-center border border-indigo-500/20 text-sm font-medium">
                Waiting for host to configure the game...
             </div>
          )}
          {errorMsg && <p className="text-rose-400 mt-4 text-center text-sm font-medium">{errorMsg}</p>}
        </div>
      </div>
    );
  }

  // NOT IDENTIFIED LOGIC
  if (!store.playerId) {
      return (
         <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-4 leading-normal font-sans">
             <div className="text-center mb-12">
               <h1 className="text-5xl font-black mb-2 tracking-tight text-transparent bg-clip-text bg-gradient-to-br from-indigo-400 to-rose-500 pb-2">IMPOSTER</h1>
               <p className="text-gray-400 font-medium tracking-wide">Enter your name to connect</p>
             </div>
             
             <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 shadow-xl w-full max-w-xs">
                 <input
                   type="text"
                   placeholder="Your Name"
                   className="w-full p-3 mb-4 bg-gray-900 border border-gray-600 rounded focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none text-white transition-all placeholder:text-gray-500"
                   value={joinName}
                   onChange={(e) => setJoinName(e.target.value)}
                 />
                 <button
                   onClick={handleIdentify}
                   className="w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 rounded-xl font-bold shadow-lg shadow-indigo-600/20 transition-all text-white text-lg"
                 >
                   Connect
                 </button>
                 {errorMsg && <p className="text-rose-400 text-sm mt-4 text-center font-medium">{errorMsg}</p>}
             </div>
         </div>
      );
  }

  // PLAYER DASHBOARD (Identified, No Active Room)
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-4 leading-normal font-sans">
      <div className="w-full max-w-sm mb-6 flex justify-between items-end border-b border-gray-700 pb-2">
         <h1 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-br from-indigo-400 to-rose-500">IMPOSTER</h1>
         <div className="text-xs font-bold text-gray-400 bg-gray-800 px-2 py-1 rounded">Logged in as <span className="text-indigo-400">{store.playerName}</span></div>
      </div>

      <div className="w-full max-w-sm">
        <h2 className="text-lg font-bold mb-4 text-gray-200">Start a Match</h2>

        <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 shadow-xl mb-6">
           <h3 className="text-sm uppercase tracking-wider font-bold text-gray-400 mb-3">Online Players</h3>
           
           <div className="bg-gray-900 rounded p-2 min-h-[150px] max-h-[300px] overflow-y-auto mb-4 border border-gray-700/50">
             {store.activePlayers.length <= 1 ? (
               <p className="text-gray-500 italic text-center mt-8 text-sm">No other players online.</p>
             ) : (
               <ul className="space-y-1">
                 {store.activePlayers.filter(p => p._id !== store.playerId).map((p) => (
                   <li 
                      key={p._id} 
                      onClick={() => togglePlayerSelection(p._id)}
                      className={`cursor-pointer px-3 py-2 rounded font-medium flex items-center justify-between text-sm transition-all border ${selectedPlayerIds.includes(p._id) ? 'bg-indigo-500/20 border-indigo-500' : 'bg-gray-800 border-transparent hover:border-gray-600'}`}
                   >
                      <div className="flex items-center">
                         <div className={`w-2 h-2 rounded-full mr-3 ${p.isOnline ? 'bg-emerald-500' : 'bg-gray-500'}`}></div>
                         {p.displayName}
                      </div>
                      {selectedPlayerIds.includes(p._id) && (
                         <span className="text-indigo-400 text-lg leading-none">✓</span>
                      )}
                   </li>
                 ))}
               </ul>
             )}
           </div>

           <button
             onClick={handleCreateRoom}
             className="w-full py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 rounded-xl font-bold shadow-lg shadow-emerald-600/20 transition-all text-white uppercase tracking-wider text-sm"
           >
             Act as Host & Player
           </button>
           {errorMsg && <p className="text-rose-400 text-sm mt-4 text-center font-medium bg-rose-500/10 p-2 rounded">{errorMsg}</p>}
        </div>
        
        <p className="text-xs text-center text-gray-500 font-medium">Wait here if you expect someone else to invite you to a game.</p>
      </div>
    </div>
  );
}

export default App;
