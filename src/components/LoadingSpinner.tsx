import { keyframes } from '@emotion/react'
import styled from '@emotion/styled'

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 50vh;
  padding: var(--spacing-lg);
`

const Spinner = styled.div`
  width: 40px;
  height: 40px;
  border: 4px solid var(--bg-tertiary);
  border-top: 4px solid var(--color-accent);
  border-radius: 50%;
  animation: ${spin} 1s linear infinite;
  margin-bottom: var(--spacing-md);
`

const LoadingText = styled.p`
  color: var(--text-secondary);
  font-size: var(--font-size-base);
  margin: 0;
`

interface LoadingSpinnerProps {
  message?: string
}

function LoadingSpinner({ message = 'Loading...' }: LoadingSpinnerProps) {
  return (
    <LoadingContainer>
      <Spinner />
      <LoadingText>{message}</LoadingText>
    </LoadingContainer>
  )
}

export default LoadingSpinner
