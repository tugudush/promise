# Copilot Instructions for Promise

## Project Overview

Promise is a React 19 + TypeScript + Vite project with strict ESLint and Prettier configuration. This is a modern React setup using the latest stack with comprehensive code quality tooling.

## Architecture & Structure

- **Entry Point**: `src/main.tsx` - React 19 app initialization
- **Main Component**: `src/App.tsx` - Primary application component
- **Utilities**: `src/utils/` - Shared helper functions (e.g., `formatMessage`)
- **Assets**: `src/assets/` - React/component-specific assets
- **Public**: `public/` - Static assets served directly

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
- React Hooks rules enforced (`eslint-plugin-react-hooks`)
- TypeScript strict mode enabled
- Prettier integration with `prettier/prettier` as error

### Prettier Configuration
- **No semicolons** (`"semi": false`)
- **Single quotes** for JS/TS and JSX
- **Import sorting** via `@trivago/prettier-plugin-sort-imports`
- Import order: React → React DOM → External packages → `@/` imports → Relative imports

### TypeScript Setup
- Project references architecture (`tsconfig.json` → `tsconfig.app.json` + `tsconfig.node.json`)
- Strict type checking enabled
- `noUnusedLocals` and `noUnusedParameters` enforced
- Path mapping configured for `@/*` → `src/*`

## Development Workflow

### Essential Commands
```bash
npm run dev         # Start dev server (http://localhost:5173)
npm run build       # Production build (tsc + vite build)
npm run lf          # Lint fix + format (one-stop cleanup)
npm run lint        # Check for ESLint issues
npm run format      # Format all files with Prettier
```

### Code Style Enforcement
- **Always run `npm run lf`** before committing - it fixes linting issues and formats code
- ESLint will error on Prettier violations (not just warnings)
- Unused variables/parameters will cause TypeScript compilation errors

## Key Patterns

### Component Structure
Follow the existing `App.tsx` pattern:
- useState imports from React
- Custom utilities imported with `@/` alias
- CSS imports after utility imports
- Asset imports last

### Import Organization
Prettier will auto-sort imports in this order:
1. `react` and `react-dom` 
2. External packages (`@` scoped and regular)
3. Internal `@/` imports
4. Relative imports (`./`, `../`)

### Utility Functions
Place reusable functions in `src/utils/` and export with descriptive names:
```typescript
// src/utils/helpers.ts
export const formatMessage = (message: string): string => {
  return `Hello, ${message}!`
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
