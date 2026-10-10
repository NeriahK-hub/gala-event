import React, { useEffect, useState } from 'react';
import { CheckCircle2, KeyRound, LogIn, ShieldOff } from 'lucide-react';
import { EmpireLogo } from '../common/EmpireLogo';
import { inviteState, ROLE_LABELS, useTeam } from '../../team/TeamContext';
import { consoleUrl } from './TeamPanel';

const LAST_LOGIN_KEY = 'gala-admin-last-login-v1';
const rememberLogin = (login: string) => {
  try {
    localStorage.setItem(LAST_LOGIN_KEY, login);
  } catch {
    // ignore
  }
};

const input =
  'w-full px-4 py-3.5 rounded-xl border border-white/10 bg-black/20 text-center text-lg tracking-[0.3em] text-stone-100 placeholder:tracking-normal placeholder:text-sm placeholder-stone-500 focus:border-[#E6C78A]/60 focus:outline-none focus:ring-2 focus:ring-[#E6C78A]/10';

// Page ouverte par un lien personnel (?invitation=…) : la personne choisit elle-même son code
export const InviteAccept: React.FC<{ token: string; onDone: () => void; onBackToHome: () => void }> = ({ token, onDone, onBackToHome }) => {
  const { findInvite, acceptInvite, previewLogin, accounts, current } = useTeam();
  const invite = findInvite(token);
  const [code, setCode] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  // Identifiant obtenu juste après la création de l'accès (écran « C'est prêt »)
  const [doneLogin, setDoneLogin] = useState<string | null>(null);

  const state = invite ? inviteState(invite) : null;
  const usedLogin = invite?.accountId ? accounts.find((a) => a.id === invite.accountId)?.login ?? '' : '';

  // Déjà connecté avec ce compte et on reclique sur le lien : on va directement dans la console
  const alreadyIn = !doneLogin && state === 'used' && !!current && current.id === invite?.accountId;
  useEffect(() => {
    if (alreadyIn) onDone();
  }, [alreadyIn, onDone]);

  if (doneLogin !== null) {
    return (
      <Shell>
        <span className="mx-auto mb-3 w-12 h-12 rounded-full bg-emerald-500/10 text-emerald-300 flex items-center justify-center">
          <CheckCircle2 className="w-6 h-6" />
        </span>
        <h1 className="text-2xl font-semibold text-stone-50 mb-1">C'est prêt !</h1>
        <p className="text-sm text-stone-400 mb-5">Ce lien ne marchera plus. Pour revenir plus tard, garde ces informations&nbsp;:</p>
        <dl className="text-left rounded-xl border border-white/[0.07] bg-black/20 divide-y divide-white/[0.06] mb-5">
          <div className="px-4 py-3">
            <dt className="text-xs text-stone-500">Adresse de la console</dt>
            <dd className="font-mono text-sm text-stone-100 break-all">{consoleUrl()}</dd>
          </div>
          <div className="px-4 py-3">
            <dt className="text-xs text-stone-500">Ton identifiant</dt>
            <dd className="font-mono text-lg text-stone-50">{doneLogin}</dd>
          </div>
          <div className="px-4 py-3">
            <dt className="text-xs text-stone-500">Ton code</dt>
            <dd className="text-sm text-stone-300">Celui que tu viens de choisir (ne le donne à personne)</dd>
          </div>
        </dl>
        <p className="text-xs text-stone-500 mb-4">Astuce : ajoute l'adresse de la console à tes favoris.</p>
        <button onClick={onDone} className="w-full py-3.5 rounded-full bg-[#E6C78A] text-[#2B1B0A] font-bold text-sm hover:bg-[#EFD6A2] cursor-pointer">
          Ouvrir la console
        </button>
      </Shell>
    );
  }

  if (alreadyIn) return <Shell><p className="text-sm text-stone-400">Ouverture de la console…</p></Shell>;

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
            ? 'Ce lien a déjà servi : il ne marche qu\'une seule fois. Pas de souci, connecte-toi directement avec ton identifiant et ton code.'
            : state === 'expired'
            ? 'Ce lien n\'est valable que 24 heures. Demande un nouveau lien à l\'admin n°1.'
            : 'Ce lien n\'existe pas ou n\'est pas reconnu sur cet appareil. Vérifie que tu as ouvert le lien complet.'}
        </p>
        {state === 'used' && (
          <>
            {usedLogin && (
              <div className="mb-4 rounded-xl border border-white/[0.07] bg-black/20 px-4 py-3">
                <p className="text-xs text-stone-500">Ton identifiant</p>
                <p className="font-mono text-lg text-stone-50">{usedLogin}</p>
              </div>
            )}
            <button
              onClick={() => {
                if (usedLogin) rememberLogin(usedLogin);
                onDone();
              }}
              className="mb-4 w-full inline-flex items-center justify-center gap-2 py-3.5 rounded-full bg-[#E6C78A] text-[#2B1B0A] font-bold text-sm hover:bg-[#EFD6A2] cursor-pointer"
            >
              <LogIn className="w-4 h-4" /> Me connecter
            </button>
          </>
        )}
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
    rememberLogin(loginId);
    setDoneLogin(loginId);
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
