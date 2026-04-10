import { useEffect, useState } from 'react';
import { useGameStore } from './store/gameStore';
import socket from './lib/socket';
import './App.css';

function App() {
  const store = useGameStore();
  const [joinCode, setJoinCode] = useState('');
  const [joinName, setJoinName] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    socket.on('connect', () => {
      store.setConnected(true);
    });

    socket.on('disconnect', () => {
      store.setConnected(false);
      store.resetGame();
    });

    socket.on('room_created', (data: { code: string }) => {
      store.setHost(true);
      store.setRoom(data.code, [], 'lobby');
      setErrorMsg('');
    });

    socket.on('room_state_update', (room: any) => {
      store.setRoom(room.code, room.players, room.status);
    });

    socket.on('game_started', (room: any) => {
      store.setRoom(room.code, room.players, 'active');
    });

    socket.on('role_assigned', (data: { role: 'Imposter' | 'Crewmate' }) => {
      store.setRole(data.role === 'Imposter', null);
    });

    socket.on('error', (data: { message: string }) => {
      setErrorMsg(data.message);
    });

    socket.on('room_closed', () => {
      store.resetGame();
      setErrorMsg('The host has closed the room.');
    });

    return () => {
      socket.off('connect');
      socket.off('disconnect');
      socket.off('room_created');
      socket.off('room_state_update');
      socket.off('game_started');
      socket.off('role_assigned');
      socket.off('error');
      socket.off('room_closed');
    };
  }, []);

  const handleCreateRoom = () => {
    socket.emit('create_room');
  };

  const handleJoinRoom = () => {
    if (!joinCode || !joinName) {
      setErrorMsg('Please enter both a code and your name.');
      return;
    }
    socket.emit('join_room', { code: joinCode, name: joinName });
  };

  const handleStartGame = () => {
    if (store.roomCode) {
      socket.emit('start_game', { code: store.roomCode });
    }
  };

  if (!store.isConnected) {
    return <div className="p-8 text-center text-white">Connecting to server...</div>;
  }

  if (store.status === 'active') {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-4">
        <h1 className="text-3xl font-bold mb-4 text-rose-500">Game Started!</h1>
        {store.isHost ? (
          <div className="bg-gray-800 p-6 rounded-lg shadow-xl text-center border overflow-hidden border-rose-500/30">
            <h2 className="text-xl font-bold mb-2">Host Dashboard</h2>
            <p className="text-gray-400">You are moderating this game.</p>
            <p className="mt-4 text-sm text-gray-500">Wait for the current round to complete</p>
          </div>
        ) : (
          <div className="bg-gray-800 p-6 rounded-lg shadow-xl text-center border overflow-hidden border-rose-500/30">
            <h2 className="text-xl font-bold mb-2">Your Identity</h2>
            <div className="p-4 bg-gray-900 rounded my-4">
               {store.isImposter ? (
                  <span className="text-rose-500 text-2xl font-black uppercase tracking-wider">IMPOSTER</span>
               ) : (
                  <span className="text-cyan-400 text-2xl font-black uppercase tracking-wider">CREWMATE</span>
               )}
            </div>
            <p className="text-gray-400">Wait for your word to be distributed...</p>
          </div>
        )}
      </div>
    );
  }

  if (store.roomCode) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-4 leading-normal font-sans">
        <div className="bg-gray-800 p-8 rounded-xl shadow-2xl max-w-md w-full border overflow-hidden border-gray-700">
           {store.isHost && (
              <div className="mb-6 p-4 bg-orange-500/10 rounded-lg text-center border border-orange-500/20">
                 <p className="text-sm font-semibold uppercase text-orange-400 tracking-widest mb-1">Room Code</p>
                 <p className="text-4xl font-black font-mono tracking-[0.25em] ml-[0.25em] text-white">{store.roomCode}</p>
                 <p className="mt-2 text-xs text-orange-400/80">Share this code with players so they can join.</p>
              </div>
           )}

          <h2 className="text-2xl font-bold mb-4">Lobby</h2>
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
            <button
              onClick={handleStartGame}
              disabled={store.players.length < 3}
              className="w-full py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 disabled:from-gray-700 disabled:to-gray-800 disabled:text-gray-500 rounded-lg font-bold transition-all shadow-lg text-lg uppercase tracking-wide"
            >
              Start Game ({store.players.length}/12)
            </button>
          ) : (
             <div className="p-4 bg-indigo-500/10 text-indigo-300 rounded text-center border border-indigo-500/20 text-sm font-medium">
                Waiting for host to start the game...
             </div>
          )}
          {errorMsg && <p className="text-rose-400 mt-4 text-center text-sm font-medium">{errorMsg}</p>}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-4 leading-normal font-sans">
      <div className="text-center mb-12">
         <h1 className="text-5xl font-black mb-2 tracking-tight text-transparent bg-clip-text bg-gradient-to-br from-indigo-400 to-rose-500 pb-2">IMPOSTER</h1>
         <p className="text-gray-400 font-medium tracking-wide">The ultimate word deduction game</p>
      </div>

      <div className="flex flex-col gap-8 w-full max-w-sm">
        <button
          onClick={handleCreateRoom}
          className="w-full py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 rounded-xl font-bold shadow-lg shadow-indigo-600/20 transition-all text-lg"
        >
          Create Room (Host)
        </button>

        <div className="relative">
           <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-700"></div>
           </div>
           <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-gray-900 text-gray-400">OR</span>
           </div>
        </div>

        <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 shadow-xl">
          <h2 className="text-lg font-bold mb-4 text-gray-200">Join a Game</h2>
          <input
            type="text"
            placeholder="4-Letter Code"
            className="w-full p-3 mb-3 bg-gray-900 border border-gray-600 rounded focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none uppercase font-mono tracking-widest text-white transition-all placeholder:normal-case placeholder:tracking-normal placeholder:font-sans"
            value={joinCode}
            onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
            maxLength={4}
          />
          <input
            type="text"
            placeholder="Your Name"
            className="w-full p-3 mb-4 bg-gray-900 border border-gray-600 rounded focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none text-white transition-all placeholder:text-gray-500"
            value={joinName}
            onChange={(e) => setJoinName(e.target.value)}
          />
          <button
            onClick={handleJoinRoom}
            className="w-full py-3 bg-gray-700 hover:bg-gray-600 rounded-lg font-bold transition-all shadow text-gray-100"
          >
            Join Room
          </button>
          {errorMsg && <p className="text-rose-400 text-sm mt-4 text-center font-medium bg-rose-500/10 p-2 rounded">{errorMsg}</p>}
        </div>
      </div>
    </div>
  );
}

export default App;
