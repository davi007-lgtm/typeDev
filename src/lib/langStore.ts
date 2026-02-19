import { atom } from 'nanostores';
import { translations } from './translations';

export type LangType = 'EN' | 'ES';

// Initialize from localStorage if available
const initialLang = (typeof window !== 'undefined' ? localStorage.getItem('interfaceLang') : 'EN') as LangType || 'EN';

export const languageStore = atom<LangType>(initialLang);

export function setLanguage(newLang: LangType) {
    languageStore.set(newLang);
    if (typeof window !== 'undefined') {
        localStorage.setItem('interfaceLang', newLang);
    }
}

// Helper to get current translations reactively
export const getTranslations = (lang: LangType) => translations[lang];
