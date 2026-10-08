import React, { useState } from 'react';
import { ArrowLeft, Lock } from 'lucide-react';
import { EmpireLogo } from '../common/EmpireLogo';
import { checkAdminCode, hasAdminCode, setAdminCode } from '../../lib/adminLock';

interface AdminGateProps {
  onUnlock: () => void;
  onBackToHome: () => void;
}

const input =
  'w-full px-4 py-3.5 rounded-xl border border-white/15 bg-black/30 text-center text-lg tracking-[0.3em] text-[#F9F5EC] placeholder:tracking-normal placeholder:text-sm placeholder-stone-500 focus:border-[#E8C98A] focus:outline-none focus:ring-2 focus:ring-[#E8C98A]/20';

export const AdminGate: React.FC<AdminGateProps> = ({ onUnlock, onBackToHome }) => {
  const creating = !hasAdminCode();
  const [code, setCode] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (creating) {
      if (code.length < 4) return setError('Choisis un code d\'au moins 4 caractères.');
      if (code !== confirm) return setError('Les deux codes ne sont pas identiques.');
      setAdminCode(code);
      onUnlock();
    } else if (checkAdminCode(code)) {
      onUnlock();
    } else {
      setError('Code incorrect. Réessaie.');
      setCode('');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-[#12070A] text-[#F9F5EC] relative z-[5]">
      <form onSubmit={submit} className="w-full max-w-sm rounded-2xl border border-white/10 bg-white/[0.03] p-7 text-center">
        <div className="flex justify-center mb-4">
          <EmpireLogo size={56} />
        </div>
        <span className="mx-auto mb-3 w-10 h-10 rounded-full bg-[#E8C98A]/15 text-[#E8C98A] flex items-center justify-center">
          <Lock className="w-5 h-5" />
        </span>
        <h1 className="font-serif text-2xl mb-1">{creating ? 'Crée ton code d\'accès' : 'Console équipe'}</h1>
        <p className="text-sm text-stone-400 mb-6">
          {creating
            ? 'Ce code protège la console sur cet appareil. Tu en auras besoin à chaque nouvelle ouverture.'
            : 'Saisis ton code pour continuer.'}
        </p>

        <div className="space-y-3">
          <input
            type="password"
            inputMode="text"
            autoComplete={creating ? 'new-password' : 'current-password'}
            autoFocus
            value={code}
            onChange={(e) => { setCode(e.target.value); setError(''); }}
            placeholder={creating ? 'Nouveau code' : 'Code d\'accès'}
            aria-label="Code d'accès"
            className={input}
          />
          {creating && (
            <input
              type="password"
              autoComplete="new-password"
              value={confirm}
              onChange={(e) => { setConfirm(e.target.value); setError(''); }}
              placeholder="Confirme le code"
              aria-label="Confirmer le code"
              className={input}
            />
          )}
        </div>
        {error && <p role="alert" className="mt-3 text-sm text-red-300">{error}</p>}

        <button
          type="submit"
          className="mt-5 w-full py-3.5 rounded-full bg-gradient-to-b from-[#FFB43A] to-[#F2761B] text-[#3D0A04] font-bold text-sm hover:brightness-110 cursor-pointer"
        >
          {creating ? 'Enregistrer le code' : 'Ouvrir la console'}
        </button>
        <button type="button" onClick={onBackToHome} className="mt-3 inline-flex items-center gap-1.5 text-sm text-stone-400 hover:text-white cursor-pointer">
          <ArrowLeft className="w-4 h-4" /> Retour au site
        </button>
      </form>
    </div>
  );
};
