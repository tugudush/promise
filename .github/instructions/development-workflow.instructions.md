---
applyTo: '**'
---

# Development Workflow Instructions

## Project Context

This is an educational JavaScript Async Programming tutorial built with React 19 + TypeScript + Vite. The complete curriculum and lesson plan can be found in `docs/lesson-plan.md`, including chapter breakdowns, learning objectives, and estimated timelines.

## Essential Commands

```bash
npm run dev         # Start dev server (http://localhost:5173)
npm run build       # Production build (tsc + vite build)
npm run fix         # Lint fix + format (one-stop cleanup)
npm run check       # Check both linting and formatting
npm run lint        # Check for ESLint code quality issues only
npm run format      # Format all files with Prettier
```

## Code Quality & Formatting Workflow

### Separation of Concerns

- **ESLint**: Handles code quality, logic issues, and React Hooks rules
- **Prettier**: Handles ALL code formatting
- **TypeScript**: Handles type checking and compilation

### Pre-commit Workflow

1. **Run `npm run fix`** before committing - fixes code issues AND formats code
2. **Run `npm run check`** to verify both linting and formatting without changes
3. ESLint will NOT show formatting errors (that's Prettier's domain)
4. Unused variables/parameters will cause TypeScript compilation errors

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

## Import Organization

Prettier will auto-sort imports in this order:

1. `react` and `react-dom`
2. External packages (`@` scoped and regular)
3. Internal `@/` imports
4. Relative imports (`./`, `../`)

### Example Import Order

```typescript
// 1. React imports first
import { useEffect, useState } from 'react'

// 2. External packages
import { useParams } from 'react-router-dom'

import { ChapterPage } from '@/pages'
// 3. Internal @/ imports
import { simulateApiCall } from '@/utils/async-helpers'

// 4. Relative imports
import { Container, Header } from './ComponentName.styles'
```

## Path Aliases

Use the `@/` alias for all `src/` imports:

```typescript
// ✅ Correct
import { formatMessage } from '@/utils/helpers'

// ❌ Avoid relative imports when possible
import { formatMessage } from '../utils/helpers'
```

## Build Process

### Development Build

- **Vite Dev Server**: Fast HMR with instant updates
- **TypeScript**: Real-time type checking
- **ESLint**: Live error reporting in editor
- **Hot Module Replacement**: React components update without losing state

### Production Build

- **TypeScript Compilation**: `tsc -b` compiles all TypeScript
- **Vite Build**: Bundles and optimizes for production
- **Path Aliases**: Resolved by both TypeScript and Vite
- **Modern ES Modules**: `"type": "module"` in package.json

### Build Verification

```bash
# Check for type errors
npm run build

# Check for linting issues
npm run lint

# Check for formatting issues
npm run format:check

# Fix all issues at once
npm run fix
```

## Git Workflow

### Branch Naming

- Feature branches: `feature/description`
- Bug fixes: `fix/description`
- Documentation: `docs/description`

### Commit Messages

Follow conventional commits:

```
feat: add new tutorial chapter
fix: resolve styling conflict in ChapterPage
docs: update component architecture guide
style: format code with Prettier
refactor: reorganize component directory structure
```

### Pre-push Checklist

- [ ] `npm run fix` - Fix and format code
- [ ] `npm run build` - Ensure build passes
- [ ] `npm run check` - Verify linting and formatting
- [ ] Test in browser - Verify functionality works

## Development Environment

### Required Tools

- **Node.js**: v18 or higher
- **npm**: Latest version
- **VS Code**: Recommended with extensions:
  - ESLint
  - Prettier
  - TypeScript
  - Emotion syntax highlighting

### VS Code Settings

```json
{
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "typescript.preferences.importModuleSpecifier": "non-relative"
}
```

## Performance Monitoring

### Bundle Analysis

```bash
# Analyze bundle size
npm run build
npx vite-bundle-analyzer dist
```

### Development Performance

- **Vite HMR**: Should update components in <100ms
- **TypeScript**: Should complete type checking in <5s
- **ESLint**: Should complete linting in <3s

## Troubleshooting

### Common Issues

**Type Errors:**

- Run `npm run build` to see TypeScript errors
- Check path aliases are correctly configured
- Ensure Emotion types are properly imported

**Import Errors:**

- Verify barrel exports in `index.ts` files
- Check path aliases in `tsconfig.app.json`
- Ensure component directories follow naming conventions

**Styling Issues:**

- Verify Emotion configuration in `vite.config.ts`
- Check styled components are properly exported
- Ensure JSX import source is configured

**Build Failures:**

- Clear `node_modules` and reinstall: `rm -rf node_modules package-lock.json && npm install`
- Check for unused imports causing TypeScript errors
- Verify all files are properly saved
