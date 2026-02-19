import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useStore } from '@nanostores/react';
import { Hero } from './Hero';
import { LanguageSelector } from './LanguageSelector';
import { SNIPPETS, type Snippet } from '../lib/snippets';
import { languageStore, getTranslations } from '../lib/langStore';

export const TypingGame: React.FC = () => {
    const lang = useStore(languageStore);
    const { game: t } = getTranslations(lang);

    const [gameState, setGameState] = useState<'IDLE' | 'PLAYING' | 'FINISHED'>('IDLE');
    const [language, setLanguage] = useState('javascript');
    const [snippet, setSnippet] = useState<Snippet>(SNIPPETS[0]);
    const [input, setInput] = useState('');
    const [startTime, setStartTime] = useState<number | null>(null);
    const [errors, setErrors] = useState(0);
    const [wpm, setWpm] = useState(0);
    const [liveWpm, setLiveWpm] = useState(0);
    const [accuracy, setAccuracy] = useState(100);

    const hiddenInputRef = useRef<HTMLTextAreaElement>(null);
    const liveWpmInterval = useRef<ReturnType<typeof setInterval> | null>(null);

    // Initialize snippet based on language
    useEffect(() => {
        const filtered = SNIPPETS.filter(s => s.language === language);
        setSnippet(filtered[Math.floor(Math.random() * filtered.length)]);
        resetGameData();
        setGameState('IDLE');
    }, [language]);

    // Live WPM ticker
    useEffect(() => {
        if (gameState === 'PLAYING' && startTime) {
            liveWpmInterval.current = setInterval(() => {
                const elapsed = (Date.now() - startTime) / 1000 / 60;
                if (elapsed > 0) {
                    setLiveWpm(Math.round((input.length / 5) / elapsed));
                }
            }, 500);
        } else {
            if (liveWpmInterval.current) clearInterval(liveWpmInterval.current);
        }
        return () => { if (liveWpmInterval.current) clearInterval(liveWpmInterval.current); };
    }, [gameState, startTime, input.length]);

    // ESC / TAB+Enter keyboard shortcuts
    useEffect(() => {
        const handleKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && gameState !== 'IDLE') {
                startGame();
            }
        };
        window.addEventListener('keydown', handleKey);
        return () => window.removeEventListener('keydown', handleKey);
    }, [gameState]);

    const resetGameData = () => {
        setInput('');
        setStartTime(null);
        setErrors(0);
        setWpm(0);
        setLiveWpm(0);
        setAccuracy(100);
    };

    const startGame = useCallback(() => {
        // Pick a new random snippet each restart
        const filtered = SNIPPETS.filter(s => s.language === language);
        setSnippet(filtered[Math.floor(Math.random() * filtered.length)]);
        resetGameData();
        setGameState('PLAYING');
        setTimeout(() => hiddenInputRef.current?.focus(), 10);
    }, [language]);

    const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        if (gameState === 'FINISHED') return;

        const value = e.target.value;

        if (!startTime && value.length > 0) {
            setStartTime(Date.now());
            setGameState('PLAYING');
        }

        if (value.length <= snippet.code.length) {
            if (value.length > input.length) {
                const lastChar = value[value.length - 1];
                const expectedChar = snippet.code[value.length - 1];
                if (lastChar !== expectedChar) {
                    setErrors(prev => prev + 1);
                }
            }

            setInput(value);

            if (value.length === snippet.code.length) {
                finishGame(value);
            }
        }
    };

    const finishGame = (finalInput: string) => {
        const end = Date.now();
        setGameState('FINISHED');

        if (startTime) {
            const timeInMin = (end - startTime) / 1000 / 60;
            const words = snippet.code.length / 5;
            const calculatedWpm = Math.round(words / timeInMin);
            // Count real errors from final string comparison
            let realErrors = 0;
            for (let i = 0; i < finalInput.length; i++) {
                if (finalInput[i] !== snippet.code[i]) realErrors++;
            }
            const calculatedAccuracy = Math.round(((snippet.code.length - realErrors) / snippet.code.length) * 100);
            setWpm(calculatedWpm);
            setAccuracy(Math.max(0, calculatedAccuracy));
        }
    };

    const progress = Math.round((input.length / snippet.code.length) * 100);

    const renderCode = () => {
        return snippet.code.split('').map((char, index) => {
            let status = 'neutral';
            if (index < input.length) {
                status = input[index] === char ? 'correct' : 'incorrect';
            } else if (index === input.length) {
                status = 'current';
            }

            const classMap: Record<string, string> = {
                correct: 'text-gray-100',
                incorrect: 'text-red-400 bg-red-500/15 rounded-sm',
                neutral: 'text-gray-600',
                current: 'text-yellow-400 after:content-[""] after:absolute after:bottom-[-2px] after:left-0 after:w-full after:h-[2px] after:bg-yellow-500 after:animate-pulse',
            };

            return (
                <span key={index} className={`relative inline transition-colors duration-75 ${classMap[status]}`}>
                    {char === '\n' ? '↵\n' : char}
                </span>
            );
        });
    };

    if (gameState === 'IDLE') {
        return (
            <div className="w-full pb-20">
                <Hero onStart={startGame} />
                <div className="mt-2 flex flex-col items-center space-y-6 pb-10">
                    <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-yellow-500/10 border border-yellow-500/20 text-yellow-500 text-xs font-bold uppercase tracking-widest mt-4">
                        <span className="relative flex h-1.5 w-1.5">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-60" />
                            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-yellow-500" />
                        </span>
                        <span>
                            {lang === 'ES' ? 'Elige tu lenguaje' : 'Choose your language'}
                        </span>
                    </div>
                    <LanguageSelector currentLang={language} onChange={setLanguage} />
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto py-10 px-4 flex flex-col items-center">

            {/* Progress bar - full width, thin, at top */}
            <div className="w-full h-[3px] bg-white/5 rounded-full mb-8 overflow-hidden">
                <div
                    className="h-full rounded-full transition-all duration-150"
                    style={{
                        width: `${progress}%`,
                        background: gameState === 'FINISHED'
                            ? 'linear-gradient(90deg, #22c55e, #16a34a)'
                            : 'linear-gradient(90deg, #eab308, #ca8a04)',
                        boxShadow: gameState === 'FINISHED'
                            ? '0 0 10px rgba(34,197,94,0.5)'
                            : '0 0 10px rgba(234,179,8,0.5)',
                    }}
                />
            </div>

            {/* Metrics Row */}
            <div className="w-full flex justify-between items-center mb-6 px-5 py-3 rounded-2xl"
                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
                <div className="flex items-center space-x-4">
                    <button
                        onClick={() => setGameState('IDLE')}
                        className="p-2 hover:bg-white/10 rounded-lg transition-colors text-gray-500 hover:text-white"
                        title={t.controls.back}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                        </svg>
                    </button>
                    <div className="w-px h-6 bg-white/10" />
                    <div>
                        <div className="text-[10px] font-bold text-gray-600 uppercase tracking-widest">{t.metrics.language}</div>
                        <div className="text-yellow-500 font-bold text-sm capitalize">{snippet.language}</div>
                    </div>
                </div>

                <div className="flex space-x-8">
                    {/* Live WPM */}
                    <div className="text-center">
                        <div className="text-[10px] font-bold text-gray-600 uppercase tracking-widest mb-0.5">{t.metrics.wpm}</div>
                        <div className={`text-2xl font-black tabular-nums transition-all ${gameState === 'FINISHED' ? 'text-yellow-400' : 'text-white'}`}>
                            {gameState === 'FINISHED' ? wpm : (gameState === 'PLAYING' ? liveWpm : '—')}
                        </div>
                    </div>
                    <div className="text-center">
                        <div className="text-[10px] font-bold text-gray-600 uppercase tracking-widest mb-0.5">{t.metrics.accuracy}</div>
                        <div className={`text-2xl font-black tabular-nums ${gameState === 'FINISHED' ? (accuracy >= 95 ? 'text-green-400' : accuracy >= 80 ? 'text-yellow-400' : 'text-red-400') : 'text-white'}`}>
                            {gameState === 'FINISHED' ? `${accuracy}%` : '—'}
                        </div>
                    </div>
                    <div className="text-center">
                        <div className="text-[10px] font-bold text-gray-600 uppercase tracking-widest mb-0.5">{t.metrics.errors}</div>
                        <div className={`text-2xl font-black tabular-nums ${errors > 0 ? 'text-red-400' : 'text-white'}`}>
                            {errors}
                        </div>
                    </div>
                    <div className="text-center">
                        <div className="text-[10px] font-bold text-gray-600 uppercase tracking-widest mb-0.5">
                            {lang === 'ES' ? 'PROGRESO' : 'PROGRESS'}
                        </div>
                        <div className="text-2xl font-black tabular-nums text-gray-400">
                            {progress}%
                        </div>
                    </div>
                </div>
            </div>

            {/* Code Editor Area */}
            <div
                className="w-full relative min-h-[280px] p-7 rounded-2xl cursor-text transition-all duration-300"
                style={{
                    background: '#0d1117',
                    border: gameState === 'FINISHED'
                        ? '1px solid rgba(34,197,94,0.3)'
                        : '1px solid rgba(255,255,255,0.08)',
                    boxShadow: gameState === 'FINISHED'
                        ? '0 0 30px rgba(34,197,94,0.05)'
                        : '0 20px 60px rgba(0,0,0,0.5)',
                }}
                onClick={() => hiddenInputRef.current?.focus()}
            >
                {/* Fake editor chrome */}
                <div className="flex items-center space-x-1.5 mb-5 pb-4 border-b border-white/5">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-500/50" />
                    <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/50" />
                    <div className="w-2.5 h-2.5 rounded-full bg-green-500/50" />
                    <div className="ml-4 text-[11px] text-gray-600 font-mono">
                        {snippet.language === 'cpp' ? 'c++' : snippet.language}.snippet
                    </div>
                </div>

                <textarea
                    ref={hiddenInputRef}
                    value={input}
                    onChange={handleInputChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-default pointer-events-none resize-none"
                    autoFocus
                    spellCheck={false}
                    autoComplete="off"
                    autoCapitalize="off"
                />
                <pre className="code-font text-base md:text-lg leading-loose whitespace-pre-wrap select-none pointer-events-none">
                    {renderCode()}
                </pre>

                {/* Finished overlay */}
                {gameState === 'FINISHED' && (
                    <div className="absolute inset-0 flex items-center justify-center rounded-2xl"
                        style={{ background: 'rgba(13,17,23,0.85)', backdropFilter: 'blur(4px)' }}>
                        <div className="text-center">
                            <div className="text-4xl font-black text-white mb-1">{wpm} <span className="text-yellow-400">WPM</span></div>
                            <div className="text-gray-400 text-sm mb-5">
                                {accuracy}% {t.metrics.accuracy} · {errors} {t.metrics.errors}
                            </div>
                            <div className="flex space-x-3 justify-center">
                                <button
                                    onClick={startGame}
                                    className="px-5 py-2.5 rounded-xl font-bold text-sm text-black transition-all hover:scale-105 active:scale-95"
                                    style={{ background: 'linear-gradient(135deg, #eab308, #ca8a04)' }}
                                >
                                    {lang === 'ES' ? 'Intentar de nuevo' : 'Try Again'} ↺
                                </button>
                                <button
                                    onClick={() => setGameState('IDLE')}
                                    className="px-5 py-2.5 rounded-xl font-bold text-sm text-gray-300 transition-all hover:bg-white/10 border border-white/10"
                                >
                                    {t.controls.back}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Controls */}
            {gameState !== 'FINISHED' && (
                <div className="mt-5 flex items-center space-x-4">
                    <button
                        onClick={startGame}
                        className="flex items-center space-x-2 px-4 py-2 bg-white/5 hover:bg-white/8 border border-white/10 text-gray-400 hover:text-white text-sm rounded-lg transition-all"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                        </svg>
                        <span>{t.controls.restart}</span>
                    </button>
                    <p className="text-gray-700 text-xs">
                        {t.instructions.split('<0>').map((text, i) =>
                            i === 1
                                ? <kbd key={i} className="px-1.5 py-0.5 text-[10px] font-mono bg-white/8 border border-white/15 rounded text-gray-400">{text.split('</0>')[0]}</kbd>
                                : text.split('</0>').pop()
                        )}
                    </p>
                </div>
            )}
        </div>
    );
};