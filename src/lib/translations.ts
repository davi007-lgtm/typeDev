export const translations = {
    EN: {
        hero: {
            beta: "Choose your language",
            welcome: "Welcome to",
            title: "TypeDev",
            description: "The typing trainer designed for <0>developers</0>. Master your syntax, increase your speed, and code with precision.",
            button: "Start Typing Test",
            feature_1: { title: "Real Code", desc: "No random words. Practice with JS, Python, and Kotlin snippets." },
            feature_2: { title: "Syntax Aware", desc: "True syntax highlighting that reacts to your typing." },
            feature_3: { title: "Deep Metrics", desc: "Track WPM, accuracy, and error hotspots over time." }
        },
        game: {
            metrics: {
                language: "Language",
                wpm: "WPM",
                accuracy: "Accuracy",
                errors: "Errors"
            },
            controls: {
                restart: "Restart (ESC)",
                back: "Back to Home"
            },
            instructions: "Start typing to begin the test. Press <0>TAB</0> + <0>Enter</0> to restart."
        }
    },
    ES: {
        hero: {
            beta: "Elije tu lenguaje",
            welcome: "Bienvenido a",
            title: "TypeDev",
            description: "El entrenador de mecanografía diseñado para <0>desarrolladores</0>. Domina tu sintaxis, aumenta tu velocidad y programa con precisión.",
            button: "Iniciar Prueba de Velocidad",
            feature_1: { title: "Código Real", desc: "Sin palabras aleatorias. Practica con JS, Python, y Kotlin." },
            feature_2: { title: "Sintaxis Real", desc: "Resaltado de sintaxis real que reacciona a tu escritura." },
            feature_3: { title: "Métricas Reales", desc: "Mide tu WPM, precisión y puntos críticos de error." }
        },
        game: {
            metrics: {
                language: "Lenguaje",
                wpm: "WPM",
                accuracy: "Precisión",
                errors: "Errores"
            },
            controls: {
                restart: "Reiniciar (ESC)",
                back: "Volver al Inicio"
            },
            instructions: "Empieza a escribir para iniciar la prueba. Pulsa <0>TAB</0> + <0>Enter</0> para reiniciar."
        }
    }
};

export type TranslationType = typeof translations.EN;
