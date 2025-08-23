---
applyTo: '**'
---

# Styling Instructions - Emotion CSS-in-JS

## Emotion Configuration

- **CSS-in-JS**: Uses `@emotion/react` and `@emotion/styled` for component styling
- **Scoped Styles**: Each component has isolated styles preventing conflicts
- **TypeScript Support**: Full type safety for styled components and props
- **Vite Integration**: Configured with Emotion Babel plugin for optimal performance
- **No Global CSS**: Avoid global CSS files; use Emotion styled components instead

## Styling Patterns

### Styled Components Structure

```typescript
// ComponentName.styles.ts
import { Link } from 'react-router-dom'
import styled from '@emotion/styled'

export const Container = styled.div`
  padding: 2rem;
  background: white;
`

export const StyledLink = styled(Link)`
  color: #4f46e5;
  text-decoration: none;
  
  &:hover {
    color: #6366f1;
  }
`

export const DynamicButton = styled.button<{ variant: 'primary' | 'secondary' }>`
  padding: 0.5rem 1rem;
  border-radius: 6px;
  
  ${props => props.variant === 'primary' 
    ? 'background: #667eea; color: white;'
    : 'background: #f3f4f6; color: #374151;'
  }
`
```

### Component Usage

```typescript
// ComponentName.tsx
import { Container, StyledLink, DynamicButton } from './ComponentName.styles'

function ComponentName() {
  return (
    <Container>
      <StyledLink to="/path">Link Text</StyledLink>
      <DynamicButton variant="primary">Click Me</DynamicButton>
    </Container>
  )
}
```

## Styling Best Practices

- **Named Exports**: Always use named exports for styled components
- **Semantic Naming**: Use descriptive names like `ChapterNumber`, `NavButton`
- **Props Interface**: Type props for dynamic styling with TypeScript
- **CSS Variables**: Use CSS custom properties for theme consistency
- **Responsive Design**: Use CSS media queries within styled components
- **Avoid Inline Styles**: Use styled components instead of `style` prop

## File Organization

- Styles go in `ComponentName.styles.ts` using Emotion
- Each component/page has its own styles file in the same directory
- Import styled components using named imports
- Separate styling logic from component logic for better maintainability

## Dynamic Styling Examples

### Conditional Styling Based on Props

```typescript
export const StatusBadge = styled.span<{ status: 'success' | 'error' | 'warning' }>`
  padding: 0.25rem 0.75rem;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 500;
  
  ${props => {
    switch (props.status) {
      case 'success':
        return `
          background-color: #dcfce7;
          color: #166534;
        `;
      case 'error':
        return `
          background-color: #fee2e2;
          color: #991b1b;
        `;
      case 'warning':
        return `
          background-color: #fef3c7;
          color: #92400e;
        `;
      default:
        return `
          background-color: #f3f4f6;
          color: #374151;
        `;
    }
  }}
`
```

### Responsive Design

```typescript
export const ResponsiveGrid = styled.div`
  display: grid;
  gap: 1rem;
  
  /* Mobile first approach */
  grid-template-columns: 1fr;
  
  @media (min-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @media (min-width: 1024px) {
    grid-template-columns: repeat(3, 1fr);
  }
`
```

### Theme Integration

```typescript
// Use CSS custom properties for theme consistency
export const ThemedButton = styled.button`
  background: var(--color-primary, #667eea);
  color: var(--color-primary-text, white);
  border: 1px solid var(--color-primary-border, #667eea);
  
  &:hover {
    background: var(--color-primary-hover, #5a67d8);
  }
`
```

## Common Patterns for Tutorial Components

### Interactive Tutorial Elements

```typescript
export const CodeBlock = styled.pre`
  background: #1a202c;
  color: #e2e8f0;
  padding: 1rem;
  border-radius: 8px;
  overflow-x: auto;
  font-family: 'Fira Code', monospace;
  margin: 1rem 0;
`

export const HighlightBox = styled.div<{ type: 'info' | 'warning' | 'success' }>`
  padding: 1rem;
  border-radius: 8px;
  border-left: 4px solid;
  margin: 1rem 0;
  
  ${props => {
    switch (props.type) {
      case 'info':
        return `
          background: #eff6ff;
          border-color: #3b82f6;
          color: #1e40af;
        `;
      case 'warning':
        return `
          background: #fffbeb;
          border-color: #f59e0b;
          color: #92400e;
        `;
      case 'success':
        return `
          background: #f0fdf4;
          border-color: #10b981;
          color: #065f46;
        `;
    }
  }}
`
```

## Performance Considerations

- Emotion generates optimized CSS at build time
- Styled components are automatically scoped, preventing style leaks
- CSS is only loaded for components actually used
- Use the Emotion Babel plugin for better debugging and performance
