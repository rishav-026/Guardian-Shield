export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#FFF4F0',
          500: '#FF6B35',
          600: '#E85A28',
        },
        navy: {
          500: '#004E89',
          900: '#001F3D',
        },
        success: '#00B894',
        warning: '#FDCB6E',
        danger: '#E74C3C',
        dark: '#2C3E50',
        light: '#ECF0F1',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
    },
  },
  plugins: [],
}
