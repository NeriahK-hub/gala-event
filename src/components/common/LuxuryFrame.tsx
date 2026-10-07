import React from 'react';

interface LuxuryFrameProps {
  children?: React.ReactNode;
  className?: string;
  showCornersOnly?: boolean;
}

// Conteneur sobre : les ornements d'angle ont été retirés pour alléger la page.
export const LuxuryFrame: React.FC<LuxuryFrameProps> = ({ children, className = '' }) => {
  return <div className={`relative ${className}`}>{children}</div>;
};
