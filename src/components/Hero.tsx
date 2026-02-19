import React from 'react';
import { useStore } from '@nanostores/react';
import { languageStore, getTranslations } from '../lib/langStore';

interface HeroProps {
    onStart: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onStart }) => {
    const lang = useStore(languageStore);
    const { hero: t } = getTranslations(lang);

    return (
        <div className="flex flex-col items-center justify-center min-h-[80vh] text-center px-4">


            <div className="mb-4">
                <span className="text-gray-500 text-sm font-bold uppercase tracking-[0.2em]">{t.welcome}</span>
            </div>

            <h1 className="text-6xl md:text-8xl font-extrabold tracking-tight mb-8 bg-gradient-to-b from-white to-gray-400 bg-clip-text text-transparent">
                {t.title}
            </h1>

            <p className="text-xl md:text-2xl text-gray-400 max-w-2xl mb-12 leading-relaxed">
                {t.description.split('<0>').map((text, i) =>
                    i === 1 ? <span key={i} className="text-white font-semibold">{text.split('</0>')[0]}</span> : text.split('</0>').pop()
                )}
            </p>

            <button
                onClick={onStart}
                className="btn-primary flex items-center space-x-2 text-lg px-8 py-4 mb-20 transition-all hover:shadow-yellow-500/30"
            >
                <span>{t.button}</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
            </button>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-4xl mt-16 mb-20">
                {[
                    { title: t.feature_1.title, desc: t.feature_1.desc },
                    { title: t.feature_2.title, desc: t.feature_2.desc },
                    { title: t.feature_3.title, desc: t.feature_3.desc }
                ].map((feature, i) => (
                    <div key={i} className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 transition-all hover:translate-y-[-4px] text-left">
                        <h3 className="text-lg font-bold text-white mb-2">{feature.title}</h3>
                        <p className="text-gray-400 text-sm leading-relaxed">{feature.desc}</p>
                    </div>
                ))}
            </div>

            <div className="mb-4 inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-yellow-500/10 border border-yellow-500/20 text-yellow-500 text-xs font-bold uppercase tracking-widest">
                <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-50"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-yellow-500"></span>
                </span>
                <span>{t.beta}</span>
            </div>
        </div>
    );
};
