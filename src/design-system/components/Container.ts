import styled from '@emotion/styled'

import { colors, spacing } from '../tokens'

export interface ContainerProps {
  size?: 'small' | 'medium' | 'large' | 'full'
  padding?: 'none' | 'small' | 'medium' | 'large'
  background?: 'primary' | 'secondary' | 'tertiary'
  centered?: boolean
}

/**
 * Container Component
 * Consistent layout container with responsive design
 */
export const Container = styled.div<ContainerProps>`
  width: 100%;
  margin: 0 auto;

  /* Size variants */
  ${({ size = 'large' }) => {
    switch (size) {
      case 'small':
        return `max-width: 640px;`
      case 'medium':
        return `max-width: 768px;`
      case 'full':
        return `max-width: none;`
      default: // large
        return `max-width: 1200px;`
    }
  }}

  /* Padding variants */
  ${({ padding = 'none' }) => {
    switch (padding) {
      case 'small':
        return `padding: ${spacing[4]};`
      case 'medium':
        return `padding: ${spacing[6]} ${spacing[4]};`
      case 'large':
        return `padding: ${spacing[8]} ${spacing[4]};`
      default: // none
        return `padding: 0;`
    }
  }}

  /* Background variants */
  ${({ background = 'primary' }) => {
    switch (background) {
      case 'secondary':
        return `background: ${colors.background.secondary};`
      case 'tertiary':
        return `background: ${colors.background.tertiary};`
      default: // primary
        return `background: ${colors.background.primary};`
    }
  }}

  /* Centered content */
  ${({ centered }) =>
    centered &&
    `
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
  `}
`

/**
 * Page Container
 * Full-height container for page layouts
 */
export const PageContainer = styled(Container)`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`

/**
 * Section Container
 * Container for distinct sections within a page
 */
export const Section = styled.section<ContainerProps>`
  ${Container}

  /* Section-specific default styles */
  ${({ background = 'primary' }) => {
    if (background === 'primary') {
      return `
        background: ${colors.white};
        border-radius: ${spacing[3]};
        box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);
      `
    }
    return ''
  }}
`
