import React, { createContext, useContext, useState, useEffect } from 'react';
import { translations, type TranslationType } from '../lib/translations';

type LangType = 'EN' | 'ES';

interface LanguageContextType {
    lang: LangType;
    setLang: (lang: LangType) => void;
    t: TranslationType;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [lang, setLangState] = useState<LangType>('EN');

    useEffect(() => {
        const savedLang = localStorage.getItem('interfaceLang') as LangType;
        if (savedLang && (savedLang === 'EN' || savedLang === 'ES')) {
            setLangState(savedLang);
        }
    }, []);

    const setLang = (newLang: LangType) => {
        setLangState(newLang);
        localStorage.setItem('interfaceLang', newLang);
    };

    const value = {
        lang,
        setLang,
        t: translations[lang]
    };

    return (
        <LanguageContext.Provider value={value}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useLanguage = () => {
    const context = useContext(LanguageContext);
    if (context === undefined) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
};
