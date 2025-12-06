
import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Chat from './components/Chat';
import CoinFlip from './components/games/CoinFlip';
import Crash from './components/games/Crash';
import Mines from './components/games/Mines';
import AuthModal from './components/AuthModal';
import SettingsModal from './components/SettingsModal';
import ProfileModal from './components/ProfileModal';
import WalletModal from './components/WalletModal';
import Leaderboard from './components/Leaderboard';
import UserStatsModal from './components/UserStatsModal';
import { UserState, AuthMode, PublicProfile } from './types';
import { supabase } from './supabaseClient';
import { 
    Rocket, Coins, Bomb, ArrowUpCircle, Sword, 
    Castle, Crown, Box, LayoutGrid, ChevronRight 
} from 'lucide-react';

// Level definitions must match ProfileModal.tsx
const LEVEL_SYSTEM = [
  { level: 1, reward: 100, xpRequired: 100 },
  { level: 2, reward: 250, xpRequired: 500 },
  { level: 3, reward: 500, xpRequired: 1500 },
  { level: 4, reward: 1000, xpRequired: 3000 },
  { level: 5, reward: 1500, xpRequired: 5000 },
  { level: 6, reward: 2000, xpRequired: 10000 },
  { level: 7, reward: 3500, xpRequired: 20000 },
  { level: 8, reward: 5000, xpRequired: 50000 },
  { level: 9, reward: 7500, xpRequired: 100000 },
  { level: 10, reward: 15000, xpRequired: 250000 },
];

const CLOUD_IMG_URL = "https://res.cloudinary.com/ddgmnys0o/image/upload/v1764974680/83816441-abca-4572-96f9-4cf14f3a8f09.png";

// Game Cover Images
const COVER_IMAGES = {
    BLACKJACK: "https://res.cloudinary.com/devlfz6tf/image/upload/v1764978071/0a6f6930-eda4-4969-b5df-1243d63d67b9.png",
    MINES: "https://res.cloudinary.com/devlfz6tf/image/upload/v1764978031/d0eed63e-3985-4b14-ac5a-11503b92b728.png",
    COINFLIP: "https://res.cloudinary.com/devlfz6tf/image/upload/v1764978020/ef85ab4d-a03b-4b14-949b-07fcde55ec3d.png",
    CRASH: "https://res.cloudinary.com/devlfz6tf/image/upload/v1764978237/b902a774-3fdb-4f5e-979e-74edc33d7f6e.png",
    CASES: "https://res.cloudinary.com/devlfz6tf/image/upload/v1764980765/bd77977d-260c-48fa-b958-33245b1da923.png"
};

