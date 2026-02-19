import React from 'react';
import {
    SiJavascript,
    SiTypescript,
    SiPython,
    SiRust,
    SiKotlin,
    SiCplusplus
} from 'react-icons/si';
import { FaJava } from 'react-icons/fa';

interface LanguageSelectorProps {
    currentLang: string;
    onChange: (lang: string) => void;
}

const languages = [
    {
        id: 'javascript',
        name: 'JavaScript',
        color: '#F7DF1E',
        Icon: SiJavascript
    },
    {
        id: 'typescript',
        name: 'TypeScript',
        color: '#3178C6',
        Icon: SiTypescript
    },
    {
        id: 'python',
        name: 'Python',
        color: '#3776AB',
        Icon: SiPython
    },
    {
        id: 'rust',
        name: 'Rust',
        color: '#DEA584',
        Icon: SiRust
    },
    {
        id: 'java',
        name: 'Java',
        color: '#ED8B00',
        Icon: FaJava
    },
    {
        id: 'cpp',
        name: 'C++',
        color: '#00599C',
        Icon: SiCplusplus
    },
    {
        id: 'kotlin',
        name: 'Kotlin',
        color: '#7F52FF',
        Icon: SiKotlin
    }
];

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({ currentLang, onChange }) => {
    return (
        <div className="flex flex-wrap justify-center gap-4 mb-8">
            {languages.map((lang) => {
                const isSelected = currentLang === lang.id;
                const { Icon } = lang;

                return (
                    <button
                        key={lang.id}
                        onClick={() => onChange(lang.id)}
                        className={`group px-5 py-3 rounded-xl border transition-all duration-300 flex items-center space-x-3 shadow-md ${isSelected
                            ? 'bg-white/10 border-white/20 text-white translate-y-[-2px] ring-2 ring-white/10'
                            : 'bg-white/5 border-white/5 text-gray-500 hover:border-white/20 hover:text-gray-300 hover:translate-y-[-1px]'
                            }`}
                        style={{
                            boxShadow: isSelected ? `0 10px 25px -5px ${lang.color}20` : 'none'
                        }}
                    >
                        <div
                            className={`text-xl transition-all duration-300 transform ${isSelected ? 'scale-110 opacity-100' : 'opacity-40 grayscale group-hover:grayscale-0 group-hover:opacity-70'
                                }`}
                            style={{ color: lang.color }}
                        >
                            <Icon />
                        </div>
                        <span className={`text-sm font-bold tracking-tight transition-all duration-300`}>
                            {lang.name}
                        </span>
                        {isSelected && (
                            <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: lang.color }}></div>
                        )}
                    </button>
                );
            })}
        </div>
    );
};
