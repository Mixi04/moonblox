
import React, { useState } from 'react';
import { GameProps } from '../../types';
import { Bomb, Diamond, Settings, Lock, Moon } from 'lucide-react';

const GRID_SIZE = 25;

const Mines: React.FC<GameProps> = ({ balance, updateBalance, onPlay, isLoggedIn, onOpenLogin }) => {
  const [betAmount, setBetAmount] = useState<number>(100);
  const [mineCount, setMineCount] = useState<number>(3);
  const [isPlaying, setIsPlaying] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [win, setWin] = useState(false);
  const [revealed, setRevealed] = useState<boolean[]>(Array(GRID_SIZE).fill(false));
  const [mines, setMines] = useState<boolean[]>(Array(GRID_SIZE).fill(false));

  const getMultiplier = () => {
    const revealedCount = revealed.filter(Boolean).length;
    let mult = 1.0;
    for(let i=0; i<revealedCount; i++) mult *= 0.99 * ( (GRID_SIZE - i) / (GRID_SIZE - mineCount - i));
    return Math.max(1.0, mult);
  };

  const startGame = () => {
    if (!isLoggedIn) {
        onOpenLogin();
        return;
    }
    if (betAmount > balance || betAmount <= 0) return;
    const newMines = Array(GRID_SIZE).fill(false);
    let planted = 0;
    while (planted < mineCount) {
        const idx = Math.floor(Math.random() * GRID_SIZE);
        if (!newMines[idx]) { newMines[idx] = true; planted++; }
    }
    setMines(newMines);
    setRevealed(Array(GRID_SIZE).fill(false));
    setIsPlaying(true);
    setGameOver(false);
    setWin(false);
    updateBalance(-betAmount);
    onPlay(betAmount);
  };

  const handleTileClick = (index: number) => {
    if (!isPlaying || gameOver || revealed[index]) return;
    const newRevealed = [...revealed];
    newRevealed[index] = true;
    setRevealed(newRevealed);
    if (mines[index]) {
        setGameOver(true);
        setWin(false);
        setIsPlaying(false);
        setTimeout(() => setRevealed(Array(GRID_SIZE).fill(true)), 400); 
    }
  };

  const cashOut = () => {
    if (!isPlaying || gameOver) return;
    updateBalance(Math.floor(betAmount * getMultiplier()));
    setGameOver(true);
    setWin(true);
    setIsPlaying(false);
    setRevealed(Array(GRID_SIZE).fill(true)); 
  };

  return (
    <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fade-in">
        <div className="lg:col-span-2 bg-blox-surface border border-blox-border rounded-3xl p-8 shadow-2xl relative">
            <div className="grid grid-cols-5 gap-3 aspect-square max-w-lg mx-auto">
                {Array.from({ length: GRID_SIZE }).map((_, idx) => {
                    const isRevealed = revealed[idx];
                    const isMine = mines[idx];
                    let style = "bg-blox-surfaceHighlight hover:bg-white/10 rounded-xl";
                    let content = null;

                    if (isRevealed) {
                        if (isMine) {
                            style = "bg-red-500/20 border-2 border-red-500 rounded-xl";
                            content = <Bomb className="w-6 h-6 text-red-500 animate-bounce-short" />;
                        } else {
                            style = "bg-emerald-500/20 border-2 border-emerald-500 rounded-xl";
                            content = <Diamond className="w-6 h-6 text-emerald-500 animate-scale-in" />;
                        }
                    } else if (gameOver && isMine) {
                         style = "bg-red-500/10 opacity-50 rounded-xl";
                         content = <Bomb className="w-5 h-5 text-red-500/50" />;
                    }

                    return (
                        <button key={idx} onClick={() => handleTileClick(idx)} disabled={!isPlaying || isRevealed || gameOver}
                            className={`flex items-center justify-center transition-all duration-200 ${style}`}
                        >
                            {content}
                        </button>
                    );
                })}
            </div>
            {gameOver && !win && <div className="absolute inset-0 flex items-center justify-center pointer-events-none"><div className="bg-red-600 text-white font-black text-4xl px-8 py-4 rounded-xl rotate-12 shadow-xl border-4 border-white/20">BUSTED</div></div>}
        </div>

        <div className="lg:col-span-1 bg-blox-surface border border-blox-border rounded-2xl p-6 flex flex-col">
            <div className="mb-6">
                 <label className="text-xs font-bold text-gray-500 uppercase block mb-2">Mines</label>
                 <div className="grid grid-cols-4 gap-2 mb-4">
                    {[1, 3, 5, 24].map(num => (
                        <button key={num} onClick={() => setMineCount(num)} disabled={isPlaying || !isLoggedIn}
                            className={`py-2 rounded-lg text-sm font-bold ${mineCount === num ? 'bg-blox-accent text-black' : 'bg-blox-surfaceHighlight text-gray-400'}`}
                        >{num}</button>
                    ))}
                 </div>
                 <label className="text-xs font-bold text-gray-500 uppercase block mb-2">Bet Amount</label>
                 <div className="bg-[#13111A] border border-blox-border rounded-xl p-3 flex items-center">
                    <Moon size={16} className="text-blox-accent mr-2" fill="currentColor" />
                    <input type="number" value={betAmount} onChange={(e) => setBetAmount(Math.max(0, parseInt(e.target.value) || 0))} disabled={isPlaying || !isLoggedIn} className="bg-transparent w-full outline-none font-mono font-bold text-white" />
                 </div>
            </div>

            <div className="mt-auto">
                {!isPlaying ? (
                    isLoggedIn ? (
                        <button onClick={startGame} disabled={betAmount > balance || betAmount <= 0}
                            className="w-full py-4 rounded-xl font-black text-xl bg-blox-accent text-blox-surface hover:bg-blox-accentHover transition-all disabled:opacity-50"
                        >PLAY</button>
                    ) : (
                         <button
                            onClick={onOpenLogin}
                            className="w-full py-4 rounded-xl font-black text-sm bg-blox-surfaceHighlight border border-blox-border text-gray-300 hover:border-blox-accent hover:text-white transition-all flex items-center justify-center gap-2"
                        >
                            <Lock size={16} /> LOG IN TO PLAY
                        </button>
                    )
                ) : (
                    <button onClick={cashOut} className="w-full py-4 rounded-xl font-black text-xl bg-green-500 text-white hover:bg-green-600 transition-all shadow-lg flex items-center justify-center gap-2">
                         CASHOUT <Moon size={18} fill="currentColor"/> {Math.floor(betAmount * getMultiplier()).toLocaleString()}
                    </button>
                )}
            </div>
        </div>
    </div>
  );
};

export default Mines;
