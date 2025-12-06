
import React, { useState, useEffect, useRef } from 'react';
import { GameProps } from '../../types';
import { Rocket, History, TrendingUp, Lock, Moon } from 'lucide-react';

const Crash: React.FC<GameProps> = ({ balance, updateBalance, onPlay, isLoggedIn, onOpenLogin }) => {
  const [betAmount, setBetAmount] = useState<number>(100);
  const [multiplier, setMultiplier] = useState(1.00);
  const [isPlaying, setIsPlaying] = useState(false);
  const [crashed, setCrashed] = useState(false);
  const [cashedOut, setCashedOut] = useState(false);
  const [crashPoint, setCrashPoint] = useState(0);
  const [history, setHistory] = useState<number[]>([1.24, 2.55, 1.05, 8.44, 1.12]);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isPlaying && !crashed && !cashedOut) {
      interval = setInterval(() => {
        setMultiplier(prev => {
          const growth = prev * 0.008 + 0.002; 
          const next = prev + growth;
          if (next >= crashPoint) {
            setCrashed(true);
            setIsPlaying(false);
            setHistory(prev => [crashPoint, ...prev.slice(0, 9)]);
            return crashPoint;
          }
          return next;
        });
      }, 30); 
    }
    return () => clearInterval(interval);
  }, [isPlaying, crashed, cashedOut, crashPoint]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);
    const w = rect.width;
    const h = rect.height;
    ctx.clearRect(0, 0, w, h);

    // Grid
    ctx.strokeStyle = '#2F2B3E'; 
    ctx.lineWidth = 1;
    ctx.beginPath();
    for (let i = 1; i < 5; i++) { const y = h - (h / 5) * i; ctx.moveTo(0, y); ctx.lineTo(w, y); }
    for (let i = 1; i < 5; i++) { const x = (w / 5) * i; ctx.moveTo(x, 0); ctx.lineTo(x, h); }
    ctx.stroke();

    if (isPlaying || crashed || cashedOut) {
        ctx.beginPath();
        ctx.moveTo(0, h);
        const progress = Math.min((multiplier - 1) / 4, 1.1); 
        const x = w * (progress * 0.8); 
        const y = h - (h * Math.min((multiplier - 1) / 3, 0.9)); 

        const fillGrad = ctx.createLinearGradient(0, h, 0, 0);
        fillGrad.addColorStop(0, 'rgba(99, 102, 241, 0.0)');
        fillGrad.addColorStop(1, crashed ? 'rgba(244, 63, 94, 0.4)' : 'rgba(99, 102, 241, 0.4)');
        
        ctx.fillStyle = fillGrad;
        ctx.lineTo(x, y);
        ctx.lineTo(x, h);
        ctx.fill();

        ctx.beginPath();
        ctx.moveTo(0, h);
        ctx.lineTo(x, y);
        ctx.strokeStyle = crashed ? '#F43F5E' : '#6366F1';
        ctx.lineWidth = 4;
        ctx.lineCap = 'round';
        ctx.stroke();

        if (!crashed) {
            ctx.shadowBlur = 15;
            ctx.shadowColor = crashed ? '#F43F5E' : '#6366F1';
            ctx.fillStyle = '#FFFFFF';
            ctx.beginPath();
            ctx.arc(x, y, 6, 0, Math.PI * 2);
            ctx.fill();
            ctx.shadowBlur = 0;
        }
    }
  }, [multiplier, isPlaying, crashed, cashedOut]);

  const startGame = () => {
    if (!isLoggedIn) {
        onOpenLogin();
        return;
    }
    if (betAmount > balance || betAmount <= 0) return;
    
    // House Edge Logic (2.5%)
    // Formula: 0.975 / (1 - random)
    const r = Math.random();
    let cp = 0.975 / (1 - r);
    
    if (cp < 1.0) cp = 1.0;
    // Cap strictly for safety, though math allows higher
    // Ideally we floor it to 2 decimals
    cp = Math.floor(cp * 100) / 100;

    setCrashPoint(cp);
    setIsPlaying(true);
    setCrashed(false);
    setCashedOut(false);
    setMultiplier(1.00);
    updateBalance(-betAmount);
    onPlay(betAmount);
  };

  const cashOut = () => {
    if (!isPlaying || crashed || cashedOut) return;
    setCashedOut(true);
    setIsPlaying(false);
    updateBalance(Math.floor(betAmount * multiplier));
  };

  return (
    <div className="w-full animate-fade-in">
      <div className="flex flex-col md:flex-row items-center justify-between mb-6 gap-4">
         <h2 className="text-3xl font-black italic tracking-tighter flex items-center gap-3 text-white">
             CRASH
         </h2>
         <div className="flex items-center gap-2 overflow-x-auto max-w-full pb-2 md:pb-0">
            {history.map((val, idx) => (
                <div key={idx} className={`text-xs font-mono font-bold px-3 py-1.5 rounded-lg border bg-blox-surface ${val >= 2.0 ? 'text-green-400 border-green-500/20' : 'text-red-400 border-red-500/20'}`}>
                    {val.toFixed(2)}x
                </div>
            ))}
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3 h-[450px] bg-blox-surface border border-blox-border rounded-2xl relative overflow-hidden shadow-2xl">
            <canvas ref={canvasRef} className="w-full h-full object-contain absolute inset-0 z-0" />
            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center pointer-events-none">
                <div className={`text-7xl md:text-8xl font-black font-mono tracking-tighter transition-all duration-75 ${crashed ? 'text-blox-danger' : cashedOut ? 'text-green-400' : 'text-white'}`}>
                    {multiplier.toFixed(2)}x
                </div>
                {crashed && <div className="mt-2 text-blox-danger font-bold uppercase tracking-widest bg-blox-danger/10 px-4 py-1 rounded">Crashed</div>}
                {cashedOut && <div className="mt-2 text-green-400 font-bold uppercase tracking-widest bg-green-500/10 px-4 py-1 rounded">Cashed Out</div>}
            </div>
        </div>

        <div className="lg:col-span-1 bg-blox-surface border border-blox-border rounded-2xl p-6 flex flex-col h-auto lg:h-[450px]">
           <div className="mb-6">
                <label className="text-xs font-bold text-gray-500 uppercase mb-2 block">Bet Amount</label>
                <div className="bg-[#13111A] border border-blox-border rounded-xl p-3 flex items-center mb-2">
                    <Moon size={16} className="text-blox-accent mr-2" fill="currentColor" />
                    <input 
                        type="number" 
                        value={betAmount}
                        onChange={(e) => setBetAmount(Math.max(0, parseInt(e.target.value) || 0))}
                        disabled={isPlaying || !isLoggedIn}
                        className="bg-transparent w-full outline-none font-mono font-bold text-white text-lg"
                    />
                </div>
                <div className="grid grid-cols-2 gap-2">
                    <button onClick={() => setBetAmount(betAmount * 2)} disabled={isPlaying || !isLoggedIn} className="bg-blox-surfaceHighlight hover:bg-white/5 py-2 rounded-lg text-xs font-bold transition-colors">2x</button>
                    <button onClick={() => setBetAmount(Math.floor(betAmount / 2))} disabled={isPlaying || !isLoggedIn} className="bg-blox-surfaceHighlight hover:bg-white/5 py-2 rounded-lg text-xs font-bold transition-colors">1/2</button>
                </div>
           </div>

           <div className="mt-auto">
                {!isPlaying ? (
                     isLoggedIn ? (
                        <button 
                            onClick={startGame}
                            disabled={betAmount > balance || betAmount <= 0}
                            className="w-full py-4 rounded-xl font-black text-xl bg-blox-accent text-blox-surface hover:bg-blox-accentHover transition-all shadow-lg hover:shadow-yellow-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            PLACE BET
                        </button>
                    ) : (
                        <button
                            onClick={onOpenLogin}
                            className="w-full py-4 rounded-xl font-black text-sm bg-blox-surfaceHighlight border border-blox-border text-gray-300 hover:border-blox-accent hover:text-white transition-all flex items-center justify-center gap-2"
                        >
                            <Lock size={16} /> LOG IN TO PLAY
                        </button>
                    )
                ) : (
                    <button 
                        onClick={cashOut}
                        className="w-full py-4 rounded-xl font-black text-xl bg-white text-black hover:scale-[1.02] transition-all shadow-lg"
                    >
                        CASHOUT
                    </button>
                )}
           </div>
        </div>
      </div>
    </div>
  );
};

export default Crash;
