import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { ActivityEntry, AdminAccount, AdminPermission, AdminRole, ScanLink } from '../types';

// Équipe (comptes admin, liens de scan, historique).
// Pour l'instant tout est enregistré dans ce navigateur (localStorage).
// Pour brancher la base de données (Supabase) : seul ce fichier change, les écrans gardent la même API (useTeam()).

const STORAGE_KEY = 'gala-team-v1';
const SESSION_KEY = 'gala-admin-session-v1';
const LEGACY_OWNER_KEY = 'gala-admin-code-v1';

export const ALL_PERMISSIONS: { id: AdminPermission; label: string; hint: string }[] = [
  { id: 'orders', label: 'Commandes', hint: 'Voir et ajouter des commandes, envoyer les liens' },
  { id: 'validate', label: 'Valider les paiements', hint: 'Valider ou refuser une commande' },
  { id: 'scanner', label: 'Contrôle d\'entrée', hint: 'Scanner les billets depuis la console' },
  { id: 'content', label: 'Contenu du site', hint: 'Modifier les textes, images, programme…' },
  { id: 'settings', label: 'Réglages du site', hint: 'Ouvrir/fermer les ventes, sections, compte à rebours, sauvegardes' },
];

export const ROLE_LABELS: Record<AdminRole, string> = {
  super: 'Super admin',
  owner: 'Admin n°1',
  admin: 'Admin',
};

// Petit hachage (cyrb53) : fonctionne aussi en http, où crypto.subtle n'existe pas.
// Ce n'est pas une sécurité serveur : la vraie protection viendra avec la base de données.
export const hashCode = (text: string): string => {
  let h1 = 0xdeadbeef;
  let h2 = 0x41c6ce57;
  const input = `empire-gala|${text}`;
  for (let i = 0; i < input.length; i++) {
    const ch = input.charCodeAt(i);
    h1 = Math.imul(h1 ^ ch, 2654435761);
    h2 = Math.imul(h2 ^ ch, 1597334677);
  }
  h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
  h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);
  return (4294967296 * (2097151 & h2) + (h1 >>> 0)).toString(36);
};

