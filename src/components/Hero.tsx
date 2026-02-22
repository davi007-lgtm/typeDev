import React, { useEffect, useRef } from 'react';
import { useStore } from '@nanostores/react';
import { languageStore, getTranslations } from '../lib/langStore';

interface HeroProps {
    onStart: () => void;
}

// Floating code particles background
const CodeBackground: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        const symbols = ['{}', '=>', '()', '[]', '//', '&&', '||', '**', '<<', '>>', '!=', '==', '+=', ';;', '/*', '*/'];
        const particles: { x: number; y: number; speed: number; sym: string; opacity: number; size: number }[] = [];

        for (let i = 0; i < 30; i++) {
            particles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                speed: 0.2 + Math.random() * 0.4,
                sym: symbols[Math.floor(Math.random() * symbols.length)],
                opacity: 0.03 + Math.random() * 0.07,
                size: 12 + Math.random() * 10,
            });
        }

        let animId: number;
        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.font = `${14}px 'Fira Code', monospace`;

            for (const p of particles) {
                ctx.fillStyle = `rgba(234, 179, 8, ${p.opacity})`;
                ctx.font = `${p.size}px 'Fira Code', monospace`;
                ctx.fillText(p.sym, p.x, p.y);
                p.y += p.speed;
                if (p.y > canvas.height + 30) {
                    p.y = -30;
                    p.x = Math.random() * canvas.width;
                }
            }
            animId = requestAnimationFrame(animate);
        };

        animate();

        const handleResize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        window.addEventListener('resize', handleResize);

        return () => {
            cancelAnimationFrame(animId);
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="absolute inset-0 pointer-events-none"
            style={{ opacity: 1 }}
        />
    );
};

const featureIcons = [
    // Terminal icon
    <svg key="t" xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 7.5l3 2.25-3 2.25m4.5 0h3m-9 8.25h13.5A2.25 2.25 0 0021 18V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v12a2.25 2.25 0 002.25 2.25z" />
    </svg>,
    // Sparkles icon
    <svg key="s" xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456z" />
    </svg>,
    // Chart icon
    <svg key="c" xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
    </svg>
];

export const Hero: React.FC<HeroProps> = ({ onStart }) => {
    const lang = useStore(languageStore);
    const { hero: t } = getTranslations(lang);

    return (
        <div className="relative flex flex-col items-center justify-center min-h-[85vh] text-center px-4 overflow-hidden">
            <CodeBackground />

            {/* Radial glow behind title */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] rounded-full bg-yellow-500/5 blur-3xl pointer-events-none" />

            <div className="relative z-10 flex flex-col items-center">
                {/* Welcome label */}
                <div className="mb-5 inline-flex items-center space-x-2 px-4 py-1.5 rounded-full border border-yellow-500/20 bg-yellow-500/5 text-yellow-500/80 text-xs font-bold uppercase tracking-[0.25em]">
                    <span className="relative flex h-1.5 w-1.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-60" />
                        <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-yellow-500" />
                    </span>
                    <span>{t.welcome}</span>
                </div>

                {/* Main title */}
                <div className="select-none" style={{ position: 'relative', lineHeight: 1, marginBottom: 'clamp(3rem, 8vw, 6rem)' }}>
                    {/* Main text */}
                    <h1
                        className="font-black italic uppercase"
                        style={{
                            fontSize: 'clamp(5rem, 10vw, 10rem)',
                            letterSpacing: '-0.02em',
                            color: '#eab308',
                            textShadow: '6px 6px 0px #1a1400, 10px 10px 0px rgba(0,0,0,0.5)',
                            fontFamily: "'Geist', 'Arial Black', sans-serif",
                            lineHeight: 0.9,
                        }}
                    >
                        {t.title}
                    </h1>
                </div>
                {/* Subtitle */}
                <p className="text-lg md:text-xl text-gray-500 max-w-xl mb-10 leading-relaxed font-light">
                    {t.description.split('<0>').map((text, i) =>
                        i === 1
                            ? <strong key={i} className="text-gray-200 font-semibold">{text.split('</0>')[0]}</strong>
                            : text.split('</0>').pop()
                    )}
                </p>

                {/* CTA Button */}
                <button
                    onClick={onStart}
                    className="group relative flex items-center space-x-3 text-base font-bold px-8 py-4 mb-8 rounded-xl overflow-hidden transition-all duration-300 hover:scale-105 active:scale-95"
                    style={{
                        background: 'linear-gradient(135deg, #eab308, #ca8a04)',
                        boxShadow: '0 0 0 1px rgba(234,179,8,0.3), 0 20px 40px -10px rgba(234,179,8,0.4)',
                        color: '#000'
                    }}
                >
                    {/* shimmer overlay */}
                    <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                        style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent)', transform: 'skewX(-15deg)' }} />
                    <span>{t.button}</span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                </button>

                {/* Feature Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-3xl">
                    {[
                        { title: t.feature_1.title, desc: t.feature_1.desc, icon: featureIcons[0] },
                        { title: t.feature_2.title, desc: t.feature_2.desc, icon: featureIcons[1] },
                        { title: t.feature_3.title, desc: t.feature_3.desc, icon: featureIcons[2] },
                    ].map((feature, i) => (
                        <div
                            key={i}
                            className="group p-5 rounded-xl text-left transition-all duration-300 cursor-default"
                            style={{
                                background: 'linear-gradient(135deg, rgba(255,255,255,0.04), rgba(255,255,255,0.02))',
                                border: '1px solid rgba(255,255,255,0.07)',
                            }}
                            onMouseEnter={e => {
                                (e.currentTarget as HTMLElement).style.border = '1px solid rgba(234,179,8,0.2)';
                                (e.currentTarget as HTMLElement).style.transform = 'translateY(-4px)';
                                (e.currentTarget as HTMLElement).style.boxShadow = '0 20px 40px -10px rgba(234,179,8,0.1)';
                            }}
                            onMouseLeave={e => {
                                (e.currentTarget as HTMLElement).style.border = '1px solid rgba(255,255,255,0.07)';
                                (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
                                (e.currentTarget as HTMLElement).style.boxShadow = 'none';
                            }}
                        >
                            <div className="flex items-center space-x-3 mb-3">
                                <div className="p-2 rounded-lg bg-yellow-500/10 text-yellow-500">
                                    {feature.icon}
                                </div>
                                <h3 className="text-sm font-bold text-white">{feature.title}</h3>
                            </div>
                            <p className="text-gray-500 text-xs leading-relaxed">{feature.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};