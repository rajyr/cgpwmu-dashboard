/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                unicef: {
                    blue: '#005DAA',
                    light: '#E6EFF6'
                },
                saffron: '#FF9933',
                success: '#28A745',
                alert: '#DC3545',
                background: '#F4F7F6',
                surface: '#FFFFFF'
            },
            fontFamily: {
                sans: ['Inter', 'Roboto', 'sans-serif'],
                hindi: ['Mukta', 'Poppins', 'sans-serif']
            }
        },
    },
    plugins: [],
}
