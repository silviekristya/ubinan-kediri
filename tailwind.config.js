import defaultTheme from 'tailwindcss/defaultTheme';
import forms from '@tailwindcss/forms';

/** @type {import('tailwindcss').Config} */
export default {
    darkMode: ['class'],
    content: [
        './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
        './storage/framework/views/*.php',
        './resources/views/**/*.blade.php',
        './resources/js/**/*.tsx',
    ],

    theme: {
    	extend: {
    		fontFamily: {
    			sans: ['Figtree', ...defaultTheme.fontFamily.sans]
    		},
    		colors: {
    			background: 'hsl(var(--background))',
    			foreground: 'hsl(var(--foreground))',
    			card: {
    				DEFAULT: 'hsl(var(--card))',
    				foreground: 'hsl(var(--card-foreground))'
    			},
    			popover: {
    				DEFAULT: 'hsl(var(--popover))',
    				foreground: 'hsl(var(--popover-foreground))'
    			},
    			primary: {
    				DEFAULT: 'hsl(var(--primary))',
    				foreground: 'hsl(var(--primary-foreground))'
    			},
    			secondary: {
    				DEFAULT: 'hsl(var(--secondary))',
    				foreground: 'hsl(var(--secondary-foreground))'
    			},
    			muted: {
    				DEFAULT: 'hsl(var(--muted))',
    				foreground: 'hsl(var(--muted-foreground))'
    			},
    			accent: {
    				DEFAULT: 'hsl(var(--accent))',
    				foreground: 'hsl(var(--accent-foreground))'
    			},
    			destructive: {
    				DEFAULT: 'hsl(var(--destructive))',
    				foreground: 'hsl(var(--destructive-foreground))'
    			},
    			border: 'hsl(var(--border))',
    			input: 'hsl(var(--input))',
    			ring: 'hsl(var(--ring))',
    			chart: {
    				'1': 'hsl(var(--chart-1))',
    				'2': 'hsl(var(--chart-2))',
    				'3': 'hsl(var(--chart-3))',
    				'4': 'hsl(var(--chart-4))',
    				'5': 'hsl(var(--chart-5))'
    			},

                // Custom colors
                'white-bps': '#ffffff',
    			'white-bps-dark': '#f1f5f9',
    			'gray-bps-dark': '#71717a',
    			'gray-bps-light': '#f4f4f5',
    			'gray-bps': '#1f293799',
    			'black-bps': '#2b3440',
    			'black-bps-dark': '#000000',
    			'orange-bps-dark': '#e98877',
    			'orange-bps-medium': '#ec967b',
    			'orange-bps-light': '#efa37d',
    			'orange-bps-very-light': '#f3bd81',
    			'blue-bps-dark': '#0e5faa',
    			'blue-bps-medium': '#2877b9',
    			'blue-bps-light': '#4890ca',
    			'blue-bps-very-light': '#89c0e8',
    			'green-bps-dark': '#1e5d58',
    			'green-bps-medium': '#30765e',
    			'green-bps-light': '#55a668',
    			'green-bps-very-light': '#69bf6e',
    			'whatsapp-green': '#25d366',
    			'youtube-red': '#FF0000',
    			'youtube-dark': '#282828',
    		},
    		borderRadius: {
    			lg: 'var(--radius)',
    			md: 'calc(var(--radius) - 2px)',
    			sm: 'calc(var(--radius) - 4px)'
    		}
    	}
    },

    plugins: [forms, require("tailwindcss-animate")],
};
