# Promise

A React + TypeScript + Vite project with ESLint and Prettier configuration.

## Getting Started

### Prerequisites

Make sure you have [Node.js](https://nodejs.org/) installed on your machine.

### Installation

1. Clone the repository:

   ```bash
   git clone <repository-url>
   cd promise
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

### Running the Project

Start the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## Available Scripts

### Development

- **`npm run dev`** - Start the development server with hot module replacement (HMR)
- **`npm run preview`** - Preview the production build locally

### Building

- **`npm run build`** - Build the project for production (runs TypeScript compiler and Vite build)

### Code Quality

- **`npm run lint`** - Run ESLint to check for code issues
- **`npm run lint:fix`** - Run ESLint and automatically fix issues where possible
- **`npm run format`** - Format all files using Prettier
- **`npm run format:check`** - Check if files are properly formatted (without making changes)
- **`npm run lf`** - Run both lint:fix and format in sequence (shortcut for code cleanup)

## Tech Stack

- **React 19** - UI library
- **TypeScript** - Type-safe JavaScript
- **Vite** - Fast build tool and development server
- **ESLint** - Code linting and quality checks
- **Prettier** - Code formatting
- **Path aliases** - Configured for cleaner imports
