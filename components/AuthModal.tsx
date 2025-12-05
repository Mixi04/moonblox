
import React, { useState } from 'react';
import { UserState, AuthMode } from '../types';
import { Shield, CheckCircle, X, Mail, Lock, User, ArrowRight } from 'lucide-react';

interface AuthModalProps {
  onLogin: (user: Partial<UserState>) => void;
  onClose: () => void;
  initialMode: AuthMode;
}

const AuthModal: React.FC<AuthModalProps> = ({ onLogin, onClose, initialMode }) => {
  const [mode, setMode] = useState<AuthMode>(initialMode);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });

  const handleGoogleLogin = () => {
    setIsLoading(true);
    setTimeout(() => {
      onLogin({
        username: "CryptoKing_99",
        email: "player@gmail.com",
        avatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=Felix",
        isLoggedIn: true,
        balance: 0 
      });
      setIsLoading(false);
    }, 1500);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.username || !formData.password) return;

    setIsLoading(true);
    setTimeout(() => {
      onLogin({
        username: formData.username,
        email: `${formData.username.toLowerCase()}@example.com`,
        avatar: `https://api.dicebear.com/9.x/avataaars/svg?seed=${formData.username}`,
        isLoggedIn: true,
        balance: 0 
      });
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md animate-fade-in p-4">
      <div className="relative w-full max-w-md bg-[#151B25] border border-[#2A3441] rounded-3xl p-8 shadow-2xl overflow-hidden animate-slide-up flex flex-col max-h-[90vh] overflow-y-auto">
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-gray-500 hover:text-white hover:bg-white/10 rounded-full transition-colors z-20"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-tr from-blox-accent to-yellow-600 shadow-lg shadow-yellow-500/20 mb-4">
             <User className="text-black font-bold" />
          </div>
          <h2 className="text-2xl font-black text-white uppercase tracking-wide">
            {mode === 'SIGNUP' ? 'Create Account' : 'Welcome Back'}
          </h2>
          <p className="text-gray-500 text-sm mt-1 font-medium">
            {mode === 'SIGNUP' ? 'Start your winning streak today.' : 'Login to access your wallet.'}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleFormSubmit} className="space-y-4 mb-6">
            <div className="space-y-1">
                <label className="text-xs font-bold text-gray-400 uppercase ml-1">Username</label>
                <div className="relative group">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4 group-focus-within:text-blox-accent transition-colors" />
                    <input 
                        type="text" 
                        placeholder="Enter username"
                        value={formData.username}
                        onChange={(e) => setFormData({...formData, username: e.target.value})}
                        className="w-full bg-[#0B0E14] border border-[#2F2B3E] text-white rounded-xl py-3 pl-10 pr-4 outline-none focus:border-blox-accent focus:ring-1 focus:ring-blox-accent/50 transition-all font-medium text-sm"
                        required
                    />
                </div>
            </div>

            <div className="space-y-1">
                <label className="text-xs font-bold text-gray-400 uppercase ml-1">Password</label>
                <div className="relative group">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4 group-focus-within:text-blox-accent transition-colors" />
                    <input 
                        type="password" 
                        placeholder="Enter password"
                        value={formData.password}
                        onChange={(e) => setFormData({...formData, password: e.target.value})}
                        className="w-full bg-[#0B0E14] border border-[#2F2B3E] text-white rounded-xl py-3 pl-10 pr-4 outline-none focus:border-blox-accent focus:ring-1 focus:ring-blox-accent/50 transition-all font-medium text-sm"
                        required
                    />
                </div>
            </div>

            <button 
                type="submit"
                disabled={isLoading}
                className="w-full bg-blox-accent hover:bg-blox-accentHover text-blox-surface font-black py-3.5 rounded-xl transition-all hover:shadow-lg hover:shadow-yellow-500/20 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed mt-2 flex items-center justify-center gap-2"
            >
                {isLoading ? (
                     <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin"></div>
                ) : (
                    <>
                        {mode === 'SIGNUP' ? 'CREATE ACCOUNT' : 'LOG IN'}
                        <ArrowRight size={16} />
                    </>
                )}
            </button>
        </form>

        {/* Divider */}
        <div className="relative flex items-center justify-center mb-6">
            <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-700"></div>
            </div>
            <span className="relative bg-[#151B25] px-4 text-xs font-bold text-gray-500 uppercase">Or continue with</span>
        </div>

        {/* Google Button */}
        <button 
            onClick={handleGoogleLogin}
            disabled={isLoading}
            className="w-full bg-white hover:bg-gray-100 text-gray-900 font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-3 transition-all mb-6 group"
        >
             <svg className="w-5 h-5 group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            Google
        </button>

        {/* Toggle Mode */}
        <div className="text-center">
            <p className="text-gray-400 text-sm font-medium">
                {mode === 'SIGNUP' ? 'Already have an account?' : 'New to MoonBlox?'}
                <button 
                    onClick={() => setMode(mode === 'SIGNUP' ? 'LOGIN' : 'SIGNUP')}
                    className="ml-2 text-blox-accent hover:text-white font-bold transition-colors"
                >
                    {mode === 'SIGNUP' ? 'Log In' : 'Sign Up'}
                </button>
            </p>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
