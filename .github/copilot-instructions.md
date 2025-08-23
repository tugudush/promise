# Copilot Instructions for Promise - JavaScript Async Programming Tutorial

## Project Overview

Promise is an interactive educational project teaching JavaScript asynchronous programming patterns (async/await, Promises, resolve, then, etc.) specifically in React context. Built with React 19 + TypeScript + Vite with Emotion CSS-in-JS, comprehensive ESLint and Prettier configuration for maintaining clean, educational code examples.

**Educational Focus**: This project serves as a comprehensive tutorial covering async JavaScript patterns from basic Promise concepts to advanced real-world React applications, with emphasis on practical, production-ready patterns.

## Tutorial Structure & Learning Objectives

### Core Topics Covered

- **Promise fundamentals** - Basic async operations and Promise lifecycle
- **Async/await syntax** - Modern asynchronous programming patterns
- **React integration** - Async operations in React components and hooks
- **Custom hooks** - Building reusable async logic (useFetch, useAsync patterns)
- **Error handling** - Graceful error management in async React applications
- **Performance optimization** - Efficient async patterns for better UX
- **Testing strategies** - Testing async React components and patterns

### Tutorial Progression

1. **Chapters 1-3**: Foundations (Promises → async/await → basic React patterns)
2. **Chapters 4-6**: Advanced patterns (React hooks, state management, custom hooks)
3. **Chapters 7-10**: Real-world applications (API integration, testing, performance, capstone project)

## Architecture & Structure

- **Entry Point**: `src/main.tsx` - React 19 app initialization for tutorial interface
- **Main Component**: `src/App.tsx` - Primary tutorial navigation and layout
- **Router**: `src/router.tsx` - React Router configuration with createBrowserRouter
- **Pages**: `src/pages/` - Page components with directory-based structure
- **Tutorial Examples**: `src/examples/` - Interactive async pattern demonstrations
- **Utilities**: `src/utils/` - Helper functions for async operations (e.g., API utilities)
- **Documentation**: `docs/` - Comprehensive lesson plans and guides
- **Assets**: `src/assets/` - Tutorial-specific assets and resources
- **Public**: `public/` - Static assets served directly

### Component Directory Structure

Each page/component has its own directory with organized files:

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

**Directory Structure Rules**:
- Each component/page must have its own directory (camelCase naming)
- Component logic goes in `ComponentName.tsx`
- Styles go in `ComponentName.styles.ts` using Emotion
- Use `index.ts` for clean re-exports
- Use barrel exports at the directory level (`src/pages/index.ts`)

### Tutorial Code Organization

- **Examples by Chapter**: Each tutorial chapter has dedicated example components
- **Async Patterns**: Reusable patterns organized by complexity (basic → advanced)
- **Error Scenarios**: Dedicated components for demonstrating error handling
- **Performance Examples**: Components showcasing optimization techniques

## Path Aliases

Use the `@/` alias for all `src/` imports:

```typescript
// ✅ Correct
import { formatMessage } from '@/utils/helpers'

// ❌ Avoid relative imports
import { formatMessage } from '../utils/helpers'
```

## Code Quality Standards

### ESLint Configuration

- Uses ESLint 9.x with flat config (`eslint.config.js`)
- **Code Quality Focus**: ESLint handles logic, code quality, and React Hooks rules
- React Hooks rules enforced (`eslint-plugin-react-hooks`)
- TypeScript strict mode enabled
- **Separation of Concerns**: ESLint does NOT handle formatting (that's Prettier's job)

### Prettier Configuration

- **Formatting Only**: Prettier handles ALL code formatting
- **No semicolons** (`"semi": false`)
- **Single quotes** for JS/TS and JSX
- **Import sorting** via `@trivago/prettier-plugin-sort-imports`
- Import order: React → React DOM → External packages → `@/` imports → Relative imports

### TypeScript Setup

- Project references architecture (`tsconfig.json` → `tsconfig.app.json` + `tsconfig.node.json`)
- Strict type checking enabled
- `noUnusedLocals` and `noUnusedParameters` enforced
- Path mapping configured for `@/*` → `src/*`
- JSX configured for Emotion (`jsxImportSource: "@emotion/react"`)

## Styling with Emotion CSS-in-JS

### Emotion Configuration

- **CSS-in-JS**: Uses `@emotion/react` and `@emotion/styled` for component styling
- **Scoped Styles**: Each component has isolated styles preventing conflicts
- **TypeScript Support**: Full type safety for styled components and props
- **Vite Integration**: Configured with Emotion Babel plugin for optimal performance
- **No Global CSS**: Avoid global CSS files; use Emotion styled components instead

### Styling Patterns

**Styled Components Structure**:
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

**Component Usage**:
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

### Styling Best Practices

- **Named Exports**: Always use named exports for styled components
- **Semantic Naming**: Use descriptive names like `ChapterNumber`, `NavButton`
- **Props Interface**: Type props for dynamic styling with TypeScript
- **CSS Variables**: Use CSS custom properties for theme consistency
- **Responsive Design**: Use CSS media queries within styled components
- **Avoid Inline Styles**: Use styled components instead of `style` prop

## Development Workflow

### Essential Commands

```bash
npm run dev         # Start dev server (http://localhost:5173)
npm run build       # Production build (tsc + vite build)
npm run fix         # Lint fix + format (one-stop cleanup)
npm run check       # Check both linting and formatting
npm run lint        # Check for ESLint code quality issues only
npm run format      # Format all files with Prettier
```

### Code Quality & Formatting Workflow

- **Clear Separation**: ESLint handles code quality, Prettier handles formatting
- **Run `npm run fix`** before committing - fixes code issues AND formats code
- **Run `npm run check`** to verify both linting and formatting without changes
- ESLint will NOT show formatting errors (that's Prettier's domain)
- Unused variables/parameters will cause TypeScript compilation errors

## Key Patterns

### Component Structure for Tutorials

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

### Import Organization

Prettier will auto-sort imports in this order:

1. `react` and `react-dom`
2. External packages (`@` scoped and regular)
3. Internal `@/` imports
4. Relative imports (`./`, `../`)

### Component Import Patterns

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

**Directory-based Imports**:
```typescript
// ✅ Clean barrel exports
import { ChapterPage, HomePage } from '@/pages'

// ✅ Direct directory import with index.ts
import ChapterPage from '@/pages/chapterPage'

// ❌ Avoid direct file imports when directory exports exist
import ChapterPage from '@/pages/chapterPage/ChapterPage'
```

### Utility Functions for Async Tutorials

Create educational utilities in `src/utils/` that demonstrate async patterns:

```typescript
// src/utils/async-helpers.ts
export const simulateApiCall = (delay: number = 1000): Promise<string> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(`Data loaded after ${delay}ms`), delay)
  })
}

export const createAsyncExample = (
  name: string,
  operation: () => Promise<any>
) => {
  // Wrapper for tutorial examples with consistent logging
}
```

## Modern React Patterns

- Uses React 19 features and patterns
- Functional components with hooks
- React Refresh for fast development
- Vite's fast HMR for instant updates

## Build System

- **Vite** for development and building
- TypeScript compilation happens before Vite build (`tsc -b && vite build`)
- Path aliases resolved by both TypeScript and Vite
- Modern ES modules (`"type": "module"` in package.json)
