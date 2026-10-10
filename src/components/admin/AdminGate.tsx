import React, { useState } from 'react';
import { ArrowLeft, Lock } from 'lucide-react';
import { EmpireLogo } from '../common/EmpireLogo';
import { useTeam } from '../../team/TeamContext';

interface AdminGateProps {
  onBackToHome: () => void;
}

const input =
  'w-full px-4 py-3.5 rounded-xl border border-white/10 bg-black/20 text-center text-lg text-stone-100 placeholder:text-sm placeholder-stone-500 focus:border-[#E6C78A]/60 focus:outline-none focus:ring-2 focus:ring-[#E6C78A]/10';

export const AdminGate: React.FC<AdminGateProps> = ({ onBackToHome }) => {
  const { needsSetup, setupSuper, login } = useTeam();
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (needsSetup) {
      if (code !== confirm) return setError('Les deux codes ne sont pas identiques.');
      const res = setupSuper(name, code);
      if (!res.ok) setError(res.error);
    } else {
      const res = login(code);
      if (!res.ok) {
        setError(res.error);
        setCode('');
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-[#16110F] text-stone-100 relative z-[5]">
      <form onSubmit={submit} className="w-full max-w-sm rounded-2xl border border-white/[0.07] bg-white/[0.025] p-7 text-center">
        <div className="flex justify-center mb-4">
          <EmpireLogo size={56} />
        </div>
        <span className="mx-auto mb-3 w-10 h-10 rounded-full bg-[#E6C78A]/10 text-[#E6C78A] flex items-center justify-center">
          <Lock className="w-5 h-5" />
        </span>
        <h1 className="font-semibold tracking-tight text-xl mb-1">{needsSetup ? 'Configuration initiale' : 'Console équipe'}</h1>
        <p className="text-sm text-stone-400 mb-6">
          {needsSetup
            ? 'Crée le compte super admin (le concepteur du site). Il créera ensuite l\'admin n°1, qui donnera les accès à son équipe.'
            : 'Saisis ton code personnel pour continuer.'}
        </p>

        <div className="space-y-3">
          {needsSetup && (
            <input
              value={name}
              onChange={(e) => { setName(e.target.value); setError(''); }}
              placeholder="Ton nom"
              aria-label="Nom du super admin"
              autoFocus
              className={input}
            />
          )}
          <input
            type="password"
            autoComplete={needsSetup ? 'new-password' : 'current-password'}
            autoFocus={!needsSetup}
            value={code}
            onChange={(e) => { setCode(e.target.value); setError(''); }}
            placeholder={needsSetup ? 'Choisis un code' : 'Ton code d\'accès'}
            aria-label="Code d'accès"
            className={`${input} tracking-[0.3em] placeholder:tracking-normal`}
          />
          {needsSetup && (
            <input
              type="password"
              autoComplete="new-password"
              value={confirm}
              onChange={(e) => { setConfirm(e.target.value); setError(''); }}
              placeholder="Confirme le code"
              aria-label="Confirmer le code"
              className={`${input} tracking-[0.3em] placeholder:tracking-normal`}
            />
          )}
        </div>
        {error && <p role="alert" className="mt-3 text-sm text-red-300">{error}</p>}

        <button
          type="submit"
          className="mt-5 w-full py-3.5 rounded-full bg-[#E6C78A] text-[#2B1B0A] font-bold text-sm hover:bg-[#EFD6A2] cursor-pointer"
        >
          {needsSetup ? 'Créer le super admin' : 'Ouvrir la console'}
        </button>
        {!needsSetup && <p className="mt-3 text-xs text-stone-500">Code oublié ? Demande à l'admin n°1 un lien pour en choisir un nouveau.</p>}
        <button type="button" onClick={onBackToHome} className="mt-3 inline-flex items-center gap-1.5 text-sm text-stone-400 hover:text-white cursor-pointer">
          <ArrowLeft className="w-4 h-4" /> Retour au site
        </button>
      </form>
    </div>
  );
};
