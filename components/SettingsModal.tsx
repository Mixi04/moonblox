
import React, { useState, useEffect } from 'react';
import { UserState } from '../types';
import { X, Save, User, Image as ImageIcon } from 'lucide-react';

interface SettingsModalProps {
  user: UserState;
  onUpdate: (updates: Partial<UserState>) => void;
  onClose: () => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ user, onUpdate, onClose }) => {
  const [username, setUsername] = useState(user.username);
  const [avatar, setAvatar] = useState(user.avatar || '');
  const [previewUrl, setPreviewUrl] = useState('');

  useEffect(() => {
    setPreviewUrl(avatar || `https://api.dicebear.com/9.x/avataaars/svg?seed=${username}`);
  }, [avatar, username]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdate({ 
        username, 
        avatar: avatar || undefined 
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md animate-fade-in p-4">
      <div className="relative w-full max-w-md bg-[#151B25] border border-[#2A3441] rounded-3xl p-8 shadow-2xl overflow-hidden animate-slide-up">
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-gray-500 hover:text-white hover:bg-white/10 rounded-full transition-colors z-20"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-2xl font-black text-white uppercase tracking-wide mb-6 flex items-center gap-3">
            <User className="text-blox-accent" />
            Profile Settings
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
            {/* Avatar Preview Section */}
            <div className="flex flex-col items-center justify-center mb-6 gap-3">
                 <div className="relative group">
                    <img 
                        src={previewUrl} 
                        alt="Preview" 
                        className="w-24 h-24 rounded-full bg-blox-background object-cover border-4 border-blox-accent shadow-lg shadow-yellow-500/10" 
                        onError={(e) => { (e.target as HTMLImageElement).src = `https://api.dicebear.com/9.x/avataaars/svg?seed=${username}`; }}
                    />
                    <div className="absolute inset-0 rounded-full border-4 border-blox-accent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
                 </div>
                 <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Preview</span>
            </div>

            {/* Inputs */}
            <div className="space-y-4">
                <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-400 uppercase ml-1">Username</label>
                    <div className="relative group">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4 group-focus-within:text-blox-accent transition-colors" />
                        <input 
                            type="text" 
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full bg-[#0B0E14] border border-[#2F2B3E] text-white rounded-xl py-3 pl-10 pr-4 outline-none focus:border-blox-accent focus:ring-1 focus:ring-blox-accent/50 transition-all font-medium text-sm"
                            maxLength={16}
                        />
                    </div>
                </div>

                <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-400 uppercase ml-1">Avatar Image URL</label>
                    <div className="relative group">
                        <ImageIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4 group-focus-within:text-blox-accent transition-colors" />
                        <input 
                            type="text" 
                            value={avatar}
                            onChange={(e) => setAvatar(e.target.value)}
                            placeholder="https://imgur.com/image.png"
                            className="w-full bg-[#0B0E14] border border-[#2F2B3E] text-white rounded-xl py-3 pl-10 pr-4 outline-none focus:border-blox-accent focus:ring-1 focus:ring-blox-accent/50 transition-all font-medium text-sm"
                        />
                    </div>
                    <p className="text-[10px] text-gray-600 ml-1">Paste a direct link to an image (png, jpg, gif).</p>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-2">
                <button 
                    type="button" 
                    onClick={onClose}
                    className="flex-1 py-3.5 rounded-xl font-bold text-sm bg-blox-surfaceHighlight text-gray-400 hover:text-white hover:bg-[#2A3441] transition-colors"
                >
                    CANCEL
                </button>
                <button 
                    type="submit"
                    className="flex-[2] bg-blox-accent hover:bg-blox-accentHover text-blox-surface font-black py-3.5 rounded-xl transition-all shadow-lg hover:shadow-yellow-500/20 flex items-center justify-center gap-2"
                >
                    <Save size={18} />
                    SAVE CHANGES
                </button>
            </div>
        </form>
      </div>
    </div>
  );
};

export default SettingsModal;
