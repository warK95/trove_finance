import type { Config } from 'tailwindcss';

// Every color below is copied verbatim from the "Trove v3" palette in
// the assessment brief. Nothing here is invented - see README.md for
// the one deliberate exception (the "pending" badge color, which the
// palette doesn't define).
const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#059A83', // Buttons, active states, links
          light: '#E0F5E1', // Badges, subtle backgrounds
        },
        success: '#10AE17', // Positive returns, gains
        negative: '#BF221C', // Negative returns, losses, errors
        canvas: '#FBFBFB', // Page background (in-app working area)
        card: '#FFFFFF', // Card backgrounds
        page: '#F5F1EE', // Outer page background
        surfaceMuted: '#F2F6F6', // Input backgrounds, neutral fills
        ink: {
          DEFAULT: '#13342F', // Headings, primary text
          neutral: '#687D7A', // Labels, secondary text
          disabled: '#92A29F', // Placeholders, muted text
        },
        border: '#DBDFDF', // Card borders, dividers
        accentBlue: '#00B6DF', // Highlights, info states
        accentPurple: '#7B79C9', // Chart segments
        accentCream: '#F2C891', // Chart segments
        darkBlue: '#00323D', // Dark backgrounds
      },
      borderRadius: {
        card: '16px',
      },
      fontFamily: {
        // System font stack: zero external network dependency at
        // build or runtime (see README - next/font/google requires a
        // build-time fetch that isn't guaranteed to succeed in every
        // environment), and explicitly one of the three typefaces the
        // brief allows ("Inter, DM Sans, or system default"). Renders
        // as San Francisco on macOS/iOS, Segoe UI on Windows, Roboto
        // on Android - all clean, neutral sans-serifs well suited to
        // a data-dense fintech UI.
        sans: [
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'Roboto',
          'Helvetica Neue',
          'Arial',
          'sans-serif',
        ],
      },
      keyframes: {
        pulseSoft: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.55' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(6px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        pulseSoft: 'pulseSoft 1.6s ease-in-out infinite',
        fadeInUp: 'fadeInUp 0.3s ease-out',
      },
    },
  },
  plugins: [],
};

export default config;
