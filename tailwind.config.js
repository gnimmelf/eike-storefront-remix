const colors = require('tailwindcss/colors');

module.exports = {
    // content: ["./app/**/*.{js,ts,jsx,tsx}"],
    // theme: {
    //   extend: {},
    // },
    plugins: [require('@tailwindcss/forms')],
    mode: 'jit',
    content: ['./app/**/*.{ts,tsx}'],
    important: '#app',

    theme: {
        extend: {
            colors: {
                primary: colors.amber,
                secondary: colors.green,
                brand: {
                    // Text
                    'pohutukawa': '#5a1414ff',
                    'harvest': '#877028ff',
                    'chardon': '#f8ede2ff',
                    // :hover
                    'pohutukawa_hover': '#7C5418',
                    'harvest_hover': '#9B7C2E',
                    'chardon_hover': '#fff',
                    // Backgrounds
                    'taupe': '#91625cff',
                    'whiskey': '#cf8c53ff',
                    'shell': '#d0b3a7ff',
                    'solitude': '#d3dce6'
                }
            },
            animation: {
                dropIn: 'dropIn 0.2s ease-out',
            },
            keyframes: {
                dropIn: {
                    '0%': { transform: 'translateY(-100px)' },
                    '100%': { transform: 'translateY(0)' },
                },
            },
        },
    },
};