const uid = (prefix: string) => `${prefix}-${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;
const randomToken = () => {
  const bytes = new Uint8Array(12);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (b) => b.toString(36).padStart(2, '0')).join('').slice(0, 16);
};
export const nowLabel = () => new Date().toISOString().replace('T', ' ').substring(0, 16);

interface TeamData {
  accounts: AdminAccount[];
  scanLinks: ScanLink[];
  activity: ActivityEntry[];
}

const safeGet = (storage: Storage, key: string) => {
  try {
    return storage.getItem(key);
  } catch {
    return null;
  }
};
const safeSet = (storage: Storage, key: string, value: string | null) => {
  try {
    if (value === null) storage.removeItem(key);
    else storage.setItem(key, value);
  } catch {
    // stockage indisponible : les données restent valables pour la session
  }
};

const loadTeam = (): TeamData => {
  try {
    const raw = JSON.parse(safeGet(localStorage, STORAGE_KEY) ?? 'null');
    if (raw && Array.isArray(raw.accounts)) {
      return { accounts: raw.accounts, scanLinks: raw.scanLinks ?? [], activity: raw.activity ?? [] };
    }
  } catch {
    // données illisibles : on repart de zéro
  }
  // Ancienne version (un seul code d'admin n°1) : on la reprend comme compte « Admin n°1 »
  const legacy = safeGet(localStorage, LEGACY_OWNER_KEY);
  const accounts: AdminAccount[] = legacy
    ? [{ id: uid('adm'), name: 'Admin n°1', role: 'owner', permissions: ALL_PERMISSIONS.map((p) => p.id), codeHash: legacy, active: true, createdAt: nowLabel() }]
    : [];
  return { accounts, scanLinks: [], activity: [] };
};

export type TeamResult = { ok: true } | { ok: false; error: string };

interface TeamContextValue {
  accounts: AdminAccount[];
  scanLinks: ScanLink[];
  activity: ActivityEntry[];
  /** Compte connecté sur cet appareil (null = console verrouillée) */
  current: AdminAccount | null;
  needsSetup: boolean;
  can: (perm: AdminPermission) => boolean;
  isManager: boolean;
  login: (code: string) => boolean;
  logout: () => void;
  setupSuper: (name: string, code: string) => TeamResult;
  /** Vérifie un code d'admin n°1 ou de super admin (autorisation des suppressions) */
  verifyApprover: (code: string) => boolean;
  createAccount: (input: { name: string; code: string; role: AdminRole; permissions: AdminPermission[] }) => TeamResult;
  updateAccount: (id: string, patch: Partial<Pick<AdminAccount, 'name' | 'permissions' | 'active'>>) => void;
  resetCode: (id: string, code: string) => TeamResult;
  deleteAccount: (id: string) => void;
  createScanLink: (label: string) => ScanLink;
  updateScanLink: (id: string, patch: Partial<Pick<ScanLink, 'label' | 'active'>>) => void;
  deleteScanLink: (id: string) => void;
  findScanLink: (token: string) => ScanLink | null;
  recordScan: (linkId: string) => void;
  log: (action: string, actor?: string) => void;
}

const TeamContext = createContext<TeamContextValue | null>(null);

export const useTeam = (): TeamContextValue => {
  const ctx = useContext(TeamContext);
  if (!ctx) throw new Error('useTeam doit être utilisé dans <TeamProvider>');
  return ctx;
};

export const TeamProvider: React.FC<{ demo?: boolean; children: React.ReactNode }> = ({ demo = false, children }) => {
  const [data, setData] = useState<TeamData>(loadTeam);
  const [sessionId, setSessionId] = useState<string | null>(() => safeGet(sessionStorage, SESSION_KEY));

  useEffect(() => {
    if (!demo) safeSet(localStorage, STORAGE_KEY, JSON.stringify(data));
  }, [data, demo]);

  useEffect(() => {
    safeSet(sessionStorage, SESSION_KEY, sessionId);
  }, [sessionId]);

  // Modifié dans un autre onglet (console / lien de scan sur le même appareil) : on recharge
  useEffect(() => {
    if (demo) return;
    const onStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) setData(loadTeam());
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, [demo]);

  const demoAccount: AdminAccount = useMemo(
    () => ({ id: 'demo', name: 'Démo', role: 'super', permissions: ALL_PERMISSIONS.map((p) => p.id), codeHash: '', active: true, createdAt: '' }),
    []
  );
  const current = demo ? demoAccount : data.accounts.find((a) => a.id === sessionId && a.active) ?? null;
  const isManager = current?.role === 'super' || current?.role === 'owner';

  const codeTaken = useCallback((code: string, exceptId?: string) => data.accounts.some((a) => a.id !== exceptId && a.codeHash === hashCode(code)), [data.accounts]);

  const log = useCallback(
    (action: string, actor?: string) =>
      setData((d) => ({
        ...d,
        activity: [{ id: uid('log'), at: nowLabel(), actor: actor ?? current?.name ?? 'Système', action }, ...d.activity].slice(0, 300),
      })),
    [current?.name]
  );

  const value: TeamContextValue = {
    accounts: data.accounts,
    scanLinks: data.scanLinks,
    activity: data.activity,
    current,
    needsSetup: !demo && !data.accounts.some((a) => a.role === 'super'),
    isManager,
    can: (perm) => !!current && (current.role !== 'admin' || current.permissions.includes(perm)),
    login: (code) => {
      const acc = data.accounts.find((a) => a.active && a.codeHash === hashCode(code));
      if (!acc) return false;
      setSessionId(acc.id);
      log('S\'est connecté à la console', acc.name);
      return true;
    },
    logout: () => setSessionId(null),
    setupSuper: (name, code) => {
      if (data.accounts.some((a) => a.role === 'super')) return { ok: false, error: 'Le super admin existe déjà.' };
      if (code.length < 4) return { ok: false, error: 'Choisis un code d\'au moins 4 caractères.' };
      if (codeTaken(code)) return { ok: false, error: 'Ce code est déjà utilisé par un autre compte.' };
      const acc: AdminAccount = { id: uid('adm'), name: name.trim() || 'Super admin', role: 'super', permissions: ALL_PERMISSIONS.map((p) => p.id), codeHash: hashCode(code), active: true, createdAt: nowLabel() };
      setData((d) => ({ ...d, accounts: [acc, ...d.accounts] }));
      setSessionId(acc.id);
      log('A créé le compte super admin', acc.name);
      return { ok: true };
    },
    verifyApprover: (code) => data.accounts.some((a) => a.active && (a.role === 'owner' || a.role === 'super') && a.codeHash === hashCode(code)),
    createAccount: ({ name, code, role, permissions }) => {
      if (!current || !isManager) return { ok: false, error: 'Seul l\'admin n°1 peut donner des accès.' };
      if (role === 'super') return { ok: false, error: 'Il ne peut y avoir qu\'un super admin.' };
      if (role === 'owner' && current.role !== 'super') return { ok: false, error: 'Seul le super admin peut créer l\'admin n°1.' };
      if (role === 'owner' && data.accounts.some((a) => a.role === 'owner')) return { ok: false, error: 'L\'admin n°1 existe déjà.' };
      if (!name.trim()) return { ok: false, error: 'Indique un nom.' };
      if (code.length < 4) return { ok: false, error: 'Le code doit faire au moins 4 caractères.' };
      if (codeTaken(code)) return { ok: false, error: 'Ce code est déjà utilisé par un autre compte : choisis-en un autre.' };
      const acc: AdminAccount = {
        id: uid('adm'),
        name: name.trim(),
        role,
        permissions: role === 'owner' ? ALL_PERMISSIONS.map((p) => p.id) : permissions,
        codeHash: hashCode(code),
        active: true,
        createdAt: nowLabel(),
        createdBy: current.name,
      };
      setData((d) => ({ ...d, accounts: [...d.accounts, acc] }));
      log(`A créé le compte « ${acc.name} » (${ROLE_LABELS[role]})`);
      return { ok: true };
    },
    updateAccount: (id, patch) => {
      setData((d) => ({ ...d, accounts: d.accounts.map((a) => (a.id === id ? { ...a, ...patch } : a)) }));
      const acc = data.accounts.find((a) => a.id === id);
      if (acc && patch.active !== undefined) log(`${patch.active ? 'A réactivé' : 'A suspendu'} le compte « ${acc.name} »`);
      else if (acc && patch.permissions) log(`A modifié les droits de « ${acc.name} »`);
    },
    resetCode: (id, code) => {
      if (code.length < 4) return { ok: false, error: 'Le code doit faire au moins 4 caractères.' };
      if (codeTaken(code, id)) return { ok: false, error: 'Ce code est déjà utilisé par un autre compte.' };
      setData((d) => ({ ...d, accounts: d.accounts.map((a) => (a.id === id ? { ...a, codeHash: hashCode(code) } : a)) }));
      const acc = data.accounts.find((a) => a.id === id);
      log(id === current?.id ? 'A changé son code' : `A changé le code de « ${acc?.name ?? '?'} »`);
      return { ok: true };
    },
    deleteAccount: (id) => {
      const acc = data.accounts.find((a) => a.id === id);
      setData((d) => ({ ...d, accounts: d.accounts.filter((a) => a.id !== id) }));
      if (acc) log(`A supprimé le compte « ${acc.name} »`);
    },
    createScanLink: (label) => {
      const link: ScanLink = { id: uid('scan'), label: label.trim() || 'Contrôle d\'entrée', token: randomToken(), active: true, createdAt: nowLabel(), createdBy: current?.name ?? '', scanCount: 0 };
      setData((d) => ({ ...d, scanLinks: [link, ...d.scanLinks] }));
      log(`A créé le lien de scan « ${link.label} »`);
      return link;
    },
    updateScanLink: (id, patch) => {
      setData((d) => ({ ...d, scanLinks: d.scanLinks.map((l) => (l.id === id ? { ...l, ...patch } : l)) }));
      const link = data.scanLinks.find((l) => l.id === id);
      if (link && patch.active !== undefined) log(`${patch.active ? 'A réactivé' : 'A désactivé'} le lien de scan « ${link.label} »`);
    },
    deleteScanLink: (id) => {
      const link = data.scanLinks.find((l) => l.id === id);
      setData((d) => ({ ...d, scanLinks: d.scanLinks.filter((l) => l.id !== id) }));
      if (link) log(`A supprimé le lien de scan « ${link.label} »`);
    },
    findScanLink: (token) => data.scanLinks.find((l) => l.token === token) ?? null,
    recordScan: (linkId) =>
      setData((d) => ({ ...d, scanLinks: d.scanLinks.map((l) => (l.id === linkId ? { ...l, scanCount: l.scanCount + 1, lastUsedAt: nowLabel() } : l)) })),
    log,
  };

  return <TeamContext.Provider value={value}>{children}</TeamContext.Provider>;
};
