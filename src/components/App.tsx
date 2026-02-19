import React from 'react';
import { LanguageProvider } from './LanguageContext';
import { TypingGame } from './TypingGame';

// We need a wrapper because I18nSelector and TypingGame need to share the same context
export const App: React.FC = () => {
    return (
        <LanguageProvider>
            <TypingGame />
        </LanguageProvider>
    );
};
