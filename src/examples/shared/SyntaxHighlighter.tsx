import { memo } from 'react'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism'

import { CodeBlockWrapper, LanguageLabel } from './SyntaxHighlighter.styles'

interface SyntaxHighlighterProps {
  children: string
  language?: string
  showLineNumbers?: boolean
  showLanguageLabel?: boolean
  customStyle?: React.CSSProperties
}

// Enforced dark theme with consistent colors
const DARK_THEME_OVERRIDE = {
  margin: 0,
  padding: '1rem', // Even more padding for comfortable spacing
  fontSize: '0.875rem',
  lineHeight: '1.5',
  fontFamily: '"Fira Code", "Monaco", "Consolas", monospace',
  backgroundColor: '#1a202c !important', // Force dark background
  color: '#e2e8f0 !important', // Force light text
  border: 'none',
  borderRadius: '0',
}

function CodeSyntaxHighlighter({
  children,
  language = 'javascript',
  showLineNumbers = false,
  showLanguageLabel = true, // Default to true for educational clarity
  customStyle = {},
}: SyntaxHighlighterProps) {
  return (
    <CodeBlockWrapper>
      {showLanguageLabel && (
        <LanguageLabel>{language.toUpperCase()}</LanguageLabel>
      )}
      <SyntaxHighlighter
        language={language}
        style={oneDark}
        showLineNumbers={showLineNumbers}
        customStyle={{
          ...DARK_THEME_OVERRIDE,
          borderRadius: showLanguageLabel ? '0 0 8px 8px' : '8px',
          ...customStyle,
        }}
        codeTagProps={{
          style: {
            fontFamily: '"Fira Code", "Monaco", "Consolas", monospace',
            backgroundColor: 'transparent',
          },
        }}
        PreTag={({ children, ...props }) => (
          <pre
            {...props}
            style={{ ...props.style, backgroundColor: '#1a202c' }}
          >
            {children}
          </pre>
        )}
      >
        {children.trim()}
      </SyntaxHighlighter>
    </CodeBlockWrapper>
  )
}

// memo is still useful here because:
// 1. Syntax highlighting is computationally expensive
// 2. Component receives frequently changing string content
// 3. Manual optimization provides better performance than React Compiler for this use case
export default memo(CodeSyntaxHighlighter)
