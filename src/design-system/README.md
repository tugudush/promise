# Design System

A centralized design system for consistent styling and UI components across the JavaScript Async Programming Tutorial application.

## Overview

This design system provides:

- **Design Tokens**: Colors, spacing, typography, and other design primitives
- **Reusable Components**: Styled components for consistent UI patterns
- **Theme Provider**: Global styles and theming context

## Structure

```
src/design-system/
├── tokens/
│   ├── colors.ts      # Color system and semantic colors
│   ├── spacing.ts     # Spacing scale and layout tokens
│   ├── typography.ts  # Typography scale and text styles
│   └── index.ts       # Tokens export
├── components/
│   ├── Button.ts      # Button component variants
│   ├── Container.ts   # Layout containers
│   ├── Typography.ts  # Text components
│   └── index.ts       # Components export
├── ThemeProvider.tsx  # Global styles and theme context
└── index.ts          # Main design system export
```

## Usage

### Importing Design Tokens

```typescript
import { colors, spacing, typography } from '@/design-system'

// Use design tokens in your styled components
const StyledComponent = styled.div`
  color: ${colors.primary[500]};
  padding: ${spacing[4]};
  font-size: ${typography.fontSize.base};
`
```

### Using Reusable Components

```typescript
import { Button, Container, H1, P } from '@/design-system'

function MyComponent() {
  return (
    <Container size="large" padding="medium">
      <H1>Title</H1>
      <P>This is a paragraph with consistent styling.</P>
      <Button variant="primary" size="medium">
        Click me
      </Button>
    </Container>
  )
}
```

### Applying Global Theme

```typescript
import { ThemeProvider } from '@/design-system'

function App() {
  return (
    <ThemeProvider>
      <YourAppComponents />
    </ThemeProvider>
  )
}
```

## Design Tokens

### Colors

The color system uses a structured approach with semantic naming:

```typescript
// Primary colors
colors.primary[500] // Main brand color
colors.primary[600] // Hover state

// Semantic colors
semanticColors.primary // Main brand color
semanticColors.success // Success states
semanticColors.error // Error states
semanticColors.text // Primary text color
semanticColors.background // Primary background
```

### Spacing

Consistent spacing scale based on a 4px base unit:

```typescript
spacing[1] // 4px
spacing[2] // 8px
spacing[4] // 16px
spacing[8] // 32px
spacing[16] // 64px
```

### Typography

Typography tokens for consistent text styling:

```typescript
typography.fontSize.base // Base font size (1rem)
typography.fontWeight.bold // Bold weight
typography.lineHeight.normal // Normal line height
```

## Component API

### Button

```typescript
interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'error'
  size?: 'small' | 'medium' | 'large'
  disabled?: boolean
  fullWidth?: boolean
}
```

### Container

```typescript
interface ContainerProps {
  size?: 'small' | 'medium' | 'large' | 'full'
  padding?: 'none' | 'small' | 'medium' | 'large'
  background?: 'primary' | 'secondary' | 'tertiary'
  centered?: boolean
}
```

### Typography Components

- `H1`, `H2`, `H3`, `H4` - Heading components
- `P` - Paragraph component
- `Code`, `CodeBlock` - Code display components

## Best Practices

### 1. Use Design Tokens

Always use design tokens instead of hardcoded values:

```typescript
// ✅ Good
const StyledDiv = styled.div`
  color: ${colors.primary[500]};
  padding: ${spacing[4]};
`

// ❌ Avoid
const StyledDiv = styled.div`
  color: #3b82f6;
  padding: 1rem;
`
```

### 2. Leverage Reusable Components

Use design system components when possible:

```typescript
// ✅ Good
import { Button, H1 } from '@/design-system'

function Component() {
  return (
    <div>
      <H1>Title</H1>
      <Button variant="primary">Click me</Button>
    </div>
  )
}
```

### 3. Extend Components

Extend design system components for specific needs:

```typescript
import { Button } from '@/design-system'

const CustomButton = styled(Button)`
  // Additional styles
  border-radius: ${spacing[3]};
`
```

## Migration Guide

### From Inline Styles

**Before:**

```typescript
const StyledComponent = styled.div`
  background: #3b82f6;
  color: white;
  padding: 1rem;
  font-size: 1.125rem;
  border-radius: 0.5rem;
`
```

**After:**

```typescript
import { colors, spacing, typography } from '@/design-system'

const StyledComponent = styled.div`
  background: ${colors.primary[500]};
  color: ${colors.white};
  padding: ${spacing[4]};
  font-size: ${typography.fontSize.lg};
  border-radius: ${spacing[2]};
`
```

### From Component Libraries

**Before:**

```typescript
// Multiple imports from different sources
import styled from '@emotion/styled'
import { Button as MuiButton } from '@mui/material'

import { StyledLink } from '../shared/styles'
```

**After:**

```typescript
// Single import from design system
import { Button } from '@/design-system'
```

## Contributing

When adding new design tokens or components:

1. **Design Tokens**: Add to the appropriate `tokens/*.ts` file
2. **Components**: Create new component file in `components/`
3. **Exports**: Update `index.ts` files to export new items
4. **Documentation**: Update this README with usage examples

## Benefits

- **Consistency**: Unified design language across the application
- **Maintainability**: Centralized styling makes updates easier
- **Developer Experience**: Clear API and comprehensive documentation
- **Scalability**: Easy to extend and add new components
- **Performance**: Optimized CSS with reduced duplication</content>
  <parameter name="filePath">c:\htdocs\promise\src\design-system\README.md
