import defaultTheme from 'tailwindcss/defaultTheme';
import forms from '@tailwindcss/forms';
import colors from 'tailwindcss/colors';

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
        './storage/framework/views/*.php',
        './resources/views/**/*.blade.php',
        './resources/js/**/*.jsx',
    ],

    theme: {
        extend: {
            fontFamily: {
                sans: ['"IBM Plex Sans"', ...defaultTheme.fontFamily.sans],
                oswald: ['Oswald', 'sans-serif'],
                mono: ['"IBM Plex Mono"', ...defaultTheme.fontFamily.mono],
            },
            colors: {
                brand: colors.blue,
                // Background & Surface
                bg: '#F3EFE6',
                panel: '#FBF9F4',
                // Text
                ink: {
                    DEFAULT: '#211D1A',
                    soft: '#6B655C',
                },
                // Borders
                line: '#DCD3BF',
                // Brand/UI structural
                navy: '#29394A',
                // Semantic / Status
                accent: '#2F6F62', // Teal
                gold: '#C9962B',
                danger: '#A8402F',
                purple: '#8A6A9E',
            },
            borderRadius: {
                'panel': '4px',
                'badge': '20px',
            },
            borderWidth: {
                'accent': '1.5px',
            },
            boxShadow: {
                'soft': '0 4px 20px -2px rgba(0, 0, 0, 0.05)',
                'card': '0 0 0 1px rgba(0,0,0,.03), 0 2px 4px rgba(0,0,0,.04), 0 12px 24px rgba(0,0,0,.04)',
            }
        },
    },

    plugins: [forms],
};
