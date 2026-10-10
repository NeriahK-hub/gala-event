import React, { useState } from 'react';
import { KeyRound, ShieldOff } from 'lucide-react';
import { EmpireLogo } from '../common/EmpireLogo';
import { inviteState, ROLE_LABELS, useTeam } from '../../team/TeamContext';

const input =
  'w-full px-4 py-3.5 rounded-xl border border-white/10 bg-black/20 text-center text-lg tracking-[0.3em] text-stone-100 placeholder:tracking-normal placeholder:text-sm placeholder-stone-500 focus:border-[#E6C78A]/60 focus:outline-none focus:ring-2 focus:ring-[#E6C78A]/10';

// Page ouverte par un lien personnel (?invitation=…) : la personne choisit elle-même son code
export const InviteAccept: React.FC<{ token: string; onDone: () => void; onBackToHome: () => void }> = ({ token, onDone, onBackToHome }) => {
  const { findInvite, acceptInvite, previewLogin, accounts } = useTeam();
  const invite = findInvite(token);
  const [code, setCode] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');

  const state = invite ? inviteState(invite) : null;

  if (!invite || state !== 'pending') {
    return (
      <Shell>
        <span className="mx-auto mb-4 w-12 h-12 rounded-full bg-red-500/10 text-red-300 flex items-center justify-center">
          <ShieldOff className="w-6 h-6" />
        </span>
        <h1 className="text-2xl font-semibold text-stone-50 mb-2">
          {state === 'used' ? 'Lien déjà utilisé' : state === 'expired' ? 'Lien expiré' : 'Lien non reconnu'}
        </h1>
        <p className="text-sm text-stone-400 mb-6">
          {state === 'used'
            ? 'Ce lien a déjà servi : il ne marche qu\'une seule fois. Connecte-toi avec ton code.'
            : state === 'expired'
            ? 'Ce lien n\'est valable que 24 heures. Demande un nouveau lien à l\'admin n°1.'
            : 'Ce lien n\'existe pas ou n\'est pas reconnu sur cet appareil. Vérifie que tu as ouvert le lien complet.'}
        </p>
        <button onClick={onBackToHome} className="text-sm text-stone-400 hover:text-white cursor-pointer">
          Retour au site
        </button>
      </Shell>
    );
  }

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (code !== confirm) return setError('Les deux codes ne sont pas identiques.');
    const res = acceptInvite(token, code);
    if (!res.ok) return setError(res.error);
    try {
      localStorage.setItem('gala-admin-last-login-v1', loginId);
    } catch {
      // ignore
    }
    onDone();
  };

  const isReset = invite.kind === 'reset';
  const loginId = isReset ? accounts.find((a) => a.id === invite.accountId)?.login ?? '' : previewLogin(invite.name);

  return (
    <Shell>
      <form onSubmit={submit}>
        <span className="mx-auto mb-3 w-10 h-10 rounded-full bg-[#E6C78A]/10 text-[#E6C78A] flex items-center justify-center">
          <KeyRound className="w-5 h-5" />
        </span>
        <p className="text-sm text-[#E6C78A]">Bonjour {invite.name.split(' ')[0]},</p>
        <h1 className="text-2xl font-semibold text-stone-50 mb-1">{isReset ? 'Choisis ton nouveau code' : 'Bienvenue dans l\'équipe'}</h1>
        <p className="text-sm text-stone-400 mb-6">
          {isReset
            ? 'Ton ancien code ne marchera plus. Choisis-en un que toi seul connais.'
            : `${invite.createdBy} t'a invité comme « ${ROLE_LABELS[invite.role]} ». Choisis ton code personnel : personne d'autre ne le connaîtra.`}
        </p>
        {loginId && (
          <div className="mb-4 rounded-xl border border-white/[0.07] bg-black/20 px-4 py-3">
            <p className="text-xs text-stone-500">Ton identifiant (à retenir)</p>
            <p className="font-mono text-lg text-stone-50">{loginId}</p>
          </div>
        )}
        <div className="space-y-3">
          <input
            type="password"
            autoFocus
            autoComplete="new-password"
            value={code}
            onChange={(e) => { setCode(e.target.value); setError(''); }}
            placeholder="Ton code (4 caractères minimum)"
            aria-label="Ton code"
            className={input}
          />
          <input
            type="password"
            autoComplete="new-password"
            value={confirm}
            onChange={(e) => { setConfirm(e.target.value); setError(''); }}
            placeholder="Confirme le code"
            aria-label="Confirmer le code"
            className={input}
          />
        </div>
        {error && <p role="alert" className="mt-3 text-sm text-red-300">{error}</p>}
        <button type="submit" className="mt-5 w-full py-3.5 rounded-full bg-[#E6C78A] text-[#2B1B0A] font-bold text-sm hover:bg-[#EFD6A2] cursor-pointer">
          {isReset ? 'Enregistrer mon code' : 'Créer mon accès'}
        </button>
        <p className="mt-4 text-xs text-stone-500">Ce lien est personnel, valable 24 h et ne marche qu'une fois.</p>
      </form>
    </Shell>
  );
};

const Shell: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="min-h-screen flex items-center justify-center px-4 bg-[#16110F] text-stone-200 relative z-[5]">
    <div className="w-full max-w-sm rounded-2xl border border-white/[0.07] bg-white/[0.025] p-7 text-center">
      <div className="flex justify-center mb-4">
        <EmpireLogo size={52} />
      </div>
      {children}
    </div>
  </div>
);
