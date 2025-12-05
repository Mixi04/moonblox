
import React, { useState } from 'react';
import { UserState } from '../types';
import { 
    X, Wallet, ArrowDownCircle, ArrowUpCircle, History, 
    Copy, CheckCircle, ChevronRight, AlertCircle, 
    CreditCard, Smartphone, RefreshCw, Moon 
} from 'lucide-react';

interface WalletModalProps {
  user: UserState;
  onClose: () => void;
  onDeposit: (amount: number) => void;
  onWithdraw: (amount: number) => void;
  initialTab?: 'DEPOSIT' | 'WITHDRAW';
}

type CryptoOption = {
    symbol: string;
    name: string;
    network: string;
    color: string;
    rate: number; // M per 1 unit
    minDeposit: number;
};

const CRYPTO_OPTIONS: CryptoOption[] = [
    { symbol: 'BTC', name: 'Bitcoin', network: 'Bitcoin', color: 'bg-[#F7931A]', rate: 25000000, minDeposit: 0.0005 },
    { symbol: 'ETH', name: 'Ethereum', network: 'ERC-20', color: 'bg-[#627EEA]', rate: 1800000, minDeposit: 0.01 },
    { symbol: 'LTC', name: 'Litecoin', network: 'Litecoin', color: 'bg-[#345D9D]', rate: 85000, minDeposit: 0.1 },
    { symbol: 'USDT', name: 'Tether', network: 'ERC-20', color: 'bg-[#26A17B]', rate: 1000, minDeposit: 5 },
    { symbol: 'DOGE', name: 'Dogecoin', network: 'Dogecoin', color: 'bg-[#C2A633]', rate: 75, minDeposit: 50 },
    { symbol: 'TRX', name: 'Tron', network: 'TRC-20', color: 'bg-[#FF0013]', rate: 80, minDeposit: 50 },
];

const ROBUX_RATE = 0.7; // 1 R$ = 0.7 M (Example rate)

