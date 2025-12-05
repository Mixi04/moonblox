
import React, { useState } from 'react';
import { User, Bell, ChevronDown, Gamepad2, Gift, Home as HomeIcon, LogOut, Wallet, Settings, Trophy, MessageSquare, Menu, Moon, ArrowUpCircle } from 'lucide-react';
import { UserState } from '../types';

interface NavbarProps {
  user: UserState;
  onLogout: () => void;
  onOpenLogin: () => void;
  onOpenSignup: () => void;
  onOpenSettings: () => void;
  onOpenProfile: () => void;
  onOpenWallet: (tab: 'DEPOSIT' | 'WITHDRAW') => void;
  currentPage: string;
  setCurrentPage: (page: string) => void;
  isChatOpen: boolean;
  setIsChatOpen: (isOpen: boolean) => void;
}

const Navbar: React.FC<NavbarProps> = ({ user, onLogout, onOpenLogin, onOpenSignup, onOpenSettings, onOpenProfile, onOpenWallet, setCurrentPage, isChatOpen, setIsChatOpen }) => {
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  return (
    <div className="flex flex-col w-full z-40">
      {/* Navbar Main */}
      <nav className="h-20 bg-blox-surface border-b border-blox-border flex items-center justify-between px-4 lg:px-6 shadow-md relative z-20">
        
        {/* Left Side (Logo & Nav) */}
        <div className="flex items-center gap-4 lg:gap-8">
            {/* Chat Toggle */}
            <button 
              onClick={() => setIsChatOpen(!isChatOpen)}
              className={`p-2 rounded-lg transition-colors ${isChatOpen ? 'bg-blox-accent text-black' : 'text-gray-400 hover:text-white hover:bg-white/10'}`}
              title="Toggle Global Chat"
            >
              <MessageSquare size={20} className={isChatOpen ? "fill-current" : ""} />
            </button>

            {/* Logo */}
            <div 
              className="flex items-center gap-2 cursor-pointer hover:scale-105 transition-transform"
              onClick={() => setCurrentPage('HOME')}
            >
              <div className="text-2xl font-black italic tracking-tighter text-white flex items-center">
                <span>Moon</span>
                <span className="text-blox-accent ml-0.5">Blox</span>
                <span className="ml-2 text-2xl">🌿</span> 
              </div>
            </div>

            {/* Main Nav Buttons */}
            <div className="hidden lg:flex items-center gap-3">
                <button 
                  onClick={() => setCurrentPage('HOME')}
                  className="flex items-center gap-2 px-4 py-2 bg-blox-surfaceHighlight border border-blox-border rounded-lg text-sm font-bold text-gray-300 hover:text-white hover:border-blox-accent transition-all"
                >
                    <HomeIcon size={16} className="text-blox-accent" />
                    HOME
                </button>
                
                <button 
                  className="flex items-center gap-2 px-4 py-2 bg-blox-surfaceHighlight border border-blox-border rounded-lg text-sm font-bold text-gray-300 hover:text-white hover:border-blox-secondary transition-all"
                >
                    <Gamepad2 size={16} className="text-blox-secondary" />
                    GAME SELECTOR
                    <ChevronDown size={14} className="opacity-50" />
                </button>

                 <button 
                  className="flex items-center gap-2 px-4 py-2 bg-[#F59E0B]/20 border border-[#F59E0B]/40 rounded-lg text-sm font-bold text-[#F59E0B] hover:bg-[#F59E0B]/30 transition-all"
                >
                    <Gift size={16} />
                    FAUCET
                </button>

                <a 
                  href="https://discord.gg/k99RTxnE"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 bg-[#5865F2]/20 border border-[#5865F2]/40 rounded-lg text-sm font-bold text-[#5865F2] hover:bg-[#5865F2]/30 transition-all"
                >
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.419-2.1569 2.419zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.419-2.1568 2.419z" />
                    </svg>
                    DISCORD
                </a>
            </div>
        </div>

        {/* Right Side (Auth/Profile) */}
        <div className="flex items-center gap-4">
          {user.isLoggedIn ? (
            <>
               {/* Balance Display */}
              <div 
                className="flex items-center gap-3 bg-blox-background border border-blox-border rounded-lg px-3 py-1.5"
              >
                <div className="w-6 h-6 rounded-full bg-blox-accent flex items-center justify-center text-[10px] font-bold text-black shadow-lg shadow-yellow-500/20">
                    <Moon size={12} fill="currentColor" />
                </div>
                <span className="font-mono font-bold text-[#F59E0B] text-lg">{user.balance.toLocaleString()}</span>
                <button 
                  onClick={() => onOpenWallet('DEPOSIT')}
                  className="w-6 h-6 bg-blox-surfaceHighlight hover:bg-white/10 rounded flex items-center justify-center text-white font-bold text-lg cursor-pointer border border-blox-border transition-colors"
                  title="Deposit"
                >
                    +
                </button>
              </div>

               {/* Profile */}
              <div className="relative">
                  <button 
                    onClick={() => setShowProfileMenu(!showProfileMenu)}
                    className="flex items-center gap-3 hover:bg-blox-surfaceHighlight p-1.5 pr-3 rounded-lg transition-colors group"
                  >
                    <img 
                        src={user.avatar || `https://api.dicebear.com/9.x/avataaars/svg?seed=${user.username}`} 
                        alt="Profile" 
                        className="w-9 h-9 rounded-md bg-blox-background object-cover border border-blox-border group-hover:border-blox-accent transition-colors" 
                    />
                    <div className="hidden md:flex flex-col items-start -space-y-1">
                        <span className="text-xs font-bold text-white max-w-[100px] truncate">{user.username}</span>
                        <span className="text-[10px] text-blox-accent font-bold">Lvl {user.level || 0}</span>
                    </div>
                  </button>
                  
                  {showProfileMenu && (
                      <div className="absolute top-full right-0 mt-2 w-64 bg-blox-surface border border-blox-border rounded-xl shadow-2xl p-2 animate-scale-in z-50">
                          {/* Level Progress Button */}
                          <button 
                            onClick={() => {
                                onOpenProfile();
                                setShowProfileMenu(false);
                            }}
                            className="w-full bg-gradient-to-r from-blox-accent to-yellow-600 rounded-lg p-3 mb-2 text-left relative overflow-hidden group hover:scale-[1.02] transition-transform"
                          >
                             <div className="relative z-10 flex items-center justify-between text-black">
                                 <div>
                                     <div className="text-[10px] font-black uppercase opacity-70">Current Level</div>
                                     <div className="text-lg font-black leading-none">{user.level || 0}</div>
                                 </div>
                                 <div className="text-right">
                                     <div className="text-[10px] font-bold uppercase flex items-center gap-1">Rewards <Trophy size={10} /></div>
                                     <div className="text-xs font-bold">View Progress</div>
                                 </div>
                             </div>
                          </button>

                          {/* Quick Wallet Actions */}
                          <button 
                            onClick={() => {
                                onOpenWallet('WITHDRAW');
                                setShowProfileMenu(false);
                            }}
                            className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-bold text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors mb-1"
                          >
                              <ArrowUpCircle className="w-4 h-4 text-gray-400" />
                              WITHDRAW
                          </button>

                          <button 
                            onClick={() => {
                                onOpenSettings();
                                setShowProfileMenu(false);
                            }}
                            className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-bold text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors mb-1"
                          >
                              <Settings className="w-4 h-4 text-gray-400" />
                              SETTINGS
                          </button>
                          <div className="h-px bg-white/5 my-1" />
                          <button onClick={onLogout} className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-bold text-red-400 hover:bg-red-500/10 rounded-lg transition-colors">
                              <LogOut className="w-4 h-4" />
                              LOGOUT
                          </button>
                      </div>
                  )}
              </div>
            </>
          ) : (
            <div className="flex items-center gap-3">
               <button 
                onClick={onOpenLogin}
                className="hidden md:block text-blox-text font-bold text-xs uppercase tracking-wide hover:text-white px-4 py-2 transition-colors"
               >
                 LOG IN
               </button>
               <button 
                onClick={onOpenSignup}
                className="bg-blox-accent hover:bg-blox-accentHover text-blox-surface font-black text-sm px-6 py-2.5 rounded-lg shadow-lg hover:shadow-yellow-500/20 hover:-translate-y-0.5 transition-all uppercase"
               >
                 Sign Up
               </button>
            </div>
          )}
        </div>
      </nav>
      
      {/* Secondary Nav Bar */}
      <div className="h-12 bg-[#17151F] border-b border-blox-border flex items-center px-6 gap-8 overflow-x-auto scrollbar-hide text-xs font-bold text-gray-500 uppercase tracking-wide relative z-10">
          <a href="#" className="hover:text-blox-accent transition-colors whitespace-nowrap">Redeem</a>
          <a href="#" className="hover:text-blox-accent transition-colors whitespace-nowrap">Affiliates</a>
          <a href="#" className="text-blox-accent transition-colors whitespace-nowrap">Faucet</a>
          <button onClick={() => setCurrentPage('LEADERBOARD')} className="hover:text-blox-accent transition-colors whitespace-nowrap">Leaderboard</button>
          <a href="#" className="hover:text-blox-accent transition-colors whitespace-nowrap">Daily Cases</a>
          <a href="#" className="hover:text-blox-accent transition-colors whitespace-nowrap">FAQ</a>
          <a href="#" className="hover:text-blox-accent transition-colors whitespace-nowrap">Fairness</a>
      </div>
    </div>
  );
};

export default Navbar;
