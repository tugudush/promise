# Copilot Instructions for Promise - JavaScript Async Programming Tutorial

## Project Overview

Promise is an interactive educational project teaching JavaScript asynchronous programming patterns (async/await, Promises, resolve, then, etc.) specifically in React context. Built with React 19 + TypeScript + Vite with Emotion CSS-in-JS for modern, maintainable code.

**Educational Focus**: Comprehensive tutorial covering async JavaScript patterns from basic Promise concepts to advanced real-world React applications, emphasizing practical, production-ready patterns.

## Quick Reference

### Tech Stack

- **Frontend**: React 19 + TypeScript + Vite
- **Styling**: Emotion CSS-in-JS with scoped components
- **Routing**: React Router v6+ with createBrowserRouter
- **Code Quality**: ESLint 9.x + Prettier + TypeScript strict mode
- **Build**: Vite with path aliases (`@/` → `src/`)

### Essential Commands

```bash
npm run dev         # Start development server
npm run build       # Production build with type checking
npm run fix         # Fix all linting and formatting issues
npm run check       # Verify code quality without changes
```

### Project Structure

```
src/
├── pages/           # Page components (directory-based organization)
│   ├── homePage/    # Each page has its own directory
│   └── chapterPage/ # Contains .tsx, .styles.ts, and index.ts
├── examples/        # Tutorial demonstration components
├── utils/           # Async helpers and utilities
└── router.tsx       # React Router configuration
```

## Detailed Instructions

For comprehensive guidance on specific aspects of development, see the modular instruction files:

### 🎨 **Styling**: [styling.instructions.md](./instructions/styling.instructions.md)

- Emotion CSS-in-JS patterns and configuration
- Styled components with TypeScript
- Dynamic styling and responsive design
- Performance optimization for styles

### 🏗️ **Architecture**: [component-architecture.instructions.md](./instructions/component-architecture.instructions.md)

- Directory structure and file organization
- Component composition and naming conventions
- Import patterns and barrel exports
- Scalability and maintainability patterns

### 🔧 **Workflow**: [development-workflow.instructions.md](./instructions/development-workflow.instructions.md)

- Development commands and build process
- Code quality workflow (ESLint + Prettier + TypeScript)
- Git conventions and troubleshooting
- Performance monitoring and optimization

### 📚 **Tutorials**: [tutorial-patterns.instructions.md](./instructions/tutorial-patterns.instructions.md)

- Educational code standards and clarity
- Interactive tutorial component patterns
- Progressive learning and complexity management
- Async operation demonstrations and examples

## Path Aliases

Use `@/` for all `src/` imports:

```typescript
// ✅ Correct
import { ChapterPage, HomePage } from '@/pages'
import { simulateApiCall } from '@/utils/async-helpers'

// ❌ Avoid relative imports when possible
import { simulateApiCall } from '../utils/async-helpers'
```

## Modern React + TypeScript Patterns

- **React 19**: Latest features with strict TypeScript
- **Functional Components**: Hooks-based architecture
- **Component Scoped Styles**: Emotion CSS-in-JS (no global CSS)
- **Directory-based Organization**: Each component has its own folder
- **Type Safety**: Strict TypeScript with comprehensive type checking

## Educational Standards

Since this is a tutorial project, prioritize:

1. **Code Clarity**: Descriptive names and extensive comments
2. **Progressive Learning**: Build complexity gradually
3. **Real-world Context**: Practical examples and patterns
4. **Error Handling**: Demonstrate both success and failure scenarios
5. **Interactive Examples**: Components students can experiment with

## Key Principles

- **Separation of Concerns**: Logic, styles, and types in separate files
- **Educational First**: Code clarity over brevity
- **Modern Patterns**: React 19 + TypeScript best practices
- **Scoped Styles**: No global CSS conflicts with Emotion
- **Maintainable Structure**: Organized directories for scalability

---

📖 **For detailed guidance**, reference the specific instruction files in `./instructions/` based on what you're working on.
