/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                // Dark theme colors
                dark: {
                    bg: {
                        primary: '#0f172a',
                        secondary: '#1a1f3a',
                        tertiary: '#252d47',
                    },
                    text: {
                        primary: '#f8fafc',
                        secondary: '#cbd5e1',
                        tertiary: '#94a3b8',
                    },
                    border: '#334155',
                    'border-focus': '#3b82f6',
                },
                accent: {
                    primary: '#3b82f6',
                    secondary: '#10b981',
                    tertiary: '#f59e0b',
                    danger: '#ef4444',
                },
                // Legacy colors for compatibility
                primary: '#3B82F6',
                secondary: '#8B5CF6',
                success: '#10B981',
                warning: '#F59E0B',
                error: '#EF4444',
            },
            fontFamily: {
                sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
                display: ['Plus Jakarta Sans', 'sans-serif'],
                mono: ['JetBrains Mono', 'ui-monospace', 'monospace'],
            },
            spacing: {
                xs: '4px',
                sm: '8px',
                md: '12px',
                lg: '16px',
                xl: '24px',
                '2xl': '32px',
                '3xl': '48px',
            },
            backdropBlur: {
                xs: '2px',
                sm: '4px',
                md: '8px',
                lg: '16px',
            },
            animation: {
                pulse: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                spin: 'spin 1s linear infinite',
                'pulse-subtle': 'pulse-subtle 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                'slide-up': 'slide-up 0.3s ease-out',
                'fade-in': 'fade-in 0.2s ease-out',
            },
            keyframes: {
                'pulse-subtle': {
                    '0%, 100%': { opacity: '1' },
                    '50%': { opacity: '0.8' },
                },
                'slide-up': {
                    '0%': { transform: 'translateY(10px)', opacity: '0' },
                    '100%': { transform: 'translateY(0)', opacity: '1' },
                },
                'fade-in': {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
            },
            boxShadow: {
                'sm': '0 1px 2px 0 rgba(15, 23, 42, 0.05)',
                'base': '0 1px 3px 0 rgba(15, 23, 42, 0.1), 0 1px 2px 0 rgba(15, 23, 42, 0.06)',
                'md': '0 4px 6px -1px rgba(15, 23, 42, 0.1), 0 2px 4px -1px rgba(15, 23, 42, 0.06)',
                'lg': '0 10px 15px -3px rgba(15, 23, 42, 0.1), 0 4px 6px -2px rgba(15, 23, 42, 0.05)',
                'glow': '0 0 20px rgba(59, 130, 246, 0.5)',
            },
        },
    },
    plugins: [],
}