const WalletModal: React.FC<WalletModalProps> = ({ user, onClose, onDeposit, onWithdraw, initialTab = 'DEPOSIT' }) => {
  const [activeTab, setActiveTab] = useState<'DEPOSIT' | 'WITHDRAW' | 'HISTORY'>(initialTab);
  const [selectedCrypto, setSelectedCrypto] = useState<CryptoOption>(CRYPTO_OPTIONS[0]);
  const [depositMethod, setDepositMethod] = useState<'CRYPTO' | 'ROBUX'>('CRYPTO');
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [withdrawAddress, setWithdrawAddress] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
  };

  const handleSimulateDeposit = () => {
    setIsProcessing(true);
    setTimeout(() => {
        onDeposit(depositMethod === 'ROBUX' ? 1000 : 5000);
        setIsProcessing(false);
        onClose();
    }, 2000);
  };

  const handleWithdraw = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseInt(withdrawAmount);
    if (!amount || amount <= 0 || amount > user.balance) return;

    setIsProcessing(true);
    setTimeout(() => {
        onWithdraw(amount);
        setIsProcessing(false);
        onClose();
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-md animate-fade-in p-4">
      <div className="relative w-full max-w-5xl h-[650px] bg-[#0F1219] border border-[#2A3441] rounded-3xl shadow-2xl overflow-hidden animate-slide-up flex flex-col md:flex-row">
        
        {/* Sidebar Navigation */}
        <div className="w-full md:w-64 bg-[#151B25] border-r border-[#2A3441] flex flex-col justify-between">
            <div>
                <div className="p-6 border-b border-[#2A3441]">
                    <div className="flex items-center gap-2 text-white font-black italic text-xl">
                        <Wallet className="text-blox-accent" />
                        <span>Moon<span className="text-blox-accent">Wallet</span></span>
                    </div>
                </div>
                
                <div className="p-4 space-y-2">
                    <button 
                        onClick={() => setActiveTab('DEPOSIT')}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all ${activeTab === 'DEPOSIT' ? 'bg-blox-accent text-black shadow-lg shadow-yellow-500/20' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
                    >
                        <ArrowDownCircle size={18} /> Deposit
                    </button>
                    <button 
                        onClick={() => setActiveTab('WITHDRAW')}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all ${activeTab === 'WITHDRAW' ? 'bg-blox-accent text-black shadow-lg shadow-yellow-500/20' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
                    >
                        <ArrowUpCircle size={18} /> Withdraw
                    </button>
                    <button 
                        onClick={() => setActiveTab('HISTORY')}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all ${activeTab === 'HISTORY' ? 'bg-blox-accent text-black shadow-lg shadow-yellow-500/20' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
                    >
                        <History size={18} /> Transactions
                    </button>
                </div>
            </div>

            <div className="p-4">
                <div className="bg-[#0B0E14] rounded-xl p-4 border border-[#2A3441]">
                    <div className="text-xs font-bold text-gray-500 uppercase mb-1">Total Balance</div>
                    <div className="text-xl font-black text-white flex items-center gap-2">
                        <Moon size={18} className="text-blox-accent fill-blox-accent" />
                        {user.balance.toLocaleString()}
                    </div>
                    <div className="text-[10px] text-gray-600 font-mono mt-1">≈ ${(user.balance * 0.0035).toFixed(2)} USD</div>
                </div>
            </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0 bg-[#0F1219] relative">
            <button 
                onClick={onClose}
                className="absolute top-6 right-6 p-2 text-gray-500 hover:text-white bg-[#151B25] hover:bg-[#2A3441] rounded-full transition-colors z-20"
            >
                <X className="w-5 h-5" />
            </button>

            <div className="flex-1 overflow-y-auto p-6 md:p-10 scrollbar-hide">
                
                {/* DEPOSIT TAB */}
                {activeTab === 'DEPOSIT' && (
                    <div className="animate-fade-in space-y-8">
                        <div>
                            <h2 className="text-2xl font-black text-white mb-2">Deposit Funds</h2>
                            <p className="text-gray-400 text-sm">Select a payment method to add funds to your wallet.</p>
                        </div>

                        {/* Method Toggles */}
                        <div className="flex gap-4 p-1 bg-[#151B25] rounded-xl w-fit border border-[#2A3441]">
                            <button 
                                onClick={() => setDepositMethod('CRYPTO')}
                                className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${depositMethod === 'CRYPTO' ? 'bg-[#2A3441] text-white shadow-sm' : 'text-gray-500 hover:text-gray-300'}`}
                            >
                                Crypto
                            </button>
                            <button 
                                onClick={() => setDepositMethod('ROBUX')}
                                className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${depositMethod === 'ROBUX' ? 'bg-[#2A3441] text-white shadow-sm' : 'text-gray-500 hover:text-gray-300'}`}
                            >
                                Robux
                            </button>
                        </div>

                        {depositMethod === 'CRYPTO' ? (
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                {/* Coin Selection */}
                                <div className="space-y-4">
                                    <label className="text-xs font-bold text-gray-500 uppercase">Select Cryptocurrency</label>
                                    <div className="grid grid-cols-2 gap-3">
                                        {CRYPTO_OPTIONS.map(coin => (
                                            <button 
                                                key={coin.symbol}
                                                onClick={() => setSelectedCrypto(coin)}
                                                className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${selectedCrypto.symbol === coin.symbol ? 'border-blox-accent bg-blox-accent/10' : 'border-[#2A3441] bg-[#151B25] hover:border-gray-600'}`}
                                            >
                                                <div className={`w-8 h-8 rounded-full ${coin.color} flex items-center justify-center text-white font-bold text-[10px]`}>
                                                    {coin.symbol[0]}
                                                </div>
                                                <div className="text-left">
                                                    <div className="text-xs font-bold text-white">{coin.name}</div>
                                                    <div className="text-[10px] text-gray-500">{coin.network}</div>
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* QR & Address */}
                                <div className="bg-[#151B25] rounded-2xl p-6 border border-[#2A3441] flex flex-col items-center text-center relative overflow-hidden">
                                    <div className={`absolute top-0 left-0 w-full h-1 ${selectedCrypto.color}`}></div>
                                    
                                    <div className="bg-white p-3 rounded-xl mb-6 shadow-xl">
                                         {/* Abstract QR Visual */}
                                        <div className="w-32 h-32 grid grid-cols-6 grid-rows-6 gap-0.5">
                                            {Array.from({length: 36}).map((_, i) => (
                                                <div key={i} className={`rounded-[1px] ${Math.random() > 0.4 ? 'bg-black' : 'bg-transparent'}`}></div>
                                            ))}
                                            {/* Logo overlay */}
                                            <div className="absolute inset-0 flex items-center justify-center">
                                                <div className={`w-8 h-8 rounded-full ${selectedCrypto.color} flex items-center justify-center text-white font-bold text-[10px] ring-4 ring-white`}>
                                                    {selectedCrypto.symbol[0]}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="w-full space-y-2">
                                        <div className="flex justify-between text-xs font-bold text-gray-400">
                                            <span>Deposit Address</span>
                                            <span className="text-blox-accent">{selectedCrypto.network} Network</span>
                                        </div>
                                        <button 
                                            onClick={handleCopy}
                                            className="w-full bg-[#0B0E14] hover:bg-black border border-[#2A3441] rounded-xl p-4 flex items-center justify-between group transition-all"
                                        >
                                            <code className="text-xs text-gray-300 font-mono truncate mr-4">0x71C7656EC7ab88b098defB751B7401B5f6d8976F</code>
                                            {copied ? <CheckCircle size={16} className="text-green-500" /> : <Copy size={16} className="text-gray-500 group-hover:text-white" />}
                                        </button>
                                    </div>

                                    <div className="mt-6 w-full p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg flex items-start gap-3">
                                        <AlertCircle size={16} className="text-blue-400 shrink-0 mt-0.5" />
                                        <div className="text-left">
                                            <div className="text-xs font-bold text-blue-400">Important</div>
                                            <p className="text-[10px] text-blue-300/80 leading-relaxed">
                                                Send only <span className="font-bold text-white">{selectedCrypto.name} ({selectedCrypto.symbol})</span> to this address. 
                                                Sending any other coins may result in permanent loss.
                                            </p>
                                        </div>
                                    </div>

                                    <button 
                                        onClick={handleSimulateDeposit}
                                        disabled={isProcessing}
                                        className="w-full mt-4 py-3 bg-blox-accent text-black font-black text-sm rounded-xl hover:bg-blox-accentHover transition-all flex items-center justify-center gap-2"
                                    >
                                        {isProcessing ? <RefreshCw size={16} className="animate-spin" /> : 'I Have Sent The Funds'}
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 gap-6">
                                {/* Robux Integration */}
                                <div className="bg-[#151B25] p-8 rounded-2xl border border-[#2A3441] flex flex-col items-center text-center">
                                    <div className="w-16 h-16 bg-[#00A2FF]/20 text-[#00A2FF] rounded-2xl flex items-center justify-center mb-4">
                                        <Smartphone size={32} />
                                    </div>
                                    <h3 className="text-lg font-bold text-white mb-2">Roblox Marketplace Integration</h3>
                                    <p className="text-sm text-gray-400 max-w-md mb-6">
                                        Purchase our limited edition Gamepass on Roblox to instantly credit your MoonBlox account.
                                    </p>
                                    
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 w-full mb-6">
                                        {[100, 500, 1000, 2500, 5000, 10000].map(amount => (
                                            <button key={amount} className="group relative bg-[#0B0E14] border border-[#2A3441] hover:border-blox-accent rounded-xl p-4 transition-all">
                                                <div className="text-blox-accent font-black text-lg">{amount.toLocaleString()} M</div>
                                                <div className="text-[10px] text-gray-500 font-bold group-hover:text-white transition-colors">Cost: {Math.floor(amount * 1.43)} R$</div>
                                            </button>
                                        ))}
                                    </div>

                                    <button 
                                        onClick={handleSimulateDeposit}
                                        disabled={isProcessing}
                                        className="px-8 py-3 bg-[#00A2FF] hover:bg-[#008bd9] text-white font-black text-sm rounded-xl transition-all shadow-lg shadow-blue-500/20 flex items-center gap-2"
                                    >
                                        {isProcessing ? <RefreshCw size={16} className="animate-spin" /> : 'Buy Gamepass on Roblox'}
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* WITHDRAW TAB */}
                {activeTab === 'WITHDRAW' && (
                    <div className="animate-fade-in max-w-xl mx-auto space-y-8">
                        <div>
                            <h2 className="text-2xl font-black text-white mb-2">Withdraw Funds</h2>
                            <p className="text-gray-400 text-sm">Cash out your winnings directly to your crypto wallet.</p>
                        </div>

                        <form onSubmit={handleWithdraw} className="space-y-6">
                            
                            {/* Asset Selection */}
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-500 uppercase ml-1">Withdraw Asset</label>
                                <div className="relative">
                                    <select 
                                        className="w-full bg-[#151B25] border border-[#2A3441] text-white rounded-xl py-3 pl-4 pr-10 outline-none focus:border-blox-accent appearance-none cursor-pointer font-bold text-sm"
                                    >
                                        {CRYPTO_OPTIONS.map(c => (
                                            <option key={c.symbol} value={c.symbol}>{c.name} ({c.symbol})</option>
                                        ))}
                                    </select>
                                    <ChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 rotate-90 pointer-events-none" size={16} />
                                </div>
                            </div>

                            {/* Amount Input */}
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-500 uppercase ml-1">Amount</label>
                                <div className="relative group">
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 bg-blox-accent rounded-full w-5 h-5 flex items-center justify-center text-black text-[10px] font-black">M</div>
                                    <input 
                                        type="number" 
                                        value={withdrawAmount}
                                        onChange={(e) => setWithdrawAmount(e.target.value)}
                                        className="w-full bg-[#0B0E14] border border-[#2F2B3E] text-white rounded-xl py-3.5 pl-12 pr-20 outline-none focus:border-blox-accent focus:ring-1 focus:ring-blox-accent/50 transition-all font-mono font-bold text-lg placeholder-gray-700"
                                        placeholder="0.00"
                                    />
                                    <button 
                                        type="button" 
                                        onClick={() => setWithdrawAmount(user.balance.toString())}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-black bg-[#2A3441] hover:bg-white text-gray-400 hover:text-black px-2 py-1 rounded transition-colors"
                                    >
                                        MAX
                                    </button>
                                </div>
                                <div className="flex justify-between text-[10px] font-bold px-1 text-gray-500">
                                    <span>Available: {user.balance.toLocaleString()} M</span>
                                    <span>Min Withdraw: 500 M</span>
                                </div>
                            </div>

                            {/* Address Input */}
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-500 uppercase ml-1">Destination Address</label>
                                <input 
                                    type="text" 
                                    value={withdrawAddress}
                                    onChange={(e) => setWithdrawAddress(e.target.value)}
                                    className="w-full bg-[#0B0E14] border border-[#2F2B3E] text-white rounded-xl py-3.5 px-4 outline-none focus:border-blox-accent focus:ring-1 focus:ring-blox-accent/50 transition-all font-mono text-sm placeholder-gray-700"
                                    placeholder="Paste your address here..."
                                />
                            </div>

                            {/* Summary */}
                            <div className="bg-[#151B25] rounded-xl p-4 space-y-2 border border-[#2A3441]">
                                <div className="flex justify-between text-xs text-gray-400 font-medium">
                                    <span>Network Fee</span>
                                    <span>25.00 M</span>
                                </div>
                                <div className="border-t border-[#2A3441] pt-2 flex justify-between text-sm font-bold text-white">
                                    <span>Total Received</span>
                                    <span>{Math.max(0, (parseInt(withdrawAmount) || 0) - 25).toLocaleString()} M</span>
                                </div>
                            </div>

                             <button 
                                type="submit"
                                disabled={isProcessing || !withdrawAmount}
                                className="w-full py-4 rounded-xl font-black text-sm bg-green-500 text-white hover:bg-green-600 transition-all shadow-lg shadow-green-500/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {isProcessing ? <RefreshCw size={18} className="animate-spin" /> : 'Request Withdrawal'}
                            </button>
                        </form>
                    </div>
                )}

                {/* HISTORY TAB */}
                {activeTab === 'HISTORY' && (
                     <div className="animate-fade-in space-y-6">
                        <div>
                            <h2 className="text-2xl font-black text-white mb-2">Transactions</h2>
                            <p className="text-gray-400 text-sm">View your recent deposit and withdrawal history.</p>
                        </div>

                        <div className="space-y-2">
                            {/* Fake History Data */}
                            {[1,2,3,4].map((i) => (
                                <div key={i} className="bg-[#151B25] border border-[#2A3441] p-4 rounded-xl flex items-center justify-between hover:bg-[#1A212D] transition-colors">
                                    <div className="flex items-center gap-4">
                                        <div className={`p-2 rounded-lg ${i % 2 === 0 ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                                            {i % 2 === 0 ? <ArrowDownCircle size={20} /> : <ArrowUpCircle size={20} />}
                                        </div>
                                        <div>
                                            <div className="text-sm font-bold text-white">{i % 2 === 0 ? 'Deposit' : 'Withdrawal'} - {i % 2 === 0 ? 'Ethereum' : 'Bitcoin'}</div>
                                            <div className="text-xs text-gray-500">{new Date().toLocaleDateString()}</div>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className={`font-mono font-bold text-sm ${i % 2 === 0 ? 'text-green-400' : 'text-white'}`}>
                                            {i % 2 === 0 ? '+' : '-'}{(i * 2500).toLocaleString()} M
                                        </div>
                                        <div className="text-[10px] text-gray-500 uppercase font-bold">Completed</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                     </div>
                )}
            </div>
        </div>
      </div>
    </div>
  );
};

export default WalletModal;
