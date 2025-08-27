import { Global, css } from '@emotion/react'
import styled from '@emotion/styled'
import { type ReactNode } from 'react'

import { colors, spacing, typography } from './tokens'

/**
 * Global Styles
 * Applies design system styles globally
 */
const globalStyles = css`
  /* CSS Reset and base styles */
  *,
  *::before,
  *::after {
    box-sizing: border-box;
  }

  * {
    margin: 0;
  }

  body {
    line-height: 1.5;
    -webkit-font-smoothing: antialiased;
  }

  img,
  picture,
  video,
  canvas,
  svg {
    display: block;
    max-width: 100%;
  }

  input,
  button,
  textarea,
  select {
    font: inherit;
  }

  p,
  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    overflow-wrap: break-word;
  }

  #root,
  #__next {
    isolation: isolate;
  }

  /* Design System Base Styles */
  html {
    font-family: ${typography.fontFamily.sans};
    font-size: 16px;
    line-height: ${typography.lineHeight.normal};
    color: ${colors.text.primary};
    background: ${colors.background.primary};
  }

  body {
    font-family: ${typography.fontFamily.sans};
    font-size: ${typography.fontSize.base};
    font-weight: ${typography.fontWeight.normal};
    line-height: ${typography.lineHeight.relaxed};
    color: ${colors.text.primary};
    background: ${colors.background.primary};
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  /* Heading styles */
  h1, h2, h3, h4, h5, h6 {
    font-family: ${typography.fontFamily.sans};
    font-weight: ${typography.fontWeight.semibold};
    line-height: ${typography.lineHeight.snug};
    letter-spacing: ${typography.letterSpacing.tight};
    color: ${colors.text.primary};
    margin: 0 0 ${spacing[4]} 0;
  }

  h1 { font-size: ${typography.fontSize['5xl']}; }
  h2 { font-size: ${typography.fontSize['4xl']}; }
  h3 { font-size: ${typography.fontSize['3xl']}; }
  h4 { font-size: ${typography.fontSize['2xl']}; }
  h5 { font-size: ${typography.fontSize.xl}; }
  h6 { font-size: ${typography.fontSize.lg}; }

  /* Paragraph styles */
  p {
    margin: 0 0 ${spacing[4]} 0;
    line-height: ${typography.lineHeight.relaxed};
  }

  /* Link styles */
  a {
    color: ${colors.primary[500]};
    text-decoration: none;
    transition: color 0.2s ease;
  }

  a:hover {
    color: ${colors.primary[600]};
  }

  a:focus {
    outline: 2px solid ${colors.primary[300]};
    outline-offset: 2px;
  }

  /* Button reset */
  button {
    font: inherit;
    background: none;
    border: none;
    cursor: pointer;
  }

  /* Form elements */
  input, textarea, select {
    font: inherit;
    color: inherit;
    background: ${colors.white};
    border: 1px solid ${colors.border.medium};
    border-radius: ${spacing[2]};
    padding: ${spacing[2]} ${spacing[3]};
    transition: border-color 0.2s ease, box-shadow 0.2s ease;
  }

  input:focus, textarea:focus, select:focus {
    outline: none;
    border-color: ${colors.primary[500]};
    box-shadow: 0 0 0 3px ${colors.primary[100]};
  }

  /* Code styles */
  code {
    font-family: ${typography.fontFamily.mono};
    font-size: 0.875em;
    color: ${colors.error[600]};
    background: ${colors.gray[100]};
    padding: ${spacing[0.5]} ${spacing[1]};
    border-radius: ${spacing[1]};
  }

  pre {
    font-family: ${typography.fontFamily.mono};
    background: ${colors.gray[900]};
    color: ${colors.gray[100]};
    padding: ${spacing[4]};
    border-radius: ${spacing[2]};
    overflow-x: auto;
    margin: ${spacing[4]} 0;

    & code {
      background: transparent;
      padding: 0;
      color: inherit;
    }
  }

  /* Utility classes */
  .sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
  }
`

/**
 * Theme Provider Component
 * Wraps the app with global styles and design system context
 */
interface ThemeProviderProps {
  children: ReactNode
}

export const ThemeProvider = ({ children }: ThemeProviderProps) => {
  return (
    <>
      <Global styles={globalStyles} />
      {children}
    </>
  )
}

/**
 * Theme Container
 * A container component that applies theme-aware styling
 */
export const ThemeContainer = styled.div`
  font-family: ${typography.fontFamily.sans};
  color: ${colors.text.primary};
  background: ${colors.background.primary};
  min-height: 100vh;
`
