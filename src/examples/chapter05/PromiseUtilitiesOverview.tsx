import { useState } from 'react'

import {
  CodeSyntaxHighlighter,
  DemoButton,
  DemoContainer,
  DemoSection,
  ExampleTitle,
  ImportantNote,
} from '@/examples/shared'

/**
 * Overview of Promise utility methods with comparison table and basic examples
 */
function PromiseUtilitiesOverview() {
  const [showComparison, setShowComparison] = useState(false)

  return (
    <DemoSection>
      <ExampleTitle>Promise Utilities Overview</ExampleTitle>

      <p>
        JavaScript provides four main Promise utility methods for handling
        multiple promises simultaneously. Each serves different use cases:
      </p>

      <DemoContainer>
        <DemoButton onClick={() => setShowComparison(!showComparison)}>
          {showComparison ? 'Hide' : 'Show'} Promise Utilities Comparison
        </DemoButton>

        {showComparison && (
          <div
            style={{
              overflow: 'auto',
              background: '#f8fafc',
              padding: '1rem',
              borderRadius: '8px',
            }}
          >
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#e2e8f0' }}>
                  <th
                    style={{
                      padding: '0.75rem',
                      textAlign: 'left',
                      border: '1px solid #cbd5e1',
                    }}
                  >
                    Method
                  </th>
                  <th
                    style={{
                      padding: '0.75rem',
                      textAlign: 'left',
                      border: '1px solid #cbd5e1',
                    }}
                  >
                    When It Resolves
                  </th>
                  <th
                    style={{
                      padding: '0.75rem',
                      textAlign: 'left',
                      border: '1px solid #cbd5e1',
                    }}
                  >
                    When It Rejects
                  </th>
                  <th
                    style={{
                      padding: '0.75rem',
                      textAlign: 'left',
                      border: '1px solid #cbd5e1',
                    }}
                  >
                    Use Case
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td
                    style={{
                      padding: '0.75rem',
                      border: '1px solid #cbd5e1',
                      fontWeight: '600',
                    }}
                  >
                    Promise.all()
                  </td>
                  <td
                    style={{ padding: '0.75rem', border: '1px solid #cbd5e1' }}
                  >
                    When ALL promises resolve
                  </td>
                  <td
                    style={{ padding: '0.75rem', border: '1px solid #cbd5e1' }}
                  >
                    As soon as ANY promise rejects
                  </td>
                  <td
                    style={{ padding: '0.75rem', border: '1px solid #cbd5e1' }}
                  >
                    All operations must succeed
                  </td>
                </tr>
                <tr style={{ background: '#f8fafc' }}>
                  <td
                    style={{
                      padding: '0.75rem',
                      border: '1px solid #cbd5e1',
                      fontWeight: '600',
                    }}
                  >
                    Promise.allSettled()
                  </td>
                  <td
                    style={{ padding: '0.75rem', border: '1px solid #cbd5e1' }}
                  >
                    When ALL promises settle (resolve or reject)
                  </td>
                  <td
                    style={{ padding: '0.75rem', border: '1px solid #cbd5e1' }}
                  >
                    Never rejects
                  </td>
                  <td
                    style={{ padding: '0.75rem', border: '1px solid #cbd5e1' }}
                  >
                    Need results from all, even failures
                  </td>
                </tr>
                <tr>
                  <td
                    style={{
                      padding: '0.75rem',
                      border: '1px solid #cbd5e1',
                      fontWeight: '600',
                    }}
                  >
                    Promise.race()
                  </td>
                  <td
                    style={{ padding: '0.75rem', border: '1px solid #cbd5e1' }}
                  >
                    When the FIRST promise resolves
                  </td>
                  <td
                    style={{ padding: '0.75rem', border: '1px solid #cbd5e1' }}
                  >
                    When the FIRST promise rejects
                  </td>
                  <td
                    style={{ padding: '0.75rem', border: '1px solid #cbd5e1' }}
                  >
                    Timeouts, fastest response wins
                  </td>
                </tr>
                <tr style={{ background: '#f8fafc' }}>
                  <td
                    style={{
                      padding: '0.75rem',
                      border: '1px solid #cbd5e1',
                      fontWeight: '600',
                    }}
                  >
                    Promise.any()
                  </td>
                  <td
                    style={{ padding: '0.75rem', border: '1px solid #cbd5e1' }}
                  >
                    When the FIRST promise resolves
                  </td>
                  <td
                    style={{ padding: '0.75rem', border: '1px solid #cbd5e1' }}
                  >
                    When ALL promises reject
                  </td>
                  <td
                    style={{ padding: '0.75rem', border: '1px solid #cbd5e1' }}
                  >
                    Fallback strategies, first success wins
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </DemoContainer>

      <ImportantNote>
        <strong>Key Differences:</strong>
        <ul style={{ marginLeft: '1rem', marginTop: '0.5rem' }}>
          <li>
            <strong>Promise.all()</strong>: All-or-nothing approach - fails fast
          </li>
          <li>
            <strong>Promise.allSettled()</strong>: Always succeeds, returns all
            results
          </li>
          <li>
            <strong>Promise.race()</strong>: Winner takes all - first to finish
            (success or failure)
          </li>
          <li>
            <strong>Promise.any()</strong>: First success wins - ignores
            rejections until all fail
          </li>
        </ul>
      </ImportantNote>

      <h4>Basic Syntax Examples</h4>

      <CodeSyntaxHighlighter language='typescript'>
        {`// Promise.all - Wait for all promises to resolve
const results = await Promise.all([
  fetchUserData(),
  fetchUserPosts(),
  fetchUserPreferences()
])

// Promise.allSettled - Get all results regardless of success/failure
const results = await Promise.allSettled([
  fetchFromServer1(),
  fetchFromServer2(),
  fetchFromServer3()
])

// Promise.race - First promise to settle (resolve or reject) wins
const fastestResult = await Promise.race([
  fetchFromFastServer(),
  fetchFromSlowServer(),
  timeoutAfter(5000)
])

// Promise.any - First promise to resolve wins (ignores rejections)
const firstSuccess = await Promise.any([
  fetchFromPrimaryAPI(),
  fetchFromBackupAPI(),
  fetchFromFallbackAPI()
])`}
      </CodeSyntaxHighlighter>
    </DemoSection>
  )
}

export default PromiseUtilitiesOverview
