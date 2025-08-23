import styled from '@emotion/styled'

export const CodeBlockWrapper = styled.div`
  margin: 1.5rem 0;
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid #2d3748;
  background: #1a202c; /* Ensure dark background */

  /* Override react-syntax-highlighter default styles */
  pre {
    margin: 0 !important;
    padding: 1rem !important; /* Force generous padding */
    border-radius: 0 !important;
    background: #1a202c !important; /* Force dark background */
  }

  /* Ensure all code content is dark */
  code {
    background: #1a202c !important;
    color: #e2e8f0 !important;
  }

  /* Custom scrollbar for code blocks */
  pre::-webkit-scrollbar {
    height: 6px;
    width: 6px;
  }

  pre::-webkit-scrollbar-track {
    background: #2d3748;
  }

  pre::-webkit-scrollbar-thumb {
    background: #4a5568;
    border-radius: 3px;
  }

  pre::-webkit-scrollbar-thumb:hover {
    background: #718096;
  }
`

export const LanguageLabel = styled.div`
  background: #2d3748;
  color: #e2e8f0;
  padding: 0.5rem 1rem;
  font-size: 0.75rem;
  font-weight: 500;
  text-transform: uppercase;
  border-bottom: 1px solid #4a5568;
  font-family: 'Fira Code', 'Monaco', 'Consolas', monospace;
  letter-spacing: 0.05em;
`
