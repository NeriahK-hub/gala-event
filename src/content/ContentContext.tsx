import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { SiteContent } from '../types';
import {
  GALA_INFO,
  TICKET_TIERS,
  PROGRAM_TIMELINE,
  GUEST_ARTISTS,
  GALLERY_ITEMS,
  FAQ_ITEMS,
  PARTNERS_SPONSORS,
} from '../data/mockData';
import { DEFAULT_TEXTS } from './textSchema';

const NBSP = '\u00A0';

// Typographie française : espace insécable avant : ; ! ? $ et à l'intérieur des guillemets « »
// (évite qu'un « : » ou un « $ » se retrouve seul au début d'une ligne)
const frTypo = (text: string): string => {
  if (/^(https?:|data:|mailto:)/.test(text)) return text;
  return text
    .replace(/ ([:;!?$»%])/g, NBSP + '$1')
    .replace(/(«) /g, '$1' + NBSP);
};

const normalizeDeep = <T,>(value: T): T => {
  if (typeof value === 'string') return frTypo(value) as unknown as T;
  if (Array.isArray(value)) return value.map(normalizeDeep) as unknown as T;
  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, normalizeDeep(v)])) as T;
  }
  return value;
};

const STORAGE_KEY = 'gala-site-content-v2';

export const createDefaultContent = (): SiteContent => ({
  galaInfo: structuredClone(GALA_INFO),
  texts: { ...DEFAULT_TEXTS },
  tiers: structuredClone(TICKET_TIERS),
  program: structuredClone(PROGRAM_TIMELINE),
  guests: structuredClone(GUEST_ARTISTS),
  gallery: structuredClone(GALLERY_ITEMS),
  faq: structuredClone(FAQ_ITEMS),
  sponsors: structuredClone(PARTNERS_SPONSORS),
});

// Fusionne un contenu sauvegardé avec les valeurs par défaut (les nouveaux champs restent présents)
export const mergeContent = (saved: Partial<SiteContent> | null | undefined): SiteContent => {
  const base = createDefaultContent();
  if (!saved || typeof saved !== 'object') return base;
  return {
    ...base,
    ...saved,
    galaInfo: {
      ...base.galaInfo,
      ...(saved.galaInfo ?? {}),
      dressCode: { ...base.galaInfo.dressCode, ...(saved.galaInfo?.dressCode ?? {}) },
    },
    texts: { ...base.texts, ...(saved.texts ?? {}) },
  };
};

const loadContent = (): SiteContent => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return mergeContent(raw ? JSON.parse(raw) : null);
  } catch {
    return createDefaultContent();
  }
};

interface ContentContextValue {
  content: SiteContent;
  /** Renvoie le texte modifiable associé à la clef */
  t: (key: string) => string;
  setContent: (updater: (prev: SiteContent) => SiteContent) => void;
  replaceContent: (next: SiteContent) => void;
  resetAll: () => void;
  isCustomized: boolean;
}

const ContentContext = createContext<ContentContextValue | null>(null);

export const ContentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [content, setContentState] = useState<SiteContent>(loadContent);
  const [isCustomized, setIsCustomized] = useState<boolean>(() => {
    try {
      return localStorage.getItem(STORAGE_KEY) !== null;
    } catch {
      return false;
    }
  });

  // Sauvegarde automatique à chaque modification
  useEffect(() => {
    if (!isCustomized) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(content));
    } catch {
      // stockage indisponible : le contenu reste valable pour la session
    }
  }, [content, isCustomized]);

  const setContent = useCallback((updater: (prev: SiteContent) => SiteContent) => {
    setIsCustomized(true);
    setContentState(updater);
  }, []);

  const replaceContent = useCallback((next: SiteContent) => {
    setIsCustomized(true);
    setContentState(mergeContent(next));
  }, []);

  const resetAll = useCallback(() => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
    setIsCustomized(false);
    setContentState(createDefaultContent());
  }, []);

  const display = useMemo(() => normalizeDeep(content), [content]);

  const value = useMemo<ContentContextValue>(
    () => ({
      content: display,
      t: (key: string) => display.texts[key] ?? frTypo(DEFAULT_TEXTS[key] ?? ''),
      setContent,
      replaceContent,
      resetAll,
      isCustomized,
    }),
    [display, setContent, replaceContent, resetAll, isCustomized]
  );

  return <ContentContext.Provider value={value}>{children}</ContentContext.Provider>;
};

export const useContent = (): ContentContextValue => {
  const ctx = useContext(ContentContext);
  if (!ctx) throw new Error('useContent doit être utilisé dans <ContentProvider>');
  return ctx;
};
