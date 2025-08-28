import styled from '@emotion/styled'

export const DemoSection = styled.section`
  background: #f8fafc;
  padding: 2rem;
  border-radius: 12px;
  margin: 2rem 0;
  border-left: 4px solid #3b82f6;
`

export const ExampleTitle = styled.h3`
  color: #1e40af;
  margin-bottom: 1.5rem;
  font-weight: 600;
`

export const DemoContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
  margin: 1.5rem 0;
`

export const DemoButton = styled.button<{ disabled?: boolean }>`
  background: ${(props) => (props.disabled ? '#d1d5db' : '#3b82f6')};
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 500;
  margin: 0.25rem 0.5rem 0.25rem 0;
  cursor: ${(props) => (props.disabled ? 'not-allowed' : 'pointer')};
  transition: background-color 0.2s;

  &:hover {
    background: ${(props) => (props.disabled ? '#d1d5db' : '#2563eb')};
  }
`

export const StatusIndicator = styled.div<{ status: string }>`
  padding: 0.75rem;
  border-radius: 8px;
  font-weight: 500;
  margin-bottom: 1rem;

  ${(props) => {
    switch (props.status) {
      case 'idle':
        return `
          background: #f3f4f6;
          color: #374151;
        `
      case 'pending':
        return `
          background: #fef3c7;
          color: #92400e;
          border: 1px solid #f59e0b;
        `
      case 'fulfilled':
        return `
          background: #dcfce7;
          color: #166534;
          border: 1px solid #10b981;
        `
      case 'rejected':
        return `
          background: #fee2e2;
          color: #991b1b;
          border: 1px solid #ef4444;
        `
      default:
        return `
          background: #f3f4f6;
          color: #374151;
        `
    }
  }}
`

export const DemoOutput = styled.pre`
  background: #1a202c;
  color: #e2e8f0;
  padding: 1rem;
  border-radius: 8px;
  font-family: 'Fira Code', 'Monaco', monospace;
  font-size: 0.875rem;
  line-height: 1.5;
  white-space: pre-wrap;
  word-wrap: break-word;
  min-height: 120px;
  overflow-x: auto;
`

export const CodeBlock = styled.pre`
  background: #1a202c;
  color: #e2e8f0;
  padding: 1.5rem;
  border-radius: 8px;
  overflow-x: auto;
  font-family: 'Fira Code', 'Monaco', monospace;
  font-size: 0.875rem;
  line-height: 1.5;
  margin: 1.5rem 0;
  border: 1px solid #2d3748;
`

export const LearningObjective = styled.div`
  background: #f0f9ff;
  border: 1px solid #0ea5e9;
  border-radius: 8px;
  padding: 1rem;
  margin: 1rem 0;

  &::before {
    content: '💡 Learning Objective: ';
    font-weight: 600;
    color: #0369a1;
  }
`

export const ImportantNote = styled.div`
  background: #fffbeb;
  border: 1px solid #f59e0b;
  border-radius: 8px;
  padding: 1rem;
  margin: 1rem 0;

  &::before {
    content: '⚠️ Important: ';
    font-weight: 600;
    color: #92400e;
  }
`

export const SuccessNote = styled.div`
  background: #f0fdf4;
  border: 1px solid #10b981;
  border-radius: 8px;
  padding: 1rem;
  margin: 1rem 0;

  &::before {
    content: '✅ Best Practice: ';
    font-weight: 600;
    color: #065f46;
  }
`

export const WarningNote = styled.div`
  background: #fffbeb;
  border: 1px solid #f59e0b;
  border-radius: 8px;
  padding: 1rem;
  margin: 1rem 0;

  &::before {
    content: '⚠️ Warning: ';
    font-weight: 600;
    color: #92400e;
  }
`

export const TutorialContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  line-height: 1.6;

  h1,
  h2,
  h3,
  h4 {
    color: #1e40af;
    margin-top: 2rem;
    margin-bottom: 1rem;
  }

  h1 {
    font-size: 2.25rem;
    border-bottom: 2px solid #3b82f6;
    padding-bottom: 0.5rem;
  }

  h2 {
    font-size: 1.875rem;
  }

  h3 {
    font-size: 1.5rem;
  }

  p {
    margin: 1rem 0;
    color: #374151;
  }

  ul,
  ol {
    margin: 1rem 0;
    padding-left: 2rem;
    color: #374151;
  }

  li {
    margin: 0.5rem 0;
  }
`
