/**
 * Design Tokens - Spacing
 * Consistent spacing scale for margins, padding, and layout
 */

export const spacing = {
  // Base unit (4px)
  0: '0',
  0.5: '0.125rem', // 2px
  1: '0.25rem',    // 4px
  1.5: '0.375rem', // 6px
  2: '0.5rem',     // 8px
  2.5: '0.625rem', // 10px
  3: '0.75rem',    // 12px
  3.5: '0.875rem', // 14px
  4: '1rem',       // 16px
  5: '1.25rem',    // 20px
  6: '1.5rem',     // 24px
  7: '1.75rem',    // 28px
  8: '2rem',       // 32px
  9: '2.25rem',    // 36px
  10: '2.5rem',    // 40px
  12: '3rem',      // 48px
  14: '3.5rem',    // 56px
  16: '4rem',      // 64px
  18: '4.5rem',    // 72px
  20: '5rem',      // 80px
  24: '6rem',      // 96px
  28: '7rem',      // 112px
  32: '8rem',      // 128px
  36: '9rem',      // 144px
  40: '10rem',     // 160px
  44: '11rem',     // 176px
  48: '12rem',     // 192px
  52: '13rem',     // 208px
  56: '14rem',     // 224px
  60: '15rem',     // 240px
  64: '16rem',     // 256px
  72: '18rem',     // 288px
  80: '20rem',     // 320px
  96: '24rem',     // 384px
} as const

// Semantic spacing aliases for common use cases
export const semanticSpacing = {
  // Layout spacing
  container: {
    padding: spacing[8],
    margin: spacing[0],
  },

  // Component spacing
  component: {
    padding: {
      small: spacing[3],
      medium: spacing[4],
      large: spacing[6],
    },
    margin: {
      small: spacing[2],
      medium: spacing[4],
      large: spacing[6],
    },
    gap: {
      small: spacing[2],
      medium: spacing[4],
      large: spacing[6],
    },
  },

  // Typography spacing
  typography: {
    lineHeight: {
      tight: 1.25,
      normal: 1.5,
      relaxed: 1.625,
    },
    letterSpacing: {
      tight: '-0.025em',
      normal: '0',
      wide: '0.025em',
    },
  },

  // Border radius
  borderRadius: {
    none: spacing[0],
    small: spacing[1],
    medium: spacing[2],
    large: spacing[3],
    full: '9999px',
  },

  // Shadows
  shadow: {
    small: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    medium: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
    large: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
    xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
  },
} as const
