---
applyTo: '**'
---

# Styling Instructions - Emotion CSS-in-JS

## Emotion Configuration

- **CSS-in-JS**: Uses `@emotion/react` and `@emotion/styled` for component styling
- **Scoped Styles**: Each component has isolated styles preventing conflicts
- **TypeScript Support**: Full type safety for styled components and props
- **Vite Integration**: Configured with Emotion Babel plugin for optimal performance
- **CSS Variables**: Uses CSS custom properties for theme consistency (see `src/index.css`)
- **Design System**: Structured design tokens available in `src/design-system/tokens/`

## Global CSS Usage

While the primary styling approach uses Emotion, there are minimal global CSS files:

- **`src/index.css`**: CSS custom properties (variables) for design system consistency
- **`src/App.css`**: App-specific styles using design system variables
- **Avoid component-specific styles** in global CSS files

## Styling Patterns

### Styled Components Structure

```typescript
// ComponentName.styles.ts
import styled from '@emotion/styled'
import { Link } from 'react-router-dom'

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

export const DynamicButton = styled.button<{
  variant: 'primary' | 'secondary'
}>`
  padding: 0.5rem 1rem;
  border-radius: 6px;

  ${(props) =>
    props.variant === 'primary'
      ? 'background: #667eea; color: white;'
      : 'background: #f3f4f6; color: #374151;'}
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
export const StatusBadge = styled.span<{
  status: 'success' | 'error' | 'warning'
}>`
  padding: 0.25rem 0.75rem;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 500;

  ${(props) => {
    switch (props.status) {
      case 'success':
        return `
          background-color: #dcfce7;
          color: #166534;
        `
      case 'error':
        return `
          background-color: #fee2e2;
          color: #991b1b;
        `
      case 'warning':
        return `
          background-color: #fef3c7;
          color: #92400e;
        `
      default:
        return `
          background-color: #f3f4f6;
          color: #374151;
        `
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

// Or use design system tokens for more structured theming
import { colors, spacing } from '@/design-system/tokens'

export const DesignSystemButton = styled.button`
  background: ${colors.primary};
  color: white;
  padding: ${spacing[2]} ${spacing[4]};
  border-radius: ${spacing[1]};
`
```

## Common Patterns for Tutorial Components

### Code Syntax Highlighting

All code examples in tutorials use the `SyntaxHighlighter` component for consistent, professional syntax highlighting with enforced dark theme:

```typescript
// Basic usage with JavaScript
<SyntaxHighlighter language="javascript">
{`// Example JavaScript code
const fetchData = async () => {
  const response = await fetch('/api/data')
  return response.json()
}`}
</SyntaxHighlighter>

// TypeScript/React examples
<SyntaxHighlighter language="typescript" showLanguageLabel>
{`// React Hook example
const [data, setData] = useState<User[]>([])
const [loading, setLoading] = useState(false)

useEffect(() => {
  const loadData = async () => {
    setLoading(true)
    try {
      const result = await fetchUsers()
      setData(result)
    } finally {
      setLoading(false)
    }
  }
  loadData()
}, [])`}
</SyntaxHighlighter>

// JSON API responses
<SyntaxHighlighter language="json" showLineNumbers>
{`{
  "status": "success",
  "data": {
    "users": [
      {
        "id": 1,
        "name": "John Doe",
        "email": "john@example.com"
      }
    ]
  }
}`}
</SyntaxHighlighter>
```

#### SyntaxHighlighter Props

- **`language`**: Programming language for syntax highlighting
  - `javascript` - JavaScript code
  - `typescript` - TypeScript/React code
  - `json` - JSON data/API responses
  - `css` - Stylesheets
  - `bash` - Terminal commands
  - And 200+ other languages supported by Prism.js

- **`showLanguageLabel`**: Display language name at top (default: `true`)
- **`showLineNumbers`**: Show line numbers (default: `false`)
- **`customStyle`**: Override default styling if needed

#### Code Block Best Practices

- **Use appropriate language**: Choose `typescript` for React code, `javascript` for plain JS
- **Show language labels**: Helps students understand what they're looking at
- **Include comments**: Explain complex async concepts within code examples
- **Consistent formatting**: All code blocks have enforced dark theme with generous padding
- **Educational clarity**: Prioritize readability over brevity in code examples

## Performance Considerations

- Emotion generates optimized CSS at build time
- Styled components are automatically scoped, preventing style leaks
- CSS is only loaded for components actually used
- Use the Emotion Babel plugin for better debugging and performance
- Design system tokens enable consistent styling with minimal CSS output

## Design System Integration

The project includes a structured design system for consistent styling:

```typescript
// src/design-system/tokens/colors.ts
export const colors = {
  primary: '#667eea',
  secondary: '#764ba2',
  // ... more color definitions
}

// Usage in styled components
import { colors } from '@/design-system/tokens'

export const StyledButton = styled.button`
  background: ${colors.primary};
  color: white;
`
```

### Design System Structure

```
src/design-system/
├── tokens/
│   ├── colors.ts       # Color palette
│   ├── spacing.ts      # Spacing scale
│   ├── typography.ts   # Font styles
│   └── index.ts        # Token exports
├── components/
│   ├── Button.ts       # Reusable button component
│   ├── Container.ts    # Layout container
│   └── index.ts        # Component exports
└── index.ts            # Main design system export
```
