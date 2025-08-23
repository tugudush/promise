---
applyTo: '**'
---

# Component Architecture Instructions

## Directory Structure Rules

Each component/page must have its own directory with organized files following these patterns:

```
src/pages/
├── index.ts                          # Barrel exports for clean imports
├── homePage/
│   ├── index.ts                     # Re-exports HomePage as default
│   ├── HomePage.tsx                 # Main component logic
│   └── HomePage.styles.ts           # Emotion styled components
└── chapterPage/
    ├── index.ts                     # Re-exports ChapterPage as default
    ├── ChapterPage.tsx              # Main component logic
    └── ChapterPage.styles.ts        # Emotion styled components
```

## File Organization Rules

- **Directory Naming**: Use camelCase for directory names (e.g., `chapterPage`, `homePage`)
- **Component Files**: Component logic goes in `ComponentName.tsx`
- **Style Files**: Styles go in `ComponentName.styles.ts` using Emotion
- **Index Files**: Use `index.ts` for clean re-exports
- **Barrel Exports**: Use barrel exports at the directory level (`src/pages/index.ts`)

## Component Structure Patterns

### Basic Component Template

```typescript
// ComponentName.tsx
import { ComponentContainer, Title, Content } from './ComponentName.styles'

function ComponentName() {
  return (
    <ComponentContainer>
      <Title>Component Title</Title>
      <Content>
        {/* Component content */}
      </Content>
    </ComponentContainer>
  )
}

export default ComponentName
```

### Index File Pattern

```typescript
// index.ts
export { default } from './ComponentName'
```

### Barrel Export Pattern

```typescript
// src/pages/index.ts
export { default as ChapterPage } from './chapterPage'
export { default as HomePage } from './homePage'
```

## Import Patterns

### Component Import Examples

```typescript
// Page component imports
import { useParams } from 'react-router-dom'

import {
  Container,
  Header,
  StyledButton,
} from './ComponentName.styles'

// Barrel exports from pages
import { ChapterPage, HomePage } from '@/pages'

// Utils and helpers
import { simulateApiCall } from '@/utils/async-helpers'
```

### Directory-based Import Best Practices

```typescript
// ✅ Clean barrel exports
import { ChapterPage, HomePage } from '@/pages'

// ✅ Direct directory import with index.ts
import ChapterPage from '@/pages/chapterPage'

// ❌ Avoid direct file imports when directory exports exist
import ChapterPage from '@/pages/chapterPage/ChapterPage'
```

## Component Types and Organization

### Page Components
- Located in `src/pages/`
- Each page has its own directory
- Contains main application routes

### Feature Components
- Located in `src/components/`
- Reusable across multiple pages
- Organized by feature or functionality

### Tutorial Components
- Located in `src/examples/` or `src/components/tutorial/`
- Educational components specific to tutorial content
- Interactive examples and demonstrations

## File Naming Conventions

- **Components**: PascalCase (e.g., `HomePage.tsx`, `ChapterPage.tsx`)
- **Directories**: camelCase (e.g., `homePage/`, `chapterPage/`)
- **Styles**: PascalCase with `.styles.ts` suffix (e.g., `HomePage.styles.ts`)
- **Index Files**: Always lowercase `index.ts`
- **Utilities**: camelCase (e.g., `async-helpers.ts`)

## Scalability Patterns

### Adding New Components

1. Create directory: `src/pages/newPage/`
2. Create component: `newPage/NewPage.tsx`
3. Create styles: `newPage/NewPage.styles.ts`
4. Create index: `newPage/index.ts`
5. Update barrel export: `src/pages/index.ts`

### Component Extensions

For complex components that need additional files:

```
src/pages/complexPage/
├── index.ts                    # Main export
├── ComplexPage.tsx            # Main component
├── ComplexPage.styles.ts      # Styles
├── ComplexPage.hooks.ts       # Custom hooks
├── ComplexPage.utils.ts       # Helper functions
├── ComplexPage.types.ts       # TypeScript types
└── components/                # Sub-components
    ├── index.ts
    ├── SubComponent.tsx
    └── SubComponent.styles.ts
```

## Educational Component Patterns

### Tutorial Component Structure

Follow patterns optimized for educational clarity:

- Clear, descriptive component and variable names
- Extensive code comments explaining async concepts
- Step-by-step progression in complex examples
- Error boundaries for safe tutorial execution
- Loading states that clearly demonstrate async behavior

### Tutorial Example Standards

- Each async pattern includes both "before" and "after" examples
- Common mistakes demonstrated alongside correct implementations
- Real-world context provided for each pattern
- Performance implications explained in comments
- Testing examples included where relevant

### Educational Code Style

- Prioritize clarity over brevity in tutorial examples
- Use descriptive variable names that explain the async operation
- Include detailed comments explaining Promise states and transitions
- Show both successful and error scenarios for each pattern
- Demonstrate progressive enhancement from basic to advanced patterns

## Component Composition Patterns

### Higher-Order Components (HOCs)

```typescript
// withAsync.tsx - Example HOC for async functionality
import React from 'react'

function withAsync<T>(Component: React.ComponentType<T>) {
  return function AsyncComponent(props: T) {
    // Add async functionality
    return <Component {...props} />
  }
}
```

### Render Props Pattern

```typescript
// AsyncRenderer.tsx - Render props for async states
interface AsyncRendererProps<T> {
  data?: T
  loading: boolean
  error?: Error
  children: (state: { data?: T; loading: boolean; error?: Error }) => React.ReactNode
}

function AsyncRenderer<T>({ data, loading, error, children }: AsyncRendererProps<T>) {
  return <>{children({ data, loading, error })}</>
}
```

## Testing Organization

- Test files co-located with components: `ComponentName.test.tsx`
- Test utilities in `src/utils/test-utils.ts`
- Mock data in `src/mocks/` directory
- Integration tests for complete user flows
