import React from 'react';

interface AquaMustangsLogoProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  className?: string;
}

export const AquaMustangsLogo: React.FC<AquaMustangsLogoProps> = ({ 
  size = 'md', 
  showText = false,
  className = '' 
}) => {
  const sizeMap = {
    xs: 'w-6 h-6',
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-16 h-16',
    xl: 'w-24 h-24'
  };

  return (
    <div className={`inline-flex items-center gap-2.5 ${className}`}>
      {/* Minimal Vector Icon */}
      <div className={`${sizeMap[size]} flex-shrink-0 relative flex items-center justify-center`}>
        <svg 
          viewBox="0 0 120 120" 
          className="w-full h-full drop-shadow-sm"
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Subtle Rounded Background */}
          <rect width="120" height="120" rx="28" fill="#06241b" stroke="#0F513D" strokeWidth="2" />
          
          {/* Wave Base Curl with Gold Accent */}
          {/* Inner Gold Curl */}
          <path 
            d="M 52 82 C 60 76 68 70 76 70 C 82 70 86 74 84 80 C 80 86 70 88 56 86 C 64 82 72 78 76 74" 
            stroke="#F59E0B" 
            strokeWidth="3.5" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          />

          {/* Main Aquatic Wave Stroke */}
          <path 
            d="M 28 82 C 40 82 52 94 68 94 C 84 94 94 82 92 70 C 90 58 76 56 68 62 C 60 68 62 80 72 82 C 80 84 86 78 86 72" 
            stroke="#10B981" 
            strokeWidth="5" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
          />

          {/* Minimal Mustang Head Contour */}
          {/* Neck curve to crest */}
          <path 
            d="M 46 76 C 48 64 56 52 64 42 C 72 32 78 36 86 52" 
            stroke="#10B981" 
            strokeWidth="5" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
          />

          {/* Ears & Mane */}
          <path 
            d="M 46 34 L 48 24 L 54 30 L 58 24 L 62 34 L 72 38 L 68 44 L 80 48 L 74 56 L 88 60" 
            stroke="#10B981" 
            strokeWidth="4" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
          />

          {/* Forehead, Snout and Jaw */}
          <path 
            d="M 48 30 C 44 34 38 40 32 46 L 28 58 C 30 62 36 62 40 58 L 44 54 C 48 58 48 68 46 76" 
            stroke="#10B981" 
            strokeWidth="5" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
          />

          {/* Athletic Eye slit */}
          <path 
            d="M 44 42 L 50 45" 
            stroke="#34D399" 
            strokeWidth="3.5" 
            strokeLinecap="round" 
          />
        </svg>
      </div>

      {/* Typography */}
      {showText && (
        <div className="flex flex-col">
          <span className="font-black tracking-tight text-white leading-tight text-sm sm:text-base">
            Aqua Mustangs
          </span>
          <span className="text-[10px] text-amber-400 font-bold tracking-wider uppercase">
            Mounds View HS
          </span>
        </div>
      )}
    </div>
  );
};
