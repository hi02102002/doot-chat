/** @type {import('tailwindcss').Config} */
module.exports = {
   content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
   darkMode: 'class',
   theme: {
      extend: {
         colors: {
            primary: 'var(--bs-primary)',
            'body-color': 'var(--bs-body-color)',
            'body-bg': 'var(--bs-body-bg)',
            blue: 'var(--bs-blue)',
            red: 'var(--bs-red)',
            orange: 'var(--bs-orange)',
            yellow: 'var(--bs-yellow)',
            green: 'var(--bs-green)',
            teal: 'var(--bs-teal)',
            cyan: 'var(--bs-cyan)',
            white: 'var(--bs-white)',
            gray: 'var(--bs-gray)',
            'gray-dark': 'var(--bs-gray-dark)',
            'bs-gray-100': 'var(--bs-gray-100)',
            'bs-gray-200': 'var(--bs-gray-200)',
            'bs-gray-300': 'var(--bs-gray-300)',
            'bs-gray-400': 'var(--bs-gray-400)',
            'bs-gray-500': 'var(--bs-gray-500)',
            'bs-gray-600': 'var(--bs-gray-600)',
            'bs-gray-700': 'var(--bs-gray-700)',
            'bs-gray-800': 'var(--bs-gray-800)',
            'bs-gray-900': 'var(--bs-gray-900)',
            secondary: 'var(--bs-secondary)',
            success: 'var(--bs-success)',
            info: 'var(--bs-info)',
            warning: 'var(--bs-warning)',
            danger: 'var(--bs-danger)',
            purple: 'var(--bs-purple)',
            pink: 'var(--bs-pink)',
            light: 'var(--bs-light)',
            indigo: 'var(--bs-indigo)',
            dark: 'var(--bs-dark)',
         },
         spacing: {
            header: '60px',
         },
         keyframes: {
            dots: {
               ' 0%, 20% ': {
                  color: 'rgba(0,0,0,0)',
                  'text-shadow':
                     ' .25em 0 0 rgba(0,0,0,0),.5em 0 0 rgba(0,0,0,0)',
               },
               '40%': {
                  color: 'white',
                  ' text-shadow':
                     ' .25em 0 0 rgba(0,0,0,0),.5em 0 0 rgba(0,0,0,0)',
               },
               '60%': {
                  'text-shadow': '.25em 0 0 white,.5em 0 0 rgba(0,0,0,0)',
               },
               '80%, 100%': {
                  'text-shadow': '.25em 0 0 white,.5em 0 0 white',
               },
            },
         },
         animation: {
            dots: 'dots 1s steps(5, end) infinite',
         },
      },
   },
   plugins: [],
};
