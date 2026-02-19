import React, { useState, useEffect, useRef } from 'react';
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
    const [endTime, setEndTime] = useState<number | null>(null);
    const [errors, setErrors] = useState(0);
    const [wpm, setWpm] = useState(0);
    const [accuracy, setAccuracy] = useState(100);

    const hiddenInputRef = useRef<HTMLTextAreaElement>(null);

    // Initialize snippet based on language
    useEffect(() => {
        const filtered = SNIPPETS.filter(s => s.language === language);
        setSnippet(filtered[Math.floor(Math.random() * filtered.length)]);
        resetGameData();
        setGameState('IDLE');
    }, [language]);

    const resetGameData = () => {
        setInput('');
        setStartTime(null);
        setEndTime(null);
        setErrors(0);
        setWpm(0);
        setAccuracy(100);
    };

    const startGame = () => {
        resetGameData();
        setGameState('PLAYING');
        setTimeout(() => hiddenInputRef.current?.focus(), 10);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        if (gameState === 'FINISHED') return;

        const value = e.target.value;

        // Start timer on first character
        if (!startTime && value.length > 0) {
            setStartTime(Date.now());
            setGameState('PLAYING');
        }

        // Only allow input up to snippet length
        if (value.length <= snippet.code.length) {
            // Check for new error
            if (value.length > input.length) {
                const lastChar = value[value.length - 1];
                const expectedChar = snippet.code[value.length - 1];
                if (lastChar !== expectedChar) {
                    setErrors(prev => prev + 1);
                }
            }

            setInput(value);

            // Finish condition
            if (value.length === snippet.code.length) {
                finishGame();
            }
        }
    };

    const finishGame = () => {
        const end = Date.now();
        setEndTime(end);
        setGameState('FINISHED');

        // Final calculations
        if (startTime) {
            const timeInSec = (end - startTime) / 1000;
            const timeInMin = timeInSec / 60;
            const words = snippet.code.length / 5;
            const calculatedWpm = Math.round(words / timeInMin);
            const calculatedAccuracy = Math.round(((snippet.code.length - errors) / snippet.code.length) * 100);

            setWpm(calculatedWpm);
            setAccuracy(Math.max(0, calculatedAccuracy));
        }
    };

    const renderCode = () => {
        return snippet.code.split('').map((char, index) => {
            let status = 'neutral';
            if (index < input.length) {
                status = input[index] === char ? 'correct' : 'incorrect';
            } else if (index === input.length) {
                status = 'current';
            }

            return (
                <span
                    key={index}
                    className={`
            relative inline transition-colors duration-100
            ${status === 'correct' ? 'text-gray-100' : ''}
            ${status === 'incorrect' ? 'text-red-500 bg-red-500/10' : ''}
            ${status === 'neutral' ? 'text-gray-600' : ''}
            ${status === 'current' ? 'after:content-[""] after:absolute after:bottom-[-2px] after:left-0 after:w-full after:h-[2px] after:bg-yellow-500 after:animate-pulse text-yellow-400' : ''}
          `}
                >
                    {char === '\n' ? '↵\n' : char}
                </span>
            );
        });
    };

    if (gameState === 'IDLE') {
        return (
            <div className="w-full pb-20">
                <Hero onStart={startGame} />
                <div className="mt-4 flex justify-center">
                    <LanguageSelector currentLang={language} onChange={setLanguage} />
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto py-12 px-4 flex flex-col items-center">
            {/* Metrics Row */}
            <div className="w-full flex justify-between items-center mb-8 px-6 py-4 bg-white/5 border border-white/10 rounded-2xl">
                <div className="flex items-center space-x-4">
                    <button
                        onClick={() => setGameState('IDLE')}
                        className="p-2 hover:bg-white/10 rounded-lg transition-colors text-gray-400 hover:text-white"
                        title={t.controls.back}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                        </svg>
                    </button>
                    <div className="w-[1px] h-8 bg-white/10"></div>
                    <div className="space-y-1">
                        <div className="text-xs font-bold text-gray-500 uppercase tracking-widest">{t.metrics.language}</div>
                        <div className="text-yellow-500 font-bold capitalize">{snippet.language}</div>
                    </div>
                </div>
                <div className="flex space-x-12">
                    <div className="text-center">
                        <div className="text-xs font-bold text-gray-500 uppercase tracking-widest">{t.metrics.wpm}</div>
                        <div className="text-3xl font-black text-white">{gameState === 'FINISHED' ? wpm : '...'}</div>
                    </div>
                    <div className="text-center">
                        <div className="text-xs font-bold text-gray-500 uppercase tracking-widest">{t.metrics.accuracy}</div>
                        <div className="text-3xl font-black text-white">{gameState === 'FINISHED' ? `${accuracy}%` : '...'}</div>
                    </div>
                    <div className="text-center">
                        <div className="text-xs font-bold text-gray-500 uppercase tracking-widest">{t.metrics.errors}</div>
                        <div className="text-3xl font-black text-red-500">{errors}</div>
                    </div>
                </div>
            </div>

            {/* Code Editor Area */}
            <div
                className="w-full relative min-h-[300px] p-8 bg-[#0d1117] border border-white/10 rounded-2xl cursor-text active:border-yellow-500/50 transition-all shadow-2xl"
                onClick={() => hiddenInputRef.current?.focus()}
            >
                <textarea
                    ref={hiddenInputRef}
                    value={input}
                    onChange={handleInputChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-default pointer-events-none"
                    autoFocus
                    spellCheck={false}
                    autoComplete="off"
                    autoCapitalize="off"
                />
                <pre className="code-font text-lg md:text-xl leading-relaxed whitespace-pre-wrap select-none pointer-events-none">
                    {renderCode()}
                </pre>
            </div>

            {/* Controls */}
            <div className="mt-8 flex space-x-4">
                <button
                    onClick={startGame}
                    className="px-6 py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-lg transition-all"
                >
                    {t.controls.restart}
                </button>
                {gameState === 'FINISHED' && (
                    <button
                        onClick={() => setGameState('IDLE')}
                        className="px-6 py-2 bg-yellow-500 text-black font-bold rounded-lg hover:bg-yellow-400 transition-all"
                    >
                        {t.controls.back}
                    </button>
                )}
            </div>

            {/* Instructions */}
            <p className="mt-8 text-gray-500 text-sm">
                {t.instructions.split('<0>').map((text, i) =>
                    i === 1 ? <span key={i} className="text-white">{text.split('</0>')[0]}</span> : text.split('</0>').pop()
                )}
            </p>
        </div>
    );
};
