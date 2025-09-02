import { Suspense, lazy, useCallback, useState } from 'react'

import {
  CodeSyntaxHighlighter,
  DemoButton,
  DemoContainer,
  DemoSection,
  ExampleTitle,
  StatusIndicator,
} from '@/examples/shared'

// Lazy load components to demonstrate bundle splitting
const HeavyComponent = lazy(() => import('./components/HeavyComponent'))
const ConditionalFeature = lazy(() => import('./components/ConditionalFeature'))

function PerformanceBundleSplittingDemo() {
  const [loadedComponents, setLoadedComponents] = useState<string[]>([])
  const [loadingComponents, setLoadingComponents] = useState<string[]>([])
  const [userRole, setUserRole] = useState<'user' | 'admin'>('user')

  const loadComponent = useCallback(
    async (componentName: string) => {
      if (
        loadedComponents.includes(componentName) ||
        loadingComponents.includes(componentName)
      ) {
        return
      }

      setLoadingComponents((prev) => [...prev, componentName])

      // Simulate network delay for demonstration
      await new Promise((resolve) => setTimeout(resolve, 1500))

      setLoadingComponents((prev) => prev.filter((c) => c !== componentName))
      setLoadedComponents((prev) => [...prev, componentName])
    },
    [loadedComponents, loadingComponents]
  )

  const unloadComponent = useCallback((componentName: string) => {
    setLoadedComponents((prev) => prev.filter((c) => c !== componentName))
  }, [])

  return (
    <DemoSection>
      <ExampleTitle>Demo: Bundle Splitting & Lazy Loading</ExampleTitle>
      <p>
        Experience dynamic code splitting in action. Components are loaded
        on-demand, reducing initial bundle size and improving performance.
      </p>

      <DemoContainer>
        <h4>Dynamic Component Loading</h4>
        <p>
          These components are loaded asynchronously when you request them,
          demonstrating how bundle splitting reduces initial load time:
        </p>

        <div
          style={{
            display: 'flex',
            gap: '1rem',
            flexWrap: 'wrap',
            marginBottom: '1rem',
          }}
        >
          <DemoButton
            onClick={() => loadComponent('heavy')}
            disabled={loadingComponents.includes('heavy')}
          >
            {loadingComponents.includes('heavy')
              ? 'Loading...'
              : 'Load Heavy Component'}
          </DemoButton>

          <DemoButton
            onClick={() => unloadComponent('heavy')}
            disabled={!loadedComponents.includes('heavy')}
          >
            Unload Heavy Component
          </DemoButton>
        </div>

        <StatusIndicator
          status={loadingComponents.includes('heavy') ? 'loading' : 'idle'}
        >
          Heavy Component:{' '}
          {loadingComponents.includes('heavy')
            ? 'Loading...'
            : loadedComponents.includes('heavy')
              ? 'Loaded'
              : 'Not loaded'}
        </StatusIndicator>

        {loadedComponents.includes('heavy') && (
          <Suspense fallback={<div>Loading Heavy Component...</div>}>
            <HeavyComponent />
          </Suspense>
        )}

        <CodeSyntaxHighlighter language='typescript'>
          {`// Bundle splitting with React.lazy()
import { lazy, Suspense } from 'react'

// Component is split into separate bundle
const HeavyComponent = lazy(() => import('./HeavyComponent'))

function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <HeavyComponent />
    </Suspense>
  )
}

// Webpack will create separate chunk: HeavyComponent.chunk.js`}
        </CodeSyntaxHighlighter>
      </DemoContainer>

      <DemoContainer>
        <h4>Conditional Feature Loading</h4>
        <p>
          Load features based on user permissions or conditions. Admin features
          are only loaded when needed:
        </p>

        <div style={{ marginBottom: '1rem' }}>
          <label style={{ marginRight: '1rem' }}>User Role:</label>
          <select
            value={userRole}
            onChange={(e) => setUserRole(e.target.value as 'user' | 'admin')}
          >
            <option value='user'>Regular User</option>
            <option value='admin'>Administrator</option>
          </select>
        </div>

        <StatusIndicator status={userRole === 'admin' ? 'success' : 'idle'}>
          {userRole === 'admin'
            ? 'Admin features available'
            : 'Admin features not loaded'}
        </StatusIndicator>

        {userRole === 'admin' && (
          <Suspense fallback={<div>Loading admin features...</div>}>
            <ConditionalFeature userRole={userRole} />
          </Suspense>
        )}

        <CodeSyntaxHighlighter language='typescript'>
          {`// Conditional loading based on user role
function ConditionalApp({ userRole }) {
  const [AdminFeatures, setAdminFeatures] = useState(null)
  
  useEffect(() => {
    if (userRole === 'admin' && !AdminFeatures) {
      // Only load admin code when user is admin
      import('./AdminFeatures')
        .then(module => setAdminFeatures(() => module.default))
        .catch(error => console.error('[EDUCATIONAL DEMO] Failed to load admin features:', error))
    }
  }, [userRole, AdminFeatures])
  
  return (
    <div>
      <RegularFeatures />
      {userRole === 'admin' && AdminFeatures && (
        <AdminFeatures />
      )}
    </div>
  )
}`}
        </CodeSyntaxHighlighter>
      </DemoContainer>

      <DemoContainer>
        <h4>Route-Based Code Splitting</h4>
        <p>
          Modern applications often split code at the route level, loading page
          components only when users navigate to them:
        </p>

        <CodeSyntaxHighlighter language='typescript'>
          {`// Route-based splitting with React Router
import { lazy } from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'

// Each route component is in a separate bundle
const HomePage = lazy(() => import('./pages/HomePage'))
const ProfilePage = lazy(() => import('./pages/ProfilePage'))
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'))

const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <Suspense fallback={<PageSkeleton />}>
        <HomePage />
      </Suspense>
    )
  },
  {
    path: '/profile',
    element: (
      <Suspense fallback={<PageSkeleton />}>
        <ProfilePage />
      </Suspense>
    )
  },
  {
    path: '/admin',
    element: (
      <RequireAuth role="admin">
        <Suspense fallback={<AdminSkeleton />}>
          <AdminDashboard />
        </Suspense>
      </RequireAuth>
    )
  }
])

function App() {
  return <RouterProvider router={router} />
}`}
        </CodeSyntaxHighlighter>
      </DemoContainer>

      <BundleAnalysisDemo />
    </DemoSection>
  )
}

