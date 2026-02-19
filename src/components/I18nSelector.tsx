import React from 'react';
import { useStore } from '@nanostores/react';
import { HiOutlineLanguage } from 'react-icons/hi2';
import { languageStore, setLanguage } from '../lib/langStore';

export const I18nSelector: React.FC = () => {
    const lang = useStore(languageStore);

    const toggleLang = () => {
        const newLang = lang === 'EN' ? 'ES' : 'EN';
        setLanguage(newLang);
    };

    return (
        <button
            onClick={toggleLang}
            className="flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/5 hover:border-white/20 transition-all text-gray-400 hover:text-white group"
            title={lang === 'EN' ? 'Switch to Spanish' : 'Cambiar a Inglés'}
        >
            <HiOutlineLanguage className="text-lg group-hover:text-yellow-500 transition-colors" />
            <span className="text-xs font-bold tracking-widest">{lang}</span>
            <div className="flex flex-col space-y-[2px] opacity-30 group-hover:opacity-100 transition-opacity">
                <div className={`w-1 h-1 rounded-full ${lang === 'EN' ? 'bg-yellow-500 shadow-[0_0_8px_rgba(234,179,8,0.5)]' : 'bg-gray-600'}`}></div>
                <div className={`w-1 h-1 rounded-full ${lang === 'ES' ? 'bg-yellow-500 shadow-[0_0_8px_rgba(234,179,8,0.5)]' : 'bg-gray-600'}`}></div>
            </div>
        </button>
    );
};
