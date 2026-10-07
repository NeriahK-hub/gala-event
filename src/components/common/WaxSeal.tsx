import React from 'react';

interface WaxSealProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  onClick?: () => void;
  interactive?: boolean;
}

export const WaxSeal: React.FC<WaxSealProps> = ({
  size = 'md',
  className = '',
  onClick,
  interactive = true,
}) => {
  const sizeClasses = {
    sm: 'w-10 h-10',
    md: 'w-14 h-14',
    lg: 'w-20 h-20',
  }[size];

  return (
    <div
      onClick={interactive ? onClick : undefined}
      role={interactive && onClick ? 'button' : undefined}
      tabIndex={interactive && onClick ? 0 : undefined}
      className={`relative inline-flex items-center justify-center rounded-full cursor-pointer select-none transition-transform duration-300 hover:scale-105 active:scale-95 shadow-[0_4px_16px_rgba(0,0,0,0.5),0_0_12px_rgba(212,168,87,0.4)] ${sizeClasses} ${className}`}
      title="Sceau de Cire Doré"
    >
      {/* Outer Wavy Wax Edge */}
      <svg
        viewBox="0 0 100 100"
        className="w-full h-full drop-shadow-md"
        style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.4))' }}
      >
        <defs>
          <radialGradient id="waxGoldGradient" cx="40%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#FFF2C6" />
            <stop offset="35%" stopColor="#E5C17D" />
            <stop offset="70%" stopColor="#B38734" />
            <stop offset="100%" stopColor="#7E5616" />
          </radialGradient>
          <linearGradient id="innerBevel" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#000000" stopOpacity="0.4" />
          </linearGradient>
        </defs>

        {/* Realistic Wax Rim with gentle irregularities */}
        <path
          d="M 50,6 
             C 58,5 64,8 72,12 
             C 79,16 85,22 89,29 
             C 94,37 95,45 93,54 
             C 91,63 87,71 80,78 
             C 73,85 64,89 55,91 
             C 45,93 36,91 27,87 
             C 18,83 12,76 8,68 
             C 4,59 4,50 7,41 
             C 10,32 16,24 23,18 
             C 31,11 40,7 50,6 Z"
          fill="url(#waxGoldGradient)"
          stroke="#D4A857"
          strokeWidth="1"
        />

        {/* Concentric inner debossed circle */}
        <circle
          cx="50"
          cy="50"
          r="36"
          fill="#B38734"
          stroke="#7E5616"
          strokeWidth="1.5"
          opacity="0.9"
        />
        <circle
          cx="50"
          cy="50"
          r="34"
          fill="url(#waxGoldGradient)"
        />

        {/* Embossed Laurel Wreath */}
        <g stroke="#7E5616" fill="#B38734" strokeWidth="0.8">
          {/* Left Laurel Leaves */}
          <path d="M 46,68 C 34,64 28,52 30,36 C 31,34 33,35 32,38 C 30,48 35,59 45,64 Z" />
          <circle cx="31" cy="40" r="2.2" />
          <circle cx="30" cy="48" r="2.2" />
          <circle cx="34" cy="56" r="2.2" />
          <circle cx="41" cy="63" r="2.2" />

          {/* Right Laurel Leaves */}
          <path d="M 54,68 C 66,64 72,52 70,36 C 69,34 67,35 68,38 C 70,48 65,59 55,64 Z" />
          <circle cx="69" cy="40" r="2.2" />
          <circle cx="70" cy="48" r="2.2" />
          <circle cx="66" cy="56" r="2.2" />
          <circle cx="59" cy="63" r="2.2" />
        </g>

        {/* Heart / Emblem inside laurel wreath */}
        <path
          d="M 50,56 
             C 50,56 41,49 41,43 
             C 41,39 44,37 47,38 
             C 49,39 50,41 50,41 
             C 50,41 51,39 53,38 
             C 56,37 59,39 59,43 
             C 59,49 50,56 50,56 Z"
          fill="#FFF2C6"
          stroke="#7E5616"
          strokeWidth="0.7"
        />

        {/* Top glossy shine crescent */}
        <path
          d="M 28,26 C 36,18 52,16 68,22 C 60,19 42,20 31,28 Z"
          fill="#FFFFFF"
          opacity="0.45"
        />
      </svg>
    </div>
  );
};
