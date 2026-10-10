import React, { createContext, useCallback, useContext, useRef, useState } from 'react';
import { ShieldAlert } from 'lucide-react';
import { useTeam } from '../../team/TeamContext';
import { Modal } from './Modal';

interface AdminAuthValue {
  /** Autorise une suppression : l'admin n°1 passe directement, un membre d'équipe doit saisir le code de l'admin n°1 */
  authorize: (what: string) => Promise<boolean>;
}

const AdminAuthContext = createContext<AdminAuthValue | null>(null);

export const useAdminAuth = (): AdminAuthValue => {
  const ctx = useContext(AdminAuthContext);
  if (!ctx) throw new Error('useAdminAuth doit être utilisé dans <AdminAuthProvider>');
  return ctx;
};

export const AdminAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { current, isManager, verifyApprover } = useTeam();
  const [request, setRequest] = useState<string | null>(null);
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const resolver = useRef<((ok: boolean) => void) | null>(null);

  const authorize = useCallback(
    (what: string) => {
      if (isManager) return Promise.resolve(true);
      return new Promise<boolean>((resolve) => {
        resolver.current = resolve;
        setCode('');
        setError('');
        setRequest(what);
      });
    },
    [isManager]
  );

  const close = (ok: boolean) => {
    resolver.current?.(ok);
    resolver.current = null;
    setRequest(null);
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (verifyApprover(code)) close(true);
    else {
      setError('Code incorrect : seul l\'admin n°1 peut autoriser.');
      setCode('');
    }
  };

  return (
    <AdminAuthContext.Provider value={{ authorize }}>
      {children}
      {request && (
        <Modal onClose={() => close(false)} title="Autorisation requise" kicker="Admin n°1">
          <form onSubmit={submit} className="space-y-4">
            <div className="flex items-start gap-3 rounded-xl bg-amber-500/10 border border-amber-400/30 p-3.5 text-sm text-amber-100">
              <ShieldAlert className="w-5 h-5 shrink-0 mt-0.5" />
              <p>{current?.name ?? 'Tu'}, pour supprimer {request}, l'admin n°1 doit saisir son code.</p>
            </div>
            <input
              type="password"
              autoFocus
              autoComplete="off"
              value={code}
              onChange={(e) => { setCode(e.target.value); setError(''); }}
              placeholder="Code de l'admin n°1"
              aria-label="Code de l'admin n°1"
              className="w-full px-4 py-3 rounded-lg border border-white/15 bg-black/30 text-center tracking-[0.25em] text-[#F9F5EC] placeholder:tracking-normal placeholder:text-sm placeholder-stone-500 focus:border-[#E8C98A] focus:outline-none focus:ring-2 focus:ring-[#E8C98A]/20"
            />
            {error && <p role="alert" className="text-sm text-red-300">{error}</p>}
            <div className="flex gap-3">
              <button type="button" onClick={() => close(false)} className="flex-1 py-3 rounded-full border border-white/20 text-sm text-stone-100 hover:bg-white/10 cursor-pointer">
                Annuler
              </button>
              <button type="submit" className="flex-1 py-3 rounded-full bg-red-500 text-white text-sm font-bold hover:bg-red-400 cursor-pointer">
                Autoriser
              </button>
            </div>
          </form>
        </Modal>
      )}
    </AdminAuthContext.Provider>
  );
};
