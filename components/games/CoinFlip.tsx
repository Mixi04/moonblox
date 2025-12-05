
import React, { useState } from 'react';
import { GameProps } from '../../types';
import { Coins, Trophy, Lock, Moon } from 'lucide-react';

const CoinFlip: React.FC<GameProps> = ({ balance, updateBalance, onPlay, isLoggedIn, onOpenLogin }) => {
  const [betAmount, setBetAmount] = useState<number>(100);
  const [choice, setChoice] = useState<'HEADS' | 'TAILS'>('HEADS');
  const [isFlipping, setIsFlipping] = useState(false);
  const [result, setResult] = useState<'HEADS' | 'TAILS' | null>(null);
  const [winAmount, setWinAmount] = useState<number | null>(null);

  const handleFlip = () => {
    if (!isLoggedIn) {
        onOpenLogin();
        return;
    }
    if (betAmount > balance || betAmount <= 0 || isFlipping) return;

    setIsFlipping(true);
    setResult(null);
    setWinAmount(null);
    updateBalance(-betAmount);
    onPlay(betAmount);

    const outcome = Math.random() > 0.5 ? 'HEADS' : 'TAILS';

    setTimeout(() => {
      setResult(outcome);
      setIsFlipping(false);
      if (outcome === choice) {
        const win = betAmount * 2;
        updateBalance(win);
        setWinAmount(win);
      }
    }, 2000);
  };

  return (
    <div className="w-full animate-fade-in">
       <div className="mb-8">
            <h2 className="text-3xl font-black italic tracking-tighter text-white flex items-center gap-3">
                COINFLIP
            </h2>
       </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-blox-surface border border-blox-border rounded-3xl p-12 relative overflow-hidden shadow-2xl flex flex-col items-center justify-center min-h-[400px]">
            <div className="perspective-1000 mb-12">
                <div 
                    className={`relative w-48 h-48 transform-style-3d transition-transform duration-[2000ms] ease-out ${
                        isFlipping ? 'animate-[spin_0.5s_linear_infinite]' : result === 'HEADS' ? 'rotate-y-0' : result === 'TAILS' ? 'rotate-y-180' : ''
                    }`}
                    style={{ transform: isFlipping ? 'rotateY(1800deg) rotateX(720deg)' : undefined }}
                >
                    <div className="absolute w-full h-full backface-hidden rounded-full border-4 border-[#F59E0B] shadow-[0_0_50px_rgba(245,158,11,0.3)] bg-[#F59E0B] flex items-center justify-center">
                        <Coins className="w-24 h-24 text-white opacity-80" />
                    </div>
                    <div className="absolute w-full h-full backface-hidden rotate-y-180 rounded-full border-4 border-gray-600 shadow-[0_0_50px_rgba(75,85,99,0.3)] bg-gray-700 flex items-center justify-center">
                         <div className="w-20 h-20 bg-gray-600 rounded-full" /> 
                    </div>
                </div>
            </div>
            
            <div className="h-8 text-center flex items-center justify-center gap-2">
                {winAmount && (
                    <div className="flex items-center gap-2 text-[#F59E0B] font-black text-2xl animate-scale-in">
                         WON <Moon size={24} fill="currentColor"/> {winAmount.toLocaleString()}
                    </div>
                )}
                {!winAmount && result && result !== choice && <div className="text-gray-500 font-bold">Try again.</div>}
            </div>
        </div>

        <div className="lg:col-span-1 space-y-6">
            <div className="bg-blox-surface border border-blox-border rounded-2xl p-6">
                 <div className="grid grid-cols-2 gap-3">
                    <button onClick={() => setChoice('HEADS')} disabled={isFlipping || !isLoggedIn}
                        className={`p-4 rounded-xl border font-black transition-all ${choice === 'HEADS' ? 'border-[#F59E0B] bg-[#F59E0B]/10 text-[#F59E0B]' : 'border-blox-border bg-blox-surfaceHighlight text-gray-500'}`}
                    >HEADS</button>
                    <button onClick={() => setChoice('TAILS')} disabled={isFlipping || !isLoggedIn}
                        className={`p-4 rounded-xl border font-black transition-all ${choice === 'TAILS' ? 'border-gray-500 bg-gray-500/10 text-gray-300' : 'border-blox-border bg-blox-surfaceHighlight text-gray-500'}`}
                    >TAILS</button>
                 </div>
            </div>

            <div className="bg-blox-surface border border-blox-border rounded-2xl p-6">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">Bet Amount</label>
                <div className="bg-[#13111A] rounded-xl border border-blox-border p-3 flex items-center mb-4">
                    <Moon size={16} className="text-blox-accent mr-2" fill="currentColor" />
                    <input
                        type="number"
                        value={betAmount}
                        onChange={(e) => setBetAmount(Math.max(0, parseInt(e.target.value) || 0))}
                        disabled={isFlipping || !isLoggedIn}
                        className="bg-transparent w-full outline-none text-white font-mono font-bold text-lg"
                    />
                </div>
                
                {isLoggedIn ? (
                    <button
                        onClick={handleFlip}
                        disabled={isFlipping || betAmount > balance || betAmount <= 0}
                        className="w-full py-4 rounded-xl font-black text-xl bg-blox-accent text-blox-surface hover:bg-blox-accentHover transition-all disabled:opacity-50"
                    >
                        {isFlipping ? 'FLIPPING...' : 'PLAY'}
                    </button>
                ) : (
                    <button
                        onClick={onOpenLogin}
                        className="w-full py-4 rounded-xl font-black text-sm bg-blox-surfaceHighlight border border-blox-border text-gray-300 hover:border-blox-accent hover:text-white transition-all flex items-center justify-center gap-2"
                    >
                        <Lock size={16} /> LOG IN TO PLAY
                    </button>
                )}
            </div>
        </div>
      </div>
    </div>
  );
};

export default CoinFlip;
