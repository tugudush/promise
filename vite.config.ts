import react from '@vitejs/plugin-react'
import path from 'path'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react({
      jsxImportSource: '@emotion/react',
      babel: {
        plugins: ['@emotion/babel-plugin'],
      },
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Separate vendor chunks for better caching
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
          // Emotion styling chunks
          emotion: ['@emotion/react', '@emotion/styled'],
          // Syntax highlighter in separate chunk
          'syntax-highlighter': ['react-syntax-highlighter'],
        },
      },
    },
    // Increase chunk size warning limit to 1000kb
    chunkSizeWarningLimit: 1000,
  },
})
