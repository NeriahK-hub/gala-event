import React from 'react';

// Icône « billet » (public/ticket-icon.png) : prend la couleur du texte (currentColor)
export const TicketIcon: React.FC<{ className?: string }> = ({ className = 'w-6 h-6' }) => (
  <span
    aria-hidden="true"
    className={`inline-block shrink-0 bg-current ${className}`}
    style={{
      WebkitMask: 'url(/ticket-icon.png) center / contain no-repeat',
      mask: 'url(/ticket-icon.png) center / contain no-repeat',
    }}
  />
);
