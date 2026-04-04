/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,jsx,ts,tsx}', './src/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        // Terraria UI palette
        bg: {
          primary: '#1a1a2e',   // deep navy — main background
          secondary: '#16213e', // darker navy — cards/panels
          surface: '#0f3460',   // mid blue — elevated surfaces
        },
        brand: {
          gold: '#e8b84b',      // Terraria gold — primary accent
          silver: '#c0c0c0',    // silver text
        },
        rarity: {
          gray: '#828282',      // Tier 0 (gray)
          white: '#ffffff',     // Tier 1
          blue: '#9696ff',      // Tier 2
          green: '#96ff96',     // Tier 3
          orange: '#ffa500',    // Tier 4
          lightRed: '#ff9696',  // Tier 5
          pink: '#ff96ff',      // Tier 6
          lime: '#d2ff00',      // Tier 7
          yellow: '#ffff00',    // Tier 8
          cyan: '#05c3dd',      // Tier 9
          red: '#ff2020',       // Tier 10
          purple: '#b220ff',    // Tier 11 (developer)
        },
      },
      fontFamily: {
        terraria: ['AndyBold', 'serif'],
      },
    },
  },
  plugins: [],
};
