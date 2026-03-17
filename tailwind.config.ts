import type { Config } from 'tailwindcss';

const config: Config = {
    content: [
        './pages/**/*.{js,ts,jsx,tsx,mdx}',
        './components/**/*.{js,ts,jsx,tsx,mdx}',
        './app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        extend: {
            colors: {
                bg: {
                    primary: 'var(--bg-primary)',
                    secondary: 'var(--bg-secondary)',
                    elevated: 'var(--bg-elevated)',
                },
                accent: {
                    DEFAULT: 'var(--accent)',
                    glow: 'var(--accent-glow)',
                },
                text: {
                    primary: 'var(--text-primary)',
                    secondary: 'var(--text-secondary)',
                },
                border: 'var(--border)',
            },
            fontFamily: {
                display: ['var(--font-cormorant)', 'serif'],
                body: ['var(--font-dm-sans)', 'sans-serif'],
                mono: ['var(--font-jetbrains)', 'monospace'],
            },
            animation: {
                'typewriter-cursor': 'blink 1s step-end infinite',
                shimmer: 'shimmer 3s ease-in-out infinite',
                'marquee-left': 'marquee-left 30s linear infinite',
                'marquee-right': 'marquee-right 30s linear infinite',
                'pulse-ring': 'pulse-ring 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                'float': 'float 6s ease-in-out infinite',
                'spin-slow': 'spin 12s linear infinite',
                'scroll-hint': 'scroll-hint 2s ease-in-out infinite',
            },
            keyframes: {
                blink: {
                    '0%, 100%': { opacity: '1' },
                    '50%': { opacity: '0' },
                },
                shimmer: {
                    '0%': { backgroundPosition: '-200% center' },
                    '100%': { backgroundPosition: '200% center' },
                },
                'marquee-left': {
                    '0%': { transform: 'translateX(0%)' },
                    '100%': { transform: 'translateX(-50%)' },
                },
                'marquee-right': {
                    '0%': { transform: 'translateX(-50%)' },
                    '100%': { transform: 'translateX(0%)' },
                },
                'pulse-ring': {
                    '0%': { transform: 'scale(0.8)', opacity: '1' },
                    '100%': { transform: 'scale(2.5)', opacity: '0' },
                },
                float: {
                    '0%, 100%': { transform: 'translateY(0px)' },
                    '50%': { transform: 'translateY(-20px)' },
                },
                'scroll-hint': {
                    '0%, 100%': { transform: 'translateY(0)', opacity: '0.5' },
                    '50%': { transform: 'translateY(8px)', opacity: '1' },
                },
            },
        },
    },
    plugins: [],
};

export default config;
