import React, { useState, useRef } from 'react';
import { 
  X, 
  Upload, 
  Camera, 
  Sparkles, 
  Check, 
  Link as LinkIcon 
} from 'lucide-react';

interface AvatarPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentAvatar: string;
  onSaveAvatar: (newAvatarUrl: string) => void;
  userName?: string;
}

// Preset Team Spirit Avatars for Swimmers, Divers, Captains, Coaches
const PRESET_AVATARS = [
  {
    id: 'preset-1',
    label: 'Swimmer with Cap',
    url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=300&auto=format&fit=crop&q=80'
  },
  {
    id: 'preset-2',
    label: 'Sprint Swimmer',
    url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80'
  },
  {
    id: 'preset-3',
    label: 'Varsity Diver',
    url: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=300&auto=format&fit=crop&q=80'
  },
  {
    id: 'preset-4',
    label: 'Freestyle Swimmer',
    url: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=300&auto=format&fit=crop&q=80'
  },
  {
    id: 'preset-5',
    label: 'Team Captain',
    url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&auto=format&fit=crop&q=80'
  },
  {
    id: 'preset-6',
    label: 'Aqua Mustang Athlete',
    url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80'
  },
  {
    id: 'preset-7',
    label: 'Coach & Mentor',
    url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&auto=format&fit=crop&q=80'
  },
  {
    id: 'preset-8',
    label: 'Diving Specialist',
    url: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=300&auto=format&fit=crop&q=80'
  }
];

export const AvatarPickerModal: React.FC<AvatarPickerModalProps> = ({
  isOpen,
  onClose,
  currentAvatar,
  onSaveAvatar,
  userName = 'Athlete'
}) => {
  const [selectedAvatar, setSelectedAvatar] = useState<string>(currentAvatar);
  const [customUrl, setCustomUrl] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  // Handle local photo upload & resize to lightweight avatar
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsProcessing(true);
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_SIZE = 250;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_SIZE) {
            height *= MAX_SIZE / width;
            width = MAX_SIZE;
          }
        } else {
          if (height > MAX_SIZE) {
            width *= MAX_SIZE / height;
            height = MAX_SIZE;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const resizedDataUrl = canvas.toDataURL('image/jpeg', 0.85);
          setSelectedAvatar(resizedDataUrl);
        }
        setIsProcessing(false);
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleApplyCustomUrl = (e: React.FormEvent) => {
    e.preventDefault();
    if (customUrl.trim()) {
      setSelectedAvatar(customUrl.trim());
      setCustomUrl('');
    }
  };

  const handleSave = () => {
    onSaveAvatar(selectedAvatar);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div className="bg-slate-900 border border-emerald-700/60 rounded-3xl max-w-md w-full max-h-[92vh] flex flex-col shadow-2xl text-slate-100 overflow-hidden">
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 bg-[#06241b] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-amber-400 font-bold text-sm">
              <Camera className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-white">Change Profile Photo</h3>
              <p className="text-[11px] text-emerald-300">
                {userName}'s Profile Picture
              </p>
            </div>
          </div>

          <button 
            onClick={onClose}
            className="p-1.5 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
          
          {/* Active Preview */}
          <div className="flex flex-col items-center justify-center py-2 space-y-2">
            <div className="relative">
              <img 
                src={selectedAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'} 
                alt="Avatar preview" 
                className="w-24 h-24 rounded-3xl object-cover border-4 border-amber-400 shadow-xl"
              />
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-emerald-600 rounded-full flex items-center justify-center border-2 border-slate-900 text-white">
                <Check className="w-3.5 h-3.5" />
              </div>
            </div>
            <span className="text-xs text-slate-400 font-medium">Selected Photo Preview</span>
          </div>

          {/* Upload Photo Button */}
          <div className="space-y-2">
            <input 
              type="file" 
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*" 
              className="hidden" 
            />

            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={isProcessing}
              className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 text-white font-extrabold text-xs shadow-lg border border-amber-400/40 flex items-center justify-center gap-2 transition"
            >
              <Upload className="w-4 h-4 text-amber-300" />
              <span>{isProcessing ? 'Processing Photo...' : 'Upload Photo from Camera / Gallery'}</span>
            </button>
          </div>

          {/* Preset Team Spirit Avatars */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Choose a Team Spirit Avatar:
            </label>

            <div className="grid grid-cols-4 gap-2.5">
              {PRESET_AVATARS.map((preset) => (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => setSelectedAvatar(preset.url)}
                  className={`relative rounded-2xl overflow-hidden aspect-square border-2 transition ${
                    selectedAvatar === preset.url 
                      ? 'border-amber-400 ring-2 ring-amber-400/50 scale-105 shadow-md' 
                      : 'border-slate-800 hover:border-emerald-600 opacity-80 hover:opacity-100'
                  }`}
                >
                  <img src={preset.url} alt={preset.label} className="w-full h-full object-cover" />
                  {selectedAvatar === preset.url && (
                    <div className="absolute inset-0 bg-emerald-950/40 flex items-center justify-center">
                      <Check className="w-5 h-5 text-amber-400 drop-shadow" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Paste URL Option */}
          <div className="space-y-1.5 pt-1">
            <label className="text-xs font-bold text-slate-400 flex items-center gap-1">
              <LinkIcon className="w-3 h-3 text-emerald-400" /> Or paste image web URL:
            </label>
            <form onSubmit={handleApplyCustomUrl} className="flex gap-2">
              <input 
                type="url"
                value={customUrl}
                onChange={e => setCustomUrl(e.target.value)}
                placeholder="https://example.com/photo.jpg"
                className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
              />
              <button
                type="submit"
                className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-amber-300 border border-slate-700 transition"
              >
                Apply
              </button>
            </form>
          </div>

        </div>

        {/* Footer */}
        <div className="p-3 sm:p-4 border-t border-slate-800 bg-slate-950 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition"
          >
            Cancel
          </button>

          <button
            onClick={handleSave}
            className="px-6 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-bold shadow-lg transition flex items-center gap-1.5"
          >
            <Check className="w-4 h-4" />
            <span>Save Profile Photo</span>
          </button>
        </div>

      </div>
    </div>
  );
};
