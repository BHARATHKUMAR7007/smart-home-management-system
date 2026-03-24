/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                'dashboard-bg': '#0f172a', // standard slate-900 / dark blue
                'card-bg': '#1e293b',     // standard slate-800
                'sidebar-bg': '#0f172a',
                'accent-cyan': '#22d3ee', // primary cyan highlight color
            },
            boxShadow: {
                'glow': '0 0 15px rgba(34, 211, 238, 0.5)',
            }
        },
    },
    plugins: [],
}
