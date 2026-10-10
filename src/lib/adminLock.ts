// Verrou d'accès à l'espace équipe.
// Sans serveur, ces codes protègent l'écran d'admin de cet appareil (ce n'est pas une sécurité « bancaire »).
// Deux niveaux : l'admin n°1 (propriétaire) peut tout faire ; un membre d'équipe ne peut pas supprimer sans le code de l'admin n°1.
export type AdminRole = 'owner' | 'team';

const OWNER_KEY = 'gala-admin-code-v1';
const TEAM_KEY = 'gala-admin-team-code-v1';
const SESSION_KEY = 'gala-admin-open-v1';

// Petit hachage (cyrb53) : fonctionne aussi en http, où crypto.subtle n'existe pas
const hash = (text: string): string => {
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

const get = (storage: Storage, key: string): string | null => {
  try {
    return storage.getItem(key);
  } catch {
    return null;
  }
};
const set = (storage: Storage, key: string, value: string | null) => {
  try {
    if (value === null) storage.removeItem(key);
    else storage.setItem(key, value);
  } catch {
    // stockage indisponible : l'accès reste ouvert pour la session
  }
};

export const hasAdminCode = (): boolean => get(localStorage, OWNER_KEY) !== null;
export const hasTeamCode = (): boolean => get(localStorage, TEAM_KEY) !== null;

/** Rôle de la session en cours (null = verrouillé) */
export const getAdminRole = (): AdminRole | null => {
  const v = get(sessionStorage, SESSION_KEY);
  return v === 'owner' || v === 'team' ? v : null;
};

export const verifyOwnerCode = (code: string): boolean => get(localStorage, OWNER_KEY) === hash(code);

export const setOwnerCode = (code: string): void => {
  set(localStorage, OWNER_KEY, hash(code));
  set(sessionStorage, SESSION_KEY, 'owner');
};

export const setTeamCode = (code: string | null): void => set(localStorage, TEAM_KEY, code === null ? null : hash(code));

/** Connexion : renvoie le rôle si le code est bon, sinon null */
export const loginWithCode = (code: string): AdminRole | null => {
  let role: AdminRole | null = null;
  if (verifyOwnerCode(code)) role = 'owner';
  else if (hasTeamCode() && get(localStorage, TEAM_KEY) === hash(code)) role = 'team';
  if (role) set(sessionStorage, SESSION_KEY, role);
  return role;
};

export const lockAdmin = (): void => set(sessionStorage, SESSION_KEY, null);
