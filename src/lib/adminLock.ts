// Verrou d'accès à l'espace équipe.
// Sans serveur, ce code protège l'écran d'admin de cet appareil (il n'est pas une sécurité « bancaire »).
const CODE_KEY = 'gala-admin-code-v1';
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

const read = (storage: Storage | undefined, key: string): string | null => {
  try {
    return storage?.getItem(key) ?? null;
  } catch {
    return null;
  }
};

export const hasAdminCode = (): boolean => read(localStorage, CODE_KEY) !== null;
export const isAdminUnlocked = (): boolean => read(sessionStorage, SESSION_KEY) === '1';

export const setAdminCode = (code: string): void => {
  try {
    localStorage.setItem(CODE_KEY, hash(code));
    sessionStorage.setItem(SESSION_KEY, '1');
  } catch {
    // stockage indisponible : l'accès reste ouvert pour la session
  }
};

export const checkAdminCode = (code: string): boolean => {
  const ok = read(localStorage, CODE_KEY) === hash(code);
  if (ok) {
    try {
      sessionStorage.setItem(SESSION_KEY, '1');
    } catch {
      // ignore
    }
  }
  return ok;
};

export const lockAdmin = (): void => {
  try {
    sessionStorage.removeItem(SESSION_KEY);
  } catch {
    // ignore
  }
};