const App: React.FC = () => {
  // Default Initial State - All users start level 0 and 0 balance
  const [user, setUser] = useState<UserState>({
        balance: 0,
        username: 'Guest',
        isLoggedIn: false,
        level: 0,
        xp: 0,
        claimedLevels: [],
        usernameChanged: false,
        totalWagered: 0
  });

  // Client-Side Router State with Safe Initialization
  const [currentPath, setCurrentPath] = useState(() => {
      try {
          const path = window.location.pathname;
          // Robust matching for sub-paths or previews
          if (path.endsWith('/leaderboard')) return '/leaderboard';
          if (path.endsWith('/crash')) return '/crash';
          if (path.endsWith('/coinflip')) return '/coinflip';
          if (path.endsWith('/mines')) return '/mines';
          return '/';
      } catch (e) {
          return '/';
      }
  });
  
  const [isChatOpen, setIsChatOpen] = useState(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);
  const [walletTab, setWalletTab] = useState<'DEPOSIT' | 'WITHDRAW'>('DEPOSIT');
  const [authMode, setAuthMode] = useState<AuthMode>('SIGNUP');
  
  // State for viewing other user's profiles
  const [viewedProfile, setViewedProfile] = useState<PublicProfile | null>(null);

  // Handle Browser Back/Forward safely
  useEffect(() => {
    const handlePopState = () => {
        const path = window.location.pathname;
        if (path.endsWith('/leaderboard')) setCurrentPath('/leaderboard');
        else if (path.endsWith('/crash')) setCurrentPath('/crash');
        else if (path.endsWith('/coinflip')) setCurrentPath('/coinflip');
        else if (path.endsWith('/mines')) setCurrentPath('/mines');
        else setCurrentPath('/');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = (path: string) => {
      // 1. Update React State first (ensures UI changes even if history fails)
      setCurrentPath(path);
      
      // 2. Try to update Browser History
      try {
          window.history.pushState({}, '', path);
      } catch (e) {
          // If in a restrictive iframe/preview, ignore the error
          console.warn("URL update blocked by environment (Navigation visuals maintained)", e);
      }
  };

  // Supabase Auth Listener & Profile Fetcher
  useEffect(() => {
    // 1. Check active session
    supabase.auth.getSession().then(({ data: { session } }) => {
        if (session?.user) {
            fetchUserProfile(session.user.id, session.user.email);
        }
    });

    // 2. Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        if (session?.user) {
            fetchUserProfile(session.user.id, session.user.email);
            setIsAuthModalOpen(false);
        } else {
            // Signed out
            setUser({
                balance: 0,
                username: 'Guest',
                isLoggedIn: false,
                level: 0,
                xp: 0,
                claimedLevels: [],
                usernameChanged: false,
                totalWagered: 0
            });
        }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchUserProfile = async (userId: string, email?: string) => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (data) {
          setUser({
              username: data.username || 'User',
              email: email,
              balance: Number(data.balance) || 0,
              level: data.level || 0,
              xp: Number(data.xp) || 0,
              avatar: data.avatar || undefined,
              claimedLevels: data.claimed_levels || [],
              usernameChanged: data.username_changed || false,
              totalWagered: Number(data.total_wagered) || 0,
              isLoggedIn: true
          });
      }
  };

  const updateBalance = async (amount: number) => {
      if (!user.isLoggedIn) return;

      const newBalance = user.balance + amount;
      
      // Optimistic Update
      setUser(p => ({ ...p, balance: newBalance }));

      // DB Sync
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (authUser) {
          await supabase.from('profiles').update({ balance: newBalance }).eq('id', authUser.id);
      }
  };

  const handleGamePlay = async (wagerAmount: number) => {
      if (!user.isLoggedIn) return;

      // 1 XP per 1 Coin wagered
      const xpGain = Math.floor(wagerAmount); 
      const newXp = (user.xp || 0) + xpGain;
      
      // Update Total Wagered (Accumulate bets)
      const currentWagered = user.totalWagered || 0;
      const newTotalWagered = currentWagered + wagerAmount;

      let newLevel = user.level || 0;
      
      // Check for Level Up
      for (const tier of LEVEL_SYSTEM) {
          if (newXp >= tier.xpRequired && tier.level > newLevel) {
              newLevel = tier.level;
          }
      }
      
      // Optimistic Update
      setUser(p => ({ 
          ...p, 
          xp: newXp, 
          level: newLevel,
          totalWagered: newTotalWagered
      }));

      // DB Sync
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (authUser) {
          await supabase.from('profiles')
            .update({ 
                xp: newXp, 
                level: newLevel,
                total_wagered: newTotalWagered 
            })
            .eq('id', authUser.id);
      }
  };

  const handleLogout = async () => { 
      await supabase.auth.signOut();
      setUser({ 
          balance: 0, 
          username: 'Guest', 
          isLoggedIn: false, 
          level: 0, 
          xp: 0, 
          claimedLevels: [],
          usernameChanged: false,
          totalWagered: 0
      }); 
      navigate('/'); 
  };

  const handleUpdateProfile = (updates: Partial<UserState>) => {
    // Optimistic
    setUser(prev => ({ ...prev, ...updates }));
    // DB sync handled inside SettingsModal for now, or we can refresh here.
  };

  const handleClaimReward = async (level: number, reward: number) => {
    if (!user.isLoggedIn || user.claimedLevels.includes(level)) return;
    if (user.level < level) return; 

    const newBalance = user.balance + reward;
    const newClaimed = [...user.claimedLevels, level];

    // Optimistic
    setUser(prev => ({
        ...prev,
        balance: newBalance,
        claimedLevels: newClaimed
    }));

    // DB Sync
    const { data: { user: authUser } } = await supabase.auth.getUser();
    if (authUser) {
        await supabase.from('profiles').update({
            balance: newBalance,
            claimed_levels: newClaimed
        }).eq('id', authUser.id);
    }
  };

  const handleOpenLogin = () => {
      setAuthMode('LOGIN');
      setIsAuthModalOpen(true);
  };

  const handleOpenSignup = () => {
      setAuthMode('SIGNUP');
      setIsAuthModalOpen(true);
  };

  const handleOpenWallet = (tab: 'DEPOSIT' | 'WITHDRAW') => {
      if (!user.isLoggedIn) {
          handleOpenLogin();
          return;
      }
      setWalletTab(tab);
      setIsWalletModalOpen(true);
  };

  // --- Profile Viewing & Tipping ---
  const handleViewUser = async (userId: string) => {
      if (!userId) return;
      
      const { data, error } = await supabase
        .from('profiles')
        .select('id, username, avatar, level, total_wagered, updated_at') // updated_at as proxy for created_at
        .eq('id', userId)
        .single();
    
      if (data) {
          setViewedProfile({
              id: data.id,
              username: data.username,
              avatar: data.avatar,
              level: data.level,
              totalWagered: data.total_wagered,
              createdAt: data.updated_at // In a real app, you'd add a created_at column
          });
      }
  };

  const handleSendTip = async (amount: number) => {
      if (!viewedProfile || !user.isLoggedIn) return;
      
      // Call the secure RPC function
      const { error } = await supabase.rpc('transfer_mooncoins', {
          receiver_id: viewedProfile.id,
          amount: amount
      });

      if (error) {
          throw error;
      }

      // Optimistic update of own balance
      updateBalance(-amount);
  };

  // --- Components ---

  const GameCardLarge = ({ title, color, icon: Icon, image, onClick, coverImage }: any) => (
      <div 
        onClick={onClick}
        className="relative h-48 rounded-2xl overflow-hidden cursor-pointer group border border-blox-border/50 hover:border-blox-accent transition-all duration-300 bg-blox-surface/40 backdrop-blur-xl shadow-lg hover:shadow-2xl hover:shadow-blox-accent/10 hover:-translate-y-1"
      >
         {/* Gloss Overlay */}
         <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10 pointer-events-none"></div>

         {/* Background Cover Image */}
         {coverImage ? (
            <div 
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110 opacity-90"
                style={{ backgroundImage: `url(${coverImage})` }}
            >
                 <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent"></div>
            </div>
         ) : (
            <>
                <div className={`absolute inset-0 opacity-10 ${color} group-hover:opacity-20 transition-opacity`}></div>
                <div className="absolute inset-0 flex items-center justify-center opacity-30 group-hover:scale-105 transition-transform duration-500">
                    {image ? image : <Icon size={80} />}
                </div>
            </>
         )}
         
         <div className="absolute top-4 left-4 z-20 flex items-center gap-2">
             <div className="bg-black/30 p-2 rounded-lg backdrop-blur-sm">
                <Icon size={18} className="text-white" />
             </div>
             <span className="font-black text-lg text-white uppercase tracking-wider drop-shadow-md">{title}</span>
         </div>
         
         <div className="absolute bottom-4 right-4 z-20 opacity-0 group-hover:opacity-100 transition-opacity translate-y-2 group-hover:translate-y-0">
             <div className="bg-blox-accent text-black text-xs font-bold px-4 py-2 rounded-full shadow-lg">PLAY NOW</div>
         </div>
      </div>
  );

  const GameCardSmall = ({ title, icon: Icon, color, isNew, onClick, balance, coverImage }: any) => (
      <div 
        onClick={onClick}
        className="relative w-full aspect-[3/2] rounded-2xl p-4 overflow-hidden group cursor-pointer border border-blox-border/50 hover:border-blox-accent transition-all shadow-lg hover:shadow-xl hover:shadow-blox-accent/10 hover:-translate-y-1 bg-blox-surface/40 backdrop-blur-xl flex flex-col justify-between"
      >
          {/* Gloss Overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10 pointer-events-none"></div>

          {/* Background Image if available */}
          {coverImage && (
              <div 
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110 opacity-80"
                style={{ backgroundImage: `url(${coverImage})` }}
              >
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent"></div>
              </div>
          )}

          {!coverImage && (
             <div className={`absolute -right-6 -bottom-6 w-24 h-24 rounded-full ${color} opacity-10 group-hover:opacity-20 blur-xl transition-opacity`}></div>
          )}
          
          <div className="relative z-20 flex justify-between items-start w-full">
              <div className="flex items-center gap-2">
                <div className="bg-black/40 backdrop-blur-md p-2 rounded-lg border border-white/10 group-hover:bg-white/10 transition-colors">
                    <Icon size={20} className="text-gray-200 group-hover:text-white transition-colors" />
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                  {balance && (
                    <div className="bg-black/60 backdrop-blur-md px-2 py-1 rounded-lg border border-white/10 flex items-center gap-1">
                        <div className="w-3 h-3 rounded-full bg-yellow-500 flex items-center justify-center text-[8px] text-black font-bold">M</div>
                        <span className="text-[10px] font-mono font-bold text-yellow-500">{balance}</span>
                    </div>
                  )}
                  {isNew && <span className="bg-[#F59E0B] text-black text-[10px] font-black px-2 py-0.5 rounded shadow-lg animate-pulse">NEW</span>}
              </div>
          </div>

          <div className="relative z-20 mt-auto">
             <span className="font-black text-white text-2xl uppercase drop-shadow-md tracking-wide block leading-none">{title}</span>
          </div>

          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-30 bg-black/20 backdrop-blur-[2px]">
             <span className="text-blox-accent font-black text-sm uppercase tracking-widest drop-shadow-lg bg-black/80 px-6 py-3 rounded-full border border-blox-accent/50 shadow-2xl transform scale-90 group-hover:scale-100 transition-transform">Play</span>
          </div>
      </div>
  );

  const Home = () => (
      <div className="p-6 max-w-[1600px] mx-auto animate-fade-in pb-20 relative z-10">
          
          <div className="flex items-center justify-center mb-10">
               <div className="bg-blox-surface/60 backdrop-blur-2xl border border-white/10 px-10 py-3 rounded-2xl shadow-2xl relative group overflow-hidden hover:scale-105 transition-transform duration-500">
                   <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000"></div>
                   <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-blox-surface/80 border border-blox-border rounded-full p-2 shadow-lg">
                       <Crown size={20} className="text-[#F59E0B] fill-[#F59E0B] drop-shadow-md" />
                   </div>
                   <h2 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#F59E0B] to-yellow-300 tracking-[0.2em] uppercase mt-2">MoonBlox Originals</h2>
               </div>
          </div>

          {/* Featured Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <GameCardLarge 
                title="Cases" 
                color="bg-blue-600" 
                icon={Box} 
                coverImage={COVER_IMAGES.CASES}
                onClick={() => {}} 
              />
              <GameCardLarge 
                title="Case Battles" 
                color="bg-red-600" 
                icon={Sword} 
                image={
                    <div className="flex gap-4 items-center">
                         <div className="w-20 h-20 bg-red-500/80 rounded-lg transform -rotate-6 border border-white/20 backdrop-blur-sm shadow-xl"></div>
                         <div className="text-4xl font-black italic text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]">VS</div>
                         <div className="w-20 h-20 bg-blue-500/80 rounded-lg transform rotate-6 border border-white/20 backdrop-blur-sm shadow-xl"></div>
                    </div>
                }
                onClick={() => {}} 
              />
              <GameCardLarge 
                title="Towers" 
                color="bg-yellow-600" 
                icon={Castle} 
                image={
                    <div className="flex flex-col gap-1 items-center">
                        <div className="w-16 h-8 bg-yellow-500/40 rounded-md backdrop-blur-sm"></div>
                        <div className="w-20 h-8 bg-yellow-500/60 rounded-md backdrop-blur-sm"></div>
                        <div className="w-24 h-8 bg-yellow-500/80 rounded-md shadow-lg border-t border-white/20 backdrop-blur-sm"></div>
                    </div>
                }
                onClick={() => {}} 
              />
          </div>

          {/* Secondary Grid (4:3 Aspect Ratio Cards) */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-6">
               <GameCardSmall 
                    title="Crash" 
                    icon={Rocket} 
                    color="bg-red-500" 
                    balance="200k"
                    coverImage={COVER_IMAGES.CRASH}
                    onClick={() => navigate('/crash')} 
               />
               <GameCardSmall 
                    title="Blackjack" 
                    icon={LayoutGrid} 
                    color="bg-indigo-500" 
                    coverImage={COVER_IMAGES.BLACKJACK}
                    onClick={() => {}} 
               />
               <GameCardSmall 
                    title="Coinflip" 
                    icon={Coins} 
                    color="bg-yellow-500" 
                    isNew 
                    coverImage={COVER_IMAGES.COINFLIP}
                    onClick={() => navigate('/coinflip')} 
               />
               <GameCardSmall 
                    title="Mines" 
                    icon={Bomb} 
                    color="bg-emerald-500" 
                    coverImage={COVER_IMAGES.MINES}
                    onClick={() => navigate('/mines')} 
               />
          </div>
      </div>
  );

  const renderContent = () => {
      // Robust switch that defaults to Home for any unknown path
      switch (currentPath) {
          case '/leaderboard':
              return <Leaderboard user={user} onGoHome={() => navigate('/')} />;
          case '/crash':
              return (
                <div className="p-6 max-w-7xl mx-auto">
                    <button onClick={() => navigate('/')} className="mb-4 text-gray-500 hover:text-white flex items-center gap-1 text-sm font-bold transition-colors">
                        <ChevronRight className="rotate-180" size={16}/> Back to Home
                    </button>
                    <Crash 
                        balance={user.balance} 
                        updateBalance={updateBalance} 
                        onPlay={handleGamePlay}
                        isLoggedIn={user.isLoggedIn}
                        onOpenLogin={handleOpenLogin}
                    />
                </div>
              );
          case '/coinflip':
              return (
                <div className="p-6 max-w-6xl mx-auto">
                        <button onClick={() => navigate('/')} className="mb-4 text-gray-500 hover:text-white flex items-center gap-1 text-sm font-bold transition-colors">
                        <ChevronRight className="rotate-180" size={16}/> Back to Home
                    </button>
                    <CoinFlip 
                        balance={user.balance} 
                        updateBalance={updateBalance} 
                        onPlay={handleGamePlay}
                        isLoggedIn={user.isLoggedIn}
                        onOpenLogin={handleOpenLogin}
                    />
                </div>
              );
          case '/mines':
              return (
                <div className="p-6 max-w-6xl mx-auto">
                        <button onClick={() => navigate('/')} className="mb-4 text-gray-500 hover:text-white flex items-center gap-1 text-sm font-bold transition-colors">
                        <ChevronRight className="rotate-180" size={16}/> Back to Home
                    </button>
                    <Mines 
                        balance={user.balance} 
                        updateBalance={updateBalance} 
                        onPlay={handleGamePlay}
                        isLoggedIn={user.isLoggedIn}
                        onOpenLogin={handleOpenLogin}
                    />
                </div>
              );
          case '/':
          default:
              return <Home />;
      }
  };

  return (
    <div className="flex h-screen bg-[#020617] text-blox-text font-sans overflow-hidden">
        {/* Mobile Backdrop */}
        {isChatOpen && (
            <div 
                className="lg:hidden fixed inset-0 bg-black/60 z-40 backdrop-blur-md"
                onClick={() => setIsChatOpen(false)}
            ></div>
        )}

        {/* Left Sidebar Chat - Responsive */}
        <div className={`fixed inset-y-0 left-0 z-50 h-full bg-blox-surface/80 backdrop-blur-2xl lg:bg-blox-surface/80 lg:relative lg:block transition-all duration-300 ease-in-out transform border-r border-white/5 shadow-2xl
            ${isChatOpen ? 'translate-x-0 w-[300px]' : '-translate-x-full lg:translate-x-0 lg:w-0 lg:overflow-hidden'}
        `}>
             <Chat 
                isOpen={isChatOpen} 
                onClose={() => setIsChatOpen(false)} 
                username={user.username}
                avatar={user.avatar}
                isLoggedIn={user.isLoggedIn}
                onOpenLogin={handleOpenLogin}
                onUserClick={handleViewUser}
             />
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col min-w-0 h-full relative z-10">
             <Navbar 
                user={user} 
                onLogout={handleLogout} 
                onOpenLogin={handleOpenLogin}
                onOpenSignup={handleOpenSignup}
                onOpenSettings={() => setIsSettingsModalOpen(true)}
                onOpenProfile={() => setIsProfileModalOpen(true)}
                onOpenWallet={handleOpenWallet}
                currentPath={currentPath}
                navigate={navigate}
                isChatOpen={isChatOpen}
                setIsChatOpen={setIsChatOpen}
             />
             
             <main className="flex-1 overflow-y-auto relative scrollbar-hide">
                  
                  {/* Atmospheric Night Background (The Cloud Template) */}
                  <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden bg-[#0a0c14]">
                      {/* Deep Midnight Gradient Base */}
                      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#1e1b4b] via-[#0f172a] to-[#020617]"></div>

                      {/* Stars Layer */}
                      {Array.from({ length: 50 }).map((_, i) => (
                          <div 
                            key={i}
                            className="absolute bg-white rounded-full animate-twinkle"
                            style={{
                                width: Math.random() * 3 + 'px',
                                height: Math.random() * 3 + 'px',
                                top: Math.random() * 100 + '%',
                                left: Math.random() * 100 + '%',
                                animationDelay: Math.random() * 5 + 's',
                                opacity: Math.random()
                            }}
                          ></div>
                      ))}

                      {/* Giant Moon Glow */}
                      <div className="absolute -top-[100px] right-[10%] w-[300px] h-[300px] rounded-full bg-yellow-100/10 blur-[100px] animate-pulse-slow opacity-50"></div>
                      
                      {/* --- CLOUD LAYERS (Using provided image) --- */}
                      
                      {/* Left Side Cloud - Soft & Dreamy */}
                      <img 
                        src={CLOUD_IMG_URL} 
                        alt="" 
                        className="absolute top-1/2 -left-[10%] w-[50%] max-w-[800px] -translate-y-1/2 opacity-[0.20] blur-sm animate-float"
                      />

                      {/* Right Side Cloud - Mirrored */}
                      <img 
                        src={CLOUD_IMG_URL} 
                        alt="" 
                        className="absolute top-1/2 -right-[10%] w-[50%] max-w-[800px] -translate-y-1/2 scale-x-[-1] opacity-[0.20] blur-sm animate-float-delayed"
                      />

                      {/* Top Edge Cloud - Faded */}
                      <img 
                        src={CLOUD_IMG_URL} 
                        alt="" 
                        className="absolute -top-[15%] left-1/2 w-[60%] max-w-[1000px] -translate-x-1/2 opacity-[0.10] blur-md"
                      />

                      {/* Bottom Edge Cloud - Faded */}
                      <img 
                        src={CLOUD_IMG_URL} 
                        alt="" 
                        className="absolute -bottom-[15%] left-1/2 w-[70%] max-w-[1200px] -translate-x-1/2 opacity-[0.10] blur-md"
                      />

                      {/* Foreground Mist Overlay for Seamless Blending */}
                      <div className="absolute bottom-0 w-full h-[200px] bg-gradient-to-t from-[#020617] via-[#020617]/40 to-transparent"></div>
                  </div>
                  
                  <div className="relative z-10 pb-10 min-h-full">
                    {renderContent()}
                  </div>
             </main>
        </div>
        
        {isAuthModalOpen && <AuthModal onLogin={() => {}} onClose={() => setIsAuthModalOpen(false)} initialMode={authMode} />}
        {isSettingsModalOpen && user.isLoggedIn && (
            <SettingsModal 
                user={user} 
                onUpdate={handleUpdateProfile} 
                onClose={() => setIsSettingsModalOpen(false)} 
            />
        )}
        {isProfileModalOpen && user.isLoggedIn && (
            <ProfileModal 
                user={user} 
                onClose={() => setIsProfileModalOpen(false)} 
                onClaimReward={handleClaimReward}
            />
        )}
        {isWalletModalOpen && user.isLoggedIn && (
            <WalletModal
                user={user}
                onClose={() => setIsWalletModalOpen(false)}
                onDeposit={(amount) => updateBalance(amount)}
                onWithdraw={(amount) => updateBalance(-amount)}
                initialTab={walletTab}
            />
        )}
        
        {/* User Stats & Tipping Modal */}
        {viewedProfile && (
            <UserStatsModal 
                profile={viewedProfile}
                currentUser={user}
                onClose={() => setViewedProfile(null)}
                onTip={handleSendTip}
            />
        )}
    </div>
  );
};

export default App;