// Demo showing bundle analysis
function BundleAnalysisDemo() {
  const [analysisData, setAnalysisData] = useState<{
    mainBundle: { size: string; gzipped: string }
    chunks: Array<{
      name: string
      size: string
      gzipped: string
      loadTime: string
    }>
    totalSavings: string
    loadTimeImprovement: string
  } | null>(null)
  const [analyzing, setAnalyzing] = useState(false)

  const runBundleAnalysis = useCallback(async () => {
    setAnalyzing(true)

    // Simulate bundle analysis
    await new Promise((resolve) => setTimeout(resolve, 2000))

    const mockBundleData = {
      mainBundle: { size: '125 KB', gzipped: '42 KB' },
      chunks: [
        {
          name: 'heavy-component',
          size: '87 KB',
          gzipped: '28 KB',
          loadTime: '1.2s',
        },
        {
          name: 'admin-features',
          size: '64 KB',
          gzipped: '21 KB',
          loadTime: '0.8s',
        },
        {
          name: 'charts-library',
          size: '156 KB',
          gzipped: '48 KB',
          loadTime: '1.8s',
        },
      ],
      totalSavings: '307 KB',
      loadTimeImprovement: '67%',
    }

    setAnalysisData(mockBundleData)
    setAnalyzing(false)
  }, [])

  return (
    <DemoContainer>
      <h4>Bundle Analysis Insights</h4>
      <p>
        Analyze your bundle splitting effectiveness to understand performance
        improvements and identify optimization opportunities:
      </p>

      <DemoButton onClick={runBundleAnalysis} disabled={analyzing}>
        {analyzing ? 'Analyzing...' : 'Run Bundle Analysis'}
      </DemoButton>

      {analysisData && (
        <div
          style={{
            background: '#f0f9ff',
            padding: '1.5rem',
            borderRadius: '8px',
            marginTop: '1rem',
          }}
        >
          <h5>Bundle Analysis Results</h5>

          <div style={{ marginBottom: '1rem' }}>
            <strong>Main Bundle:</strong> {analysisData.mainBundle.size}(
            {analysisData.mainBundle.gzipped} gzipped)
          </div>

          <div>
            <strong>Lazy-Loaded Chunks:</strong>
            <ul style={{ marginLeft: '1rem', marginTop: '0.5rem' }}>
              {analysisData.chunks.map((chunk, index) => (
                <li key={index}>
                  <strong>{chunk.name}:</strong> {chunk.size} ({chunk.gzipped}{' '}
                  gzipped) - loads in {chunk.loadTime}
                </li>
              ))}
            </ul>
          </div>

          <div
            style={{
              marginTop: '1rem',
              padding: '1rem',
              background: '#dcfce7',
              borderRadius: '6px',
            }}
          >
            <div>
              <strong>Total Bundle Size Reduction:</strong>{' '}
              {analysisData.totalSavings}
            </div>
            <div>
              <strong>Initial Load Time Improvement:</strong>{' '}
              {analysisData.loadTimeImprovement}
            </div>
          </div>
        </div>
      )}

      <CodeSyntaxHighlighter language='bash'>
        {`# Bundle analysis commands for different tools

# Webpack Bundle Analyzer
npm install --save-dev webpack-bundle-analyzer
npm run build -- --analyze

# Rollup Plugin Visualizer  
npm install --save-dev rollup-plugin-visualizer
npm run build && npx vite-bundle-analyzer dist

# Source Map Explorer
npm install --save-dev source-map-explorer  
npm run build && npx source-map-explorer 'dist/assets/*.js'

# Bundle size tracking in CI/CD
npm install --save-dev bundlesize
# Add to package.json:
{
  "bundlesize": [
    {
      "path": "dist/assets/*.js",
      "maxSize": "100 KB"
    }
  ]
}`}
      </CodeSyntaxHighlighter>
    </DemoContainer>
  )
}

export default PerformanceBundleSplittingDemo
