import React from 'react';

interface LuxuryFrameProps {
  children?: React.ReactNode;
  className?: string;
  showCornersOnly?: boolean;
}

export const LuxuryFrame: React.FC<LuxuryFrameProps> = ({
  children,
  className = '',
  showCornersOnly = false,
}) => {
  return (
    <div className={`relative ${className}`}>
      {/* Decorative Concave Gold Curves inspired by royal invitation cards */}
      {!showCornersOnly && (
        <>
          {/* Top concave scallop */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-5 pointer-events-none z-10 overflow-hidden">
            <svg viewBox="0 0 200 20" className="w-full h-full text-[#D4A857]/40 fill-none stroke-current" strokeWidth="1.5">
              <path d="M 0,0 Q 100,22 200,0" />
              <circle cx="100" cy="11" r="2.5" fill="#D4A857" />
            </svg>
          </div>

          {/* Bottom concave scallop */}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-48 h-5 pointer-events-none z-10 overflow-hidden">
            <svg viewBox="0 0 200 20" className="w-full h-full text-[#D4A857]/40 fill-none stroke-current" strokeWidth="1.5">
              <path d="M 0,20 Q 100,-2 200,20" />
              <circle cx="100" cy="9" r="2.5" fill="#D4A857" />
            </svg>
          </div>

          {/* Left concave scallop */}
          <div className="absolute left-0 top-1/2 -translate-y-1/2 h-48 w-5 pointer-events-none z-10 overflow-hidden hidden md:block">
            <svg viewBox="0 0 20 200" className="w-full h-full text-[#D4A857]/40 fill-none stroke-current" strokeWidth="1.5">
              <path d="M 0,0 Q 22,100 0,200" />
              <circle cx="11" cy="100" r="2.5" fill="#D4A857" />
            </svg>
          </div>

          {/* Right concave scallop */}
          <div className="absolute right-0 top-1/2 -translate-y-1/2 h-48 w-5 pointer-events-none z-10 overflow-hidden hidden md:block">
            <svg viewBox="0 0 20 200" className="w-full h-full text-[#D4A857]/40 fill-none stroke-current" strokeWidth="1.5">
              <path d="M 20,0 Q -2,100 20,200" />
              <circle cx="9" cy="100" r="2.5" fill="#D4A857" />
            </svg>
          </div>
        </>
      )}

      {/* Top Left Corner Filigree */}
      <div className="absolute top-3 left-3 w-10 h-10 pointer-events-none z-10 text-[#D4A857]/60">
        <svg viewBox="0 0 40 40" className="w-full h-full fill-none stroke-current" strokeWidth="1.2">
          <path d="M 0,25 C 0,10 10,0 25,0" />
          <path d="M 5,20 C 5,10 10,5 20,5" strokeWidth="0.8" />
          <circle cx="8" cy="8" r="1.5" fill="#D4A857" />
        </svg>
      </div>

      {/* Top Right Corner Filigree */}
      <div className="absolute top-3 right-3 w-10 h-10 pointer-events-none z-10 text-[#D4A857]/60">
        <svg viewBox="0 0 40 40" className="w-full h-full fill-none stroke-current" strokeWidth="1.2">
          <path d="M 40,25 C 40,10 30,0 15,0" />
          <path d="M 35,20 C 35,10 30,5 20,5" strokeWidth="0.8" />
          <circle cx="32" cy="8" r="1.5" fill="#D4A857" />
        </svg>
      </div>

      {/* Bottom Left Corner Filigree */}
      <div className="absolute bottom-3 left-3 w-10 h-10 pointer-events-none z-10 text-[#D4A857]/60">
        <svg viewBox="0 0 40 40" className="w-full h-full fill-none stroke-current" strokeWidth="1.2">
          <path d="M 0,15 C 0,30 10,40 25,40" />
          <path d="M 5,20 C 5,30 10,35 20,35" strokeWidth="0.8" />
          <circle cx="8" cy="32" r="1.5" fill="#D4A857" />
        </svg>
      </div>

      {/* Bottom Right Corner Filigree */}
      <div className="absolute bottom-3 right-3 w-10 h-10 pointer-events-none z-10 text-[#D4A857]/60">
        <svg viewBox="0 0 40 40" className="w-full h-full fill-none stroke-current" strokeWidth="1.2">
          <path d="M 40,15 C 40,30 30,40 15,40" />
          <path d="M 35,20 C 35,30 30,35 20,35" strokeWidth="0.8" />
          <circle cx="32" cy="32" r="1.5" fill="#D4A857" />
        </svg>
      </div>

      {children}
    </div>
  );
};
