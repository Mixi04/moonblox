
import React, { useState, useEffect, useRef } from 'react';
import { Bot, User as UserIcon, MessageSquare, CloudRain, Lock, Moon } from 'lucide-react';
import { ChatMessage } from '../types';

interface ChatProps {
    isOpen: boolean;
    onClose: () => void;
    username: string;
    isLoggedIn: boolean;
    onOpenLogin: () => void;
}

const Chat: React.FC<ChatProps> = ({ isOpen, onClose, username, isLoggedIn, onOpenLogin }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: '1', type: 'system', username: 'System', text: 'Welcome to MoonBlox! 🌿', timestamp: new Date(), rank: 'ADMIN' },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [onlineUsers] = useState(516);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = () => {
    if (!inputValue.trim() || !isLoggedIn) return;
    const userMsg: ChatMessage = {
        id: Date.now().toString(), 
        type: 'self', 
        username: username, 
        text: inputValue, 
        timestamp: new Date(), 
        rank: 'USER'
    };
    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
  };

  return (
    <div className="w-full h-full flex flex-col bg-blox-surface border-r border-blox-border z-30">
        {/* Top Info Bar */}
        <div className="p-3 border-b border-blox-border">
            <div className="flex items-center justify-between mb-3">
                 <div className="flex items-center gap-2">
                    <MessageSquare size={16} className="text-gray-400" />
                    <span className="text-xs font-black text-gray-300 uppercase tracking-wide">Global Chat</span>
                </div>
                <div className="bg-emerald-500/10 text-emerald-500 px-2 py-1 rounded text-xs font-bold flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    {onlineUsers}
                </div>
            </div>
            
            <button className="w-full bg-[#4F46E5] hover:bg-[#4338CA] text-white py-2 rounded-lg font-bold text-xs flex items-center justify-between px-3 transition-colors shadow-lg shadow-indigo-900/20 group">
                <div className="flex items-center gap-2">
                    <CloudRain size={14} className="group-hover:animate-bounce-short" />
                    TIP RAIN
                </div>
                <div className="flex items-center gap-1 bg-black/20 px-2 py-0.5 rounded text-yellow-400">
                    <Moon size={10} fill="currentColor" />
                    3,241
                </div>
            </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-3 space-y-3 scrollbar-hide bg-[#15131D]" ref={scrollRef}>
             {messages.map(msg => (
                 <div key={msg.id} className="group flex items-start gap-3 animate-fade-in hover:bg-white/5 p-1 rounded-lg transition-colors cursor-pointer">
                    <div className="relative">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold border border-white/5 overflow-hidden ${msg.type === 'bot' ? 'bg-indigo-600' : 'bg-[#2A2737]'}`}>
                            {msg.type === 'bot' ? <Bot size={16} /> : <UserIcon size={16} className="text-gray-500" />}
                        </div>
                         {msg.rank === 'VIP' && <div className="absolute -bottom-1 -right-1 bg-blox-accent text-black text-[8px] font-bold px-1 rounded-sm border border-blox-surface">VIP</div>}
                         {msg.rank === 'MOD' && <div className="absolute -bottom-1 -right-1 bg-green-500 text-black text-[8px] font-bold px-1 rounded-sm border border-blox-surface">MOD</div>}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                        <div className="flex items-baseline gap-2">
                            <span className={`text-xs font-bold truncate ${msg.rank === 'VIP' ? 'text-blox-accent' : msg.rank === 'MOD' ? 'text-green-400' : 'text-gray-400'}`}>
                                {msg.username}
                            </span>
                            <span className="text-[10px] text-gray-600">{msg.timestamp.toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'})}</span>
                        </div>
                        <p className="text-xs text-gray-300 leading-relaxed break-words font-medium">
                            {msg.text}
                        </p>
                    </div>
                 </div>
             ))}
        </div>

        {/* Input Area */}
        <div className="p-3 bg-blox-surface border-t border-blox-border">
            {isLoggedIn ? (
                <>
                    <div className="flex gap-2">
                        <input 
                            className="flex-1 bg-[#15131D] border border-blox-border rounded-lg px-3 py-2 text-xs font-medium text-white placeholder-gray-600 focus:border-blox-accent focus:ring-1 focus:ring-blox-accent/50 outline-none transition-all"
                            placeholder="Type a message..."
                            value={inputValue}
                            onChange={e => setInputValue(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && handleSend()}
                        />
                        <button 
                            onClick={handleSend}
                            className="bg-emerald-500 hover:bg-emerald-600 text-white px-3 rounded-lg font-bold text-xs transition-colors shadow-lg shadow-emerald-900/20"
                        >
                            SEND
                        </button>
                    </div>
                    <div className="flex justify-between mt-2 px-1">
                        <div className="flex gap-2">
                            <button className="text-[10px] bg-blue-500/10 text-blue-400 px-2 py-1 rounded font-bold hover:bg-blue-500/20 transition-colors">TWITTER</button>
                            <a 
                                href="https://discord.gg/k99RTxnE" 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-[10px] bg-indigo-500/10 text-indigo-400 px-2 py-1 rounded font-bold hover:bg-indigo-500/20 transition-colors"
                            >
                                DISCORD
                            </a>
                        </div>
                    </div>
                </>
            ) : (
                <div className="flex flex-col gap-2">
                    <button 
                        onClick={onOpenLogin}
                        className="w-full bg-[#15131D] border border-blox-border hover:border-blox-accent text-gray-400 hover:text-white py-3 rounded-lg font-bold text-xs flex items-center justify-center gap-2 transition-all group"
                    >
                        <Lock size={14} className="text-gray-500 group-hover:text-blox-accent" />
                        LOG IN TO CHAT
                    </button>
                     <div className="flex justify-between mt-1 px-1 opacity-50 pointer-events-none">
                        <div className="flex gap-2">
                            <span className="text-[10px] bg-blue-500/10 text-blue-400 px-2 py-1 rounded font-bold">TWITTER</span>
                            <span className="text-[10px] bg-indigo-500/10 text-indigo-400 px-2 py-1 rounded font-bold">DISCORD</span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    </div>
  );
};

export default Chat;
