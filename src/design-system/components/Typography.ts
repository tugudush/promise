import styled from '@emotion/styled'

import { colors, semanticColors, spacing, typography } from '../tokens'

export interface TextProps {
  size?: 'small' | 'medium' | 'large'
  weight?: 'normal' | 'medium' | 'semibold' | 'bold'
  color?:
    | 'primary'
    | 'secondary'
    | 'tertiary'
    | 'inverse'
    | 'success'
    | 'warning'
    | 'error'
  align?: 'left' | 'center' | 'right'
}

/**
 * Heading Components
 */
export const H1 = styled.h1<TextProps>`
  font-family: ${typography.fontFamily.sans};
  font-size: ${typography.fontSize['5xl']};
  font-weight: ${typography.fontWeight.bold};
  line-height: ${typography.lineHeight.tight};
  letter-spacing: ${typography.letterSpacing.tight};
  margin: 0 0 ${spacing[6]} 0;

  color: ${({ color = 'primary' }) => {
    switch (color) {
      case 'secondary':
        return semanticColors.textSecondary
      case 'tertiary':
        return semanticColors.textTertiary
      case 'inverse':
        return semanticColors.textInverse
      default:
        return semanticColors.text
    }
  }};

  text-align: ${({ align = 'left' }) => align};
`

export const H2 = styled.h2<TextProps>`
  font-family: ${typography.fontFamily.sans};
  font-size: ${typography.fontSize['4xl']};
  font-weight: ${typography.fontWeight.semibold};
  line-height: ${typography.lineHeight.tight};
  letter-spacing: ${typography.letterSpacing.tight};
  margin: 0 0 ${spacing[4]} 0;

  color: ${({ color = 'primary' }) => {
    switch (color) {
      case 'secondary':
        return semanticColors.textSecondary
      case 'tertiary':
        return semanticColors.textTertiary
      case 'inverse':
        return semanticColors.textInverse
      default:
        return semanticColors.text
    }
  }};

  text-align: ${({ align = 'left' }) => align};
`

export const H3 = styled.h3<TextProps>`
  font-family: ${typography.fontFamily.sans};
  font-size: ${typography.fontSize['3xl']};
  font-weight: ${typography.fontWeight.semibold};
  line-height: ${typography.lineHeight.snug};
  letter-spacing: ${typography.letterSpacing.tight};
  margin: 0 0 ${spacing[3]} 0;

  color: ${({ color = 'primary' }) => {
    switch (color) {
      case 'secondary':
        return semanticColors.textSecondary
      case 'tertiary':
        return semanticColors.textTertiary
      case 'inverse':
        return semanticColors.textInverse
      default:
        return semanticColors.text
    }
  }};

  text-align: ${({ align = 'left' }) => align};
`

export const H4 = styled.h4<TextProps>`
  font-family: ${typography.fontFamily.sans};
  font-size: ${typography.fontSize['2xl']};
  font-weight: ${typography.fontWeight.semibold};
  line-height: ${typography.lineHeight.snug};
  letter-spacing: ${typography.letterSpacing.tight};
  margin: 0 0 ${spacing[2]} 0;

  color: ${({ color = 'primary' }) => {
    switch (color) {
      case 'secondary':
        return semanticColors.textSecondary
      case 'tertiary':
        return semanticColors.textTertiary
      case 'inverse':
        return semanticColors.textInverse
      default:
        return semanticColors.text
    }
  }};

  text-align: ${({ align = 'left' }) => align};
`

/**
 * Body Text Components
 */
export const P = styled.p<TextProps>`
  font-family: ${typography.fontFamily.sans};
  margin: 0 0 ${spacing[4]} 0;
  line-height: ${typography.lineHeight.relaxed};

  ${({ size = 'medium' }) => {
    switch (size) {
      case 'small':
        return `font-size: ${typography.fontSize.sm};`
      case 'large':
        return `font-size: ${typography.fontSize.lg};`
      default:
        return `font-size: ${typography.fontSize.base};`
    }
  }}

  font-weight: ${({ weight = 'normal' }) => {
    switch (weight) {
      case 'medium':
        return typography.fontWeight.medium
      case 'semibold':
        return typography.fontWeight.semibold
      case 'bold':
        return typography.fontWeight.bold
      default:
        return typography.fontWeight.normal
    }
  }};

  color: ${({ color = 'primary' }) => {
    switch (color) {
      case 'secondary':
        return semanticColors.textSecondary
      case 'tertiary':
        return semanticColors.textTertiary
      case 'inverse':
        return semanticColors.textInverse
      case 'success':
        return semanticColors.success
      case 'warning':
        return semanticColors.warning
      case 'error':
        return semanticColors.error
      default:
        return semanticColors.text
    }
  }};

  text-align: ${({ align = 'left' }) => align};
`

/**
 * Code Components
 */
export const Code = styled.code`
  font-family: ${typography.fontFamily.mono};
  font-size: 0.875em;
  font-weight: ${typography.fontWeight.normal};
  padding: ${spacing[0.5]} ${spacing[1]};
  background: ${colors.gray[100]};
  border-radius: ${spacing[1]};
  color: ${colors.error[600]};
`

export const CodeBlock = styled.pre`
  font-family: ${typography.fontFamily.mono};
  font-size: ${typography.fontSize.sm};
  font-weight: ${typography.fontWeight.normal};
  line-height: ${typography.lineHeight.normal};
  padding: ${spacing[4]};
  background: ${colors.gray[900]};
  color: ${colors.gray[100]};
  border-radius: ${spacing[2]};
  overflow-x: auto;
  margin: ${spacing[4]} 0;

  & code {
    background: transparent;
    padding: 0;
    color: inherit;
  }
`
