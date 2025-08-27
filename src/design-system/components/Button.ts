import styled from '@emotion/styled'

import { colors, semanticColors, spacing, typography } from '../tokens'

export interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'error'
  size?: 'small' | 'medium' | 'large'
  disabled?: boolean
  fullWidth?: boolean
}

/**
 * Base Button Component
 * Reusable button with consistent styling and variants
 */
export const Button = styled.button<ButtonProps>`
  /* Base styles */
  font-family: ${typography.fontFamily.sans};
  font-size: ${typography.fontSize.sm};
  font-weight: ${typography.fontWeight.medium};
  line-height: ${typography.lineHeight.none};
  letter-spacing: ${typography.letterSpacing.wide};

  border: none;
  border-radius: ${spacing[2]};
  cursor: pointer;
  transition: all 0.2s ease;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;

  /* Size variants */
  ${({ size = 'medium' }) => {
    switch (size) {
      case 'small':
        return `
          padding: ${spacing[2]} ${spacing[3]};
          font-size: ${typography.fontSize.xs};
        `
      case 'large':
        return `
          padding: ${spacing[3]} ${spacing[6]};
          font-size: ${typography.fontSize.base};
        `
      default: // medium
        return `
          padding: ${spacing[2.5]} ${spacing[4]};
          font-size: ${typography.fontSize.sm};
        `
    }
  }}

  /* Full width */
  ${({ fullWidth }) => fullWidth && 'width: 100%;'}

  /* Variant styles */
  ${({ variant = 'primary', disabled }) => {
    if (disabled) {
      return `
        background: ${colors.gray[300]};
        color: ${colors.gray[500]};
        cursor: not-allowed;

        &:hover {
          background: ${colors.gray[300]};
          color: ${colors.gray[500]};
        }
      `
    }

    switch (variant) {
      case 'secondary':
        return `
          background: ${colors.white};
          color: ${semanticColors.primary};
          border: 1px solid ${semanticColors.primary};

          &:hover {
            background: ${colors.primary[50]};
            border-color: ${colors.primary[600]};
            color: ${colors.primary[600]};
          }

          &:active {
            background: ${colors.primary[100]};
          }
        `
      case 'success':
        return `
          background: ${semanticColors.success};
          color: ${colors.white};

          &:hover {
            background: ${colors.success[600]};
          }

          &:active {
            background: ${colors.success[700]};
          }
        `
      case 'warning':
        return `
          background: ${semanticColors.warning};
          color: ${colors.white};

          &:hover {
            background: ${colors.warning[600]};
          }

          &:active {
            background: ${colors.warning[700]};
          }
        `
      case 'error':
        return `
          background: ${semanticColors.error};
          color: ${colors.white};

          &:hover {
            background: ${colors.error[600]};
          }

          &:active {
            background: ${colors.error[700]};
          }
        `
      default: // primary
        return `
          background: ${semanticColors.primary};
          color: ${colors.white};

          &:hover {
            background: ${semanticColors.primaryHover};
          }

          &:active {
            background: ${colors.primary[700]};
          }
        `
    }
  }}

  /* Focus styles */
  &:focus {
    outline: 2px solid ${colors.primary[300]};
    outline-offset: 2px;
  }

  /* Disabled styles override */
  &:disabled {
    background: ${colors.gray[300]};
    color: ${colors.gray[500]};
    cursor: not-allowed;

    &:hover {
      background: ${colors.gray[300]};
      color: ${colors.gray[500]};
    }
  }
`

/**
 * Link Button - Button styled as a link
 */
export const LinkButton = styled(Button)`
  background: transparent;
  color: ${semanticColors.primary};
  border: none;
  padding: 0;
  font-size: inherit;
  font-weight: ${typography.fontWeight.normal};
  letter-spacing: ${typography.letterSpacing.normal};
  text-decoration: underline;
  cursor: pointer;

  &:hover {
    background: transparent;
    color: ${semanticColors.primaryHover};
    text-decoration: none;
  }

  &:active {
    color: ${colors.primary[700]};
  }
`
