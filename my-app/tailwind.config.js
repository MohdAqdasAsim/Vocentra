/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./app/(tabs)/**/*.{js,jsx,ts,tsx}",
    "./app/pages/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
    "./app/index.tsx"
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      fontFamily: {
        'heartful': ['Heartful', 'sans-serif']
      },
      colors: {
        // Light theme colors
        lightBackground: '#FFFFFF',
        lightText: '#1F2937',
        lightPrimary: '#3B82F6',
        lightSecondary: '#22C55E',
        lightAccent: '#F59E0B',
        lightMuted: '#E5E7EB',
        lightDanger: '#EF4444',
        lightSuccess: '#10B981',
        lightInfo: '#3B82F6',
        lightWarning: '#FACC15',
        lightCard: '#F9FAFB',
        lightBorder: '#D1D5DB',

        // Dark theme colors
        darkBackground: '#1F2937',
        darkText: '#FFFFFF',
        darkPrimary: '#6366F1',
        darkSecondary: '#4ADE80',
        darkAccent: '#FBBF24',
        darkMuted: '#374151',
        darkDanger: '#F87171',
        darkSuccess: '#22C55E',
        darkInfo: '#60A5FA',
        darkWarning: '#FDE047',
        darkCard: '#111827',
        darkBorder: '#4B5563',

        // Additional shared colors
        neutralGray: '#9CA3AF',
        highlightYellow: '#FDE68A',
        softBlue: '#BFDBFE',
        vividPurple: '#A78BFA',
        deepOrange: '#FB923C',
        oceanTeal: '#2DD4BF',
        forestGreen: '#15803D',
      },
    },
  },
  plugins: [],
};
