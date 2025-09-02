import { Component, type ErrorInfo, type ReactNode } from 'react'

import styled from '@emotion/styled'

import { logger } from '@/utils/logger'

const ErrorContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 50vh;
  padding: 2rem;
  text-align: center;
`

const ErrorTitle = styled.h1`
  color: #dc2626;
  font-size: 2rem;
  margin-bottom: 1rem;
`

const ErrorMessage = styled.p`
  color: #6b7280;
  font-size: 1.1rem;
  margin-bottom: 2rem;
  line-height: 1.6;
  max-width: 600px;
`

const ErrorButton = styled.button`
  background: #3b82f6;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background: #2563eb;
  }
`

interface ErrorBoundaryProps {
  children: ReactNode
  fallback?: ReactNode
}

interface ErrorBoundaryState {
  hasError: boolean
  error?: Error
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    logger.error(
      '[EDUCATIONAL DEMO] ErrorBoundary caught an error:',
      error,
      errorInfo
    )

    // Educational Demo: In production, you might want to log this to an error reporting service
    if (process.env.NODE_ENV === 'production') {
      // Example: logErrorToService(error, errorInfo)
    }
  }

  handleReset = () => {
    this.setState({ hasError: false, error: undefined })
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <ErrorContainer>
          <ErrorTitle>🚨 Something went wrong</ErrorTitle>
          <ErrorMessage>
            We encountered an unexpected error while loading the tutorial. This
            might be a temporary issue. Please try refreshing the page or
            contact support if the problem persists.
          </ErrorMessage>
          {process.env.NODE_ENV === 'development' && this.state.error && (
            <details style={{ marginBottom: '2rem', textAlign: 'left' }}>
              <summary style={{ cursor: 'pointer', marginBottom: '1rem' }}>
                Error Details (Development)
              </summary>
              <pre
                style={{
                  background: '#f3f4f6',
                  padding: '1rem',
                  borderRadius: '4px',
                  fontSize: '0.875rem',
                  overflow: 'auto',
                  maxWidth: '100%',
                }}
              >
                {this.state.error.stack}
              </pre>
            </details>
          )}
          <ErrorButton onClick={this.handleReset}>Try Again</ErrorButton>
        </ErrorContainer>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
