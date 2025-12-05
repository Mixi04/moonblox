
import React from 'react';
import { UserState } from '../types';
import { Trophy, Medal, Crown, ChevronRight, Moon, Shield } from 'lucide-react';

interface LeaderboardProps {
    user: UserState;
    onGoHome: () => void;
}

// Mock Data for the simulation
const MOCK_LEADERS = [
    { rank: 1, username: "CryptoKing", level: 142, wagers: 25000000, avatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=King" },
    { rank: 2, username: "MoonWhale", level: 98, wagers: 18500000, avatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=Whale" },
    { rank: 3, username: "LuckyStrike", level: 86, wagers: 12000000, avatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=Lucky" },
    { rank: 4, username: "Satoshi_Nak", level: 75, wagers: 8000000, avatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=Satoshi" },
    { rank: 5, username: "DogeFather", level: 62, wagers: 5400000, avatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=Doge" },
    { rank: 6, username: "VitalikB", level: 59, wagers: 4200000, avatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=Vitalik" },
    { rank: 7, username: "DiamondHnds", level: 45, wagers: 2100000, avatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=Diamond" },
    { rank: 8, username: "ToTheMoon", level: 30, wagers: 950000, avatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=Moon" },
    { rank: 9, username: "HODLer_01", level: 28, wagers: 750000, avatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=Hodl" },
    { rank: 10, username: "PaperHands", level: 12, wagers: 100000, avatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=Paper" },
];

const Leaderboard: React.FC<LeaderboardProps> = ({ user, onGoHome }) => {
  const topThree = MOCK_LEADERS.slice(0, 3);
  const restList = MOCK_LEADERS.slice(3);

  return (
    <div className="w-full animate-fade-in p-6 max-w-6xl mx-auto">
        {/* Navigation */}
        <button onClick={onGoHome} className="mb-6 text-gray-500 hover:text-white flex items-center gap-1 text-sm font-bold transition-colors">
            <ChevronRight className="rotate-180" size={16}/> Back to Home
        </button>

        <div className="text-center mb-12">
            <h1 className="text-4xl font-black italic tracking-tighter text-white flex items-center justify-center gap-3 mb-2">
                <Trophy className="text-[#F59E0B] fill-[#F59E0B]" size={32} />
                LEADERBOARD
            </h1>
            <p className="text-gray-400 font-medium">Top players by total wagered amount this week</p>
        </div>

        {/* Podium Section */}
        <div className="flex flex-col md:flex-row items-end justify-center gap-4 md:gap-8 mb-16 px-4">
            
            {/* 2nd Place */}
            <div className="order-2 md:order-1 w-full md:w-1/3 max-w-[280px] flex flex-col items-center">
                <div className="relative mb-4 group">
                    <div className="w-24 h-24 rounded-full border-4 border-gray-300 shadow-[0_0_30px_rgba(209,213,219,0.3)] overflow-hidden bg-[#151B25] relative z-10">
                        <img src={topThree[1].avatar} alt="" className="w-full h-full object-cover" />
                    </div>
                    <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-gray-300 text-black font-black text-sm px-3 py-1 rounded-lg border-2 border-[#151B25] z-20 flex items-center gap-1">
                        2ND
                    </div>
                </div>
                <div className="w-full bg-[#151B25]/80 border-t-4 border-gray-300 rounded-t-2xl p-6 text-center backdrop-blur-md h-[180px] flex flex-col justify-end">
                    <div className="text-xl font-black text-white mb-1">{topThree[1].username}</div>
                    <div className="text-xs font-bold text-gray-400 mb-3">Level {topThree[1].level}</div>
                    <div className="bg-[#0B0E14] rounded-lg py-2 px-3 border border-gray-300/20">
                        <div className="text-[10px] text-gray-500 uppercase font-bold">Wagered</div>
                        <div className="text-gray-300 font-mono font-bold flex items-center justify-center gap-1">
                            <Moon size={12} fill="currentColor" />
                            {topThree[1].wagers.toLocaleString()}
                        </div>
                    </div>
                </div>
            </div>

            {/* 1st Place */}
            <div className="order-1 md:order-2 w-full md:w-1/3 max-w-[320px] flex flex-col items-center -mt-12 z-10">
                <div className="relative mb-6 group animate-float">
                    <Crown className="absolute -top-10 left-1/2 -translate-x-1/2 text-[#F59E0B] fill-[#F59E0B] w-12 h-12 drop-shadow-[0_0_15px_rgba(245,158,11,0.6)] animate-bounce-short" />
                    <div className="w-32 h-32 rounded-full border-4 border-[#F59E0B] shadow-[0_0_50px_rgba(245,158,11,0.5)] overflow-hidden bg-[#151B25] relative z-10">
                        <img src={topThree[0].avatar} alt="" className="w-full h-full object-cover" />
                    </div>
                    <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-[#F59E0B] to-yellow-300 text-black font-black text-lg px-6 py-1 rounded-xl border-4 border-[#151B25] z-20 shadow-lg">
                        1ST
                    </div>
                </div>
                <div className="w-full bg-gradient-to-b from-[#F59E0B]/20 to-[#151B25]/90 border-t-4 border-[#F59E0B] rounded-t-2xl p-8 text-center backdrop-blur-xl h-[220px] flex flex-col justify-end shadow-[0_-10px_40px_rgba(245,158,11,0.1)]">
                    <div className="text-2xl font-black text-white mb-1">{topThree[0].username}</div>
                    <div className="text-sm font-bold text-[#F59E0B] mb-4">Level {topThree[0].level}</div>
                    <div className="bg-[#0B0E14] rounded-lg py-3 px-4 border border-[#F59E0B]/30 shadow-[0_0_15px_rgba(245,158,11,0.1)]">
                        <div className="text-[10px] text-gray-500 uppercase font-bold">Wagered</div>
                        <div className="text-[#F59E0B] font-mono font-bold text-lg flex items-center justify-center gap-1">
                            <Moon size={14} fill="currentColor" />
                            {topThree[0].wagers.toLocaleString()}
                        </div>
                    </div>
                </div>
            </div>

            {/* 3rd Place */}
            <div className="order-3 md:order-3 w-full md:w-1/3 max-w-[280px] flex flex-col items-center">
                 <div className="relative mb-4 group">
                    <div className="w-24 h-24 rounded-full border-4 border-orange-700 shadow-[0_0_30px_rgba(194,65,12,0.3)] overflow-hidden bg-[#151B25] relative z-10">
                        <img src={topThree[2].avatar} alt="" className="w-full h-full object-cover" />
                    </div>
                    <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-orange-700 text-white font-black text-sm px-3 py-1 rounded-lg border-2 border-[#151B25] z-20 flex items-center gap-1">
                        3RD
                    </div>
                </div>
                <div className="w-full bg-[#151B25]/80 border-t-4 border-orange-700 rounded-t-2xl p-6 text-center backdrop-blur-md h-[160px] flex flex-col justify-end">
                    <div className="text-xl font-black text-white mb-1">{topThree[2].username}</div>
                    <div className="text-xs font-bold text-gray-400 mb-3">Level {topThree[2].level}</div>
                    <div className="bg-[#0B0E14] rounded-lg py-2 px-3 border border-orange-700/20">
                        <div className="text-[10px] text-gray-500 uppercase font-bold">Wagered</div>
                        <div className="text-orange-400 font-mono font-bold flex items-center justify-center gap-1">
                            <Moon size={12} fill="currentColor" />
                            {topThree[2].wagers.toLocaleString()}
                        </div>
                    </div>
                </div>
            </div>
        </div>

        {/* List Section */}
        <div className="bg-[#151B25] border border-[#2A3441] rounded-2xl overflow-hidden shadow-2xl">
            {/* Table Header */}
            <div className="grid grid-cols-12 px-6 py-4 bg-[#0F1219] border-b border-[#2A3441] text-xs font-bold text-gray-500 uppercase">
                <div className="col-span-1 text-center">Rank</div>
                <div className="col-span-6 md:col-span-7 pl-4">Player</div>
                <div className="col-span-5 md:col-span-4 text-right">Total Wagered</div>
            </div>

            {/* Rows */}
            <div className="divide-y divide-[#2A3441]">
                {restList.map((player) => (
                    <div key={player.rank} className="grid grid-cols-12 px-6 py-4 items-center hover:bg-[#1A212D] transition-colors group">
                        <div className="col-span-1 text-center">
                            <span className="font-mono font-bold text-gray-400 group-hover:text-white">#{player.rank}</span>
                        </div>
                        <div className="col-span-6 md:col-span-7 pl-4 flex items-center gap-3">
                            <img src={player.avatar} alt="" className="w-8 h-8 rounded-lg bg-[#0B0E14]" />
                            <div>
                                <div className="text-sm font-bold text-white group-hover:text-blox-accent transition-colors">{player.username}</div>
                                <div className="text-[10px] text-gray-600 font-bold">Level {player.level}</div>
                            </div>
                        </div>
                        <div className="col-span-5 md:col-span-4 text-right">
                             <div className="text-sm font-mono font-bold text-white flex items-center justify-end gap-2">
                                <Moon size={14} className="text-gray-600 group-hover:text-blox-accent transition-colors" fill="currentColor" />
                                {player.wagers.toLocaleString()}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Current User Rank (Sticky Bottom) */}
            {user.isLoggedIn && (
                 <div className="bg-[#0B0E14] border-t-2 border-[#2A3441] px-6 py-4 grid grid-cols-12 items-center">
                    <div className="col-span-1 text-center">
                        <span className="font-mono font-bold text-gray-500">-</span>
                    </div>
                    <div className="col-span-6 md:col-span-7 pl-4 flex items-center gap-3">
                        <img src={user.avatar || `https://api.dicebear.com/9.x/avataaars/svg?seed=${user.username}`} alt="" className="w-8 h-8 rounded-lg bg-[#151B25] border border-blox-accent" />
                        <div>
                            <div className="text-sm font-bold text-blox-accent">You</div>
                            <div className="text-[10px] text-gray-500 font-bold">Level {user.level}</div>
                        </div>
                    </div>
                    <div className="col-span-5 md:col-span-4 text-right">
                         <div className="text-sm font-mono font-bold text-white flex items-center justify-end gap-2">
                            <Moon size={14} className="text-blox-accent" fill="currentColor" />
                            {(user.xp * 5).toLocaleString()} {/* Simulating wager from XP for demo */}
                        </div>
                    </div>
                </div>
            )}
        </div>
    </div>
  );
};

export default Leaderboard;
