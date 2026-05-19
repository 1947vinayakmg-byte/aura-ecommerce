import { colors } from './colors';

export const theme = {
  colors,
  typography: {
    fontFamily: {
      sans: '"Poppins", ui-sans-serif, system-ui, sans-serif',
      serif: '"Playfair Display", serif',
      display: '"Montserrat", sans-serif'
    },
    letterSpacing: {
      widest: '0.4em',
      wider: '0.25em',
      tight: '0.05em'
    }
  },
  animation: {
    duration: {
      fast: 0.3,
      normal: 0.5,
      slow: 1.2
    },
    easing: {
      luxury: [0.16, 1, 0.3, 1]
    }
  },
  shadows: {
    gold: `0 0 30px ${colors.accents.glow}`,
    glass: '0 8px 32px 0 rgba(0, 0, 0, 0.37)'
  }
};
