import { useEffect, useState } from 'react'

import {
  CodeSyntaxHighlighter,
  LearningObjective,
  TutorialContent,
} from '@/examples/shared'

import CommonAsyncPitfallsDemo from './CommonAsyncPitfallsDemo'
import PerformanceBundleSplittingDemo from './PerformanceBundleSplittingDemo'
import PerformanceCachingDemo from './PerformanceCachingDemo'
import PerformanceLazyLoadingDemo from './PerformanceLazyLoadingDemo'
import PerformanceMonitoringDemo from './PerformanceMonitoringDemo'

function Chapter10Content() {
  const [showDemo, setShowDemo] = useState(false)

  useEffect(() => {
    // Small delay to demonstrate progressive loading
    const timer = setTimeout(() => setShowDemo(true), 300)
    return () => clearTimeout(timer)
  }, [])

  return (
    <TutorialContent>
      <h1>Chapter 10: Performance and Best Practices</h1>

      <LearningObjective>
        Master advanced async performance optimization techniques, identify and
        avoid common pitfalls, implement effective caching strategies, and apply
        production-ready best practices for async React applications.
      </LearningObjective>

      <h2>10.1 Common Async Pitfalls and How to Avoid Them</h2>
      <p>
        Even experienced developers can fall into async pitfalls that lead to
        memory leaks, race conditions, and poor user experience. Understanding
        these common mistakes is crucial for building robust React applications.
      </p>

      <h3>Memory Leaks with Unhandled Promises</h3>

      <CodeSyntaxHighlighter language='typescript'>
        {`// ❌ BAD: Memory leak from unhandled promise
function BadComponent() {
  const [data, setData] = useState(null)
  
  useEffect(() => {
    // This promise might resolve after component unmounts
    fetchUserData().then(setData)
    // No cleanup function = potential memory leak!
  }, [])

  return <div>{data?.name}</div>
}

// ✅ GOOD: Proper cleanup with AbortController
function GoodComponent() {
  const [data, setData] = useState(null)
  
  useEffect(() => {
    const controller = new AbortController()
    
    const loadData = async () => {
      try {
        const result = await fetchUserData({ 
          signal: controller.signal 
        })
        // Only update state if component is still mounted
        if (!controller.signal.aborted) {
          setData(result)
        }
      } catch (error) {
        if (error.name !== 'AbortError') {
          console.error('Failed to load data:', error)
        }
      }
    }
    
    loadData()
    
    // Cleanup: cancel the request if component unmounts
    return () => controller.abort()
  }, [])

  return <div>{data?.name}</div>
}`}
      </CodeSyntaxHighlighter>

      <h3>Race Conditions in React State Updates</h3>

      <CodeSyntaxHighlighter language='typescript'>
        {`// ❌ BAD: Race condition with multiple async requests
function BadUserProfile({ userId }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(false)
  
  useEffect(() => {
    setLoading(true)
    // If userId changes quickly, older requests might overwrite newer ones
    fetchUser(userId).then(userData => {
      setUser(userData)      // ⚠️ Potential race condition!
      setLoading(false)
    })
  }, [userId])

  return loading ? <div>Loading...</div> : <div>{user?.name}</div>
}

// ✅ GOOD: Prevent race conditions with cleanup
function GoodUserProfile({ userId }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(false)
  
  useEffect(() => {
    let isCurrent = true
    setLoading(true)
    
    const loadUser = async () => {
      try {
        const userData = await fetchUser(userId)
        
        // Only update if this effect is still current
        if (isCurrent) {
          setUser(userData)
          setLoading(false)
        }
      } catch (error) {
        if (isCurrent) {
          console.error('Failed to load user:', error)
          setLoading(false)
        }
      }
    }
    
    loadUser()
    
    // Mark this effect as stale when cleanup runs
    return () => {
      isCurrent = false
    }
  }, [userId])

  return loading ? <div>Loading...</div> : <div>{user?.name}</div>
}`}
      </CodeSyntaxHighlighter>

      {showDemo && (
        <>
          <CommonAsyncPitfallsDemo />

          <h2>10.2 Performance Optimization Strategies</h2>
          <p>
            Performance optimization in async React applications involves
            strategic code splitting, lazy loading, intelligent caching, and
            efficient resource management. These techniques can significantly
            improve user experience and application responsiveness.
          </p>

          <h3>Bundle Splitting with Dynamic Imports</h3>

          <CodeSyntaxHighlighter language='typescript'>
            {`// Strategic code splitting for async components
import { lazy, Suspense } from 'react'
import { ErrorBoundary } from '@/components'

// Split heavy components into separate chunks
const HeavyDashboard = lazy(() => import('./HeavyDashboard'))
const AdminPanel = lazy(() => import('./AdminPanel'))
const ReportsModule = lazy(() => 
  import('./ReportsModule').then(module => ({
    default: module.ReportsModule
  }))
)

// Route-level code splitting
const routes = [
  {
    path: '/dashboard',
    element: (
      <ErrorBoundary>
        <Suspense fallback={<DashboardSkeleton />}>
          <HeavyDashboard />
        </Suspense>
      </ErrorBoundary>
    )
  },
  {
    path: '/admin',
    element: (
      <ErrorBoundary>
        <Suspense fallback={<AdminSkeleton />}>
          <AdminPanel />
        </Suspense>
      </ErrorBoundary>
    )
  }
]

// Feature-based splitting
const ConditionalFeature = ({ userRole, children }) => {
  const [FeatureComponent, setFeatureComponent] = useState(null)
  
  useEffect(() => {
    if (userRole === 'admin') {
      // Only load admin features when needed
      import('./AdminFeatures')
        .then(module => setFeatureComponent(() => module.default))
        .catch(error => console.error('Failed to load admin features:', error))
    }
  }, [userRole])
  
  if (userRole === 'admin' && FeatureComponent) {
    return <FeatureComponent>{children}</FeatureComponent>
  }
  
  return children
}`}
          </CodeSyntaxHighlighter>

          <PerformanceBundleSplittingDemo />

          <h3>Smart Caching Strategies</h3>

          <CodeSyntaxHighlighter language='typescript'>
            {`// Multi-level caching strategy for API data
class AsyncCache {
  private memoryCache = new Map()
  private readonly CACHE_DURATION = 5 * 60 * 1000 // 5 minutes
  
  // Level 1: Memory cache (fastest)
  get(key: string) {
    const cached = this.memoryCache.get(key)
    if (cached && Date.now() - cached.timestamp < this.CACHE_DURATION) {
      return cached.data
    }
    return null
  }
  
  set(key: string, data: any) {
    this.memoryCache.set(key, {
      data,
      timestamp: Date.now()
    })
    
    // Level 2: IndexedDB for persistence (slower but survives page refresh)
    this.persistToIndexedDB(key, data)
  }
  
  private async persistToIndexedDB(key: string, data: any) {
    try {
      const db = await this.openDB()
      const transaction = db.transaction(['cache'], 'readwrite')
      const store = transaction.objectStore('cache')
      
      await store.put({
        key,
        data,
        timestamp: Date.now()
      })
    } catch (error) {
      console.warn('Failed to persist cache to IndexedDB:', error)
    }
  }
}

// React hook for cached API calls
function useCachedAPI<T>(key: string, fetcher: () => Promise<T>) {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  const cache = useRef(new AsyncCache())
  
  const fetchData = useCallback(async () => {
    // Check cache first
    const cached = cache.current.get(key)
    if (cached) {
      setData(cached)
      return cached
    }
    
    setLoading(true)
    setError(null)
    
    try {
      const result = await fetcher()
      cache.current.set(key, result)
      setData(result)
      return result
    } catch (err) {
      setError(err as Error)
      throw err
    } finally {
      setLoading(false)
    }
  }, [key, fetcher])
  
  useEffect(() => {
    fetchData()
  }, [fetchData])
  
  return { data, loading, error, refetch: fetchData }
}`}
          </CodeSyntaxHighlighter>

          <PerformanceCachingDemo />

          <h3>Lazy Loading and Progressive Enhancement</h3>

          <CodeSyntaxHighlighter language='typescript'>
            {`// Progressive image loading with intersection observer
function LazyImage({ src, alt, placeholder }) {
  const [isLoaded, setIsLoaded] = useState(false)
  const [isInView, setIsInView] = useState(false)
  const imgRef = useRef<HTMLImageElement>(null)
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true)
          observer.disconnect()
        }
      },
      { threshold: 0.1 }
    )
    
    if (imgRef.current) {
      observer.observe(imgRef.current)
    }
    
    return () => observer.disconnect()
  }, [])
  
  useEffect(() => {
    if (isInView && !isLoaded) {
      const img = new Image()
      img.onload = () => setIsLoaded(true)
      img.src = src
    }
  }, [isInView, src, isLoaded])
  
  return (
    <div ref={imgRef} className="lazy-image-container">
      {isLoaded ? (
        <img src={src} alt={alt} />
      ) : (
        <div className="placeholder">{placeholder}</div>
      )}
    </div>
  )
}

// Progressive data loading for large lists
function VirtualizedAsyncList({ endpoint, pageSize = 20 }) {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [page, setPage] = useState(0)
  
  const loadMoreItems = useCallback(async () => {
    if (loading || !hasMore) return
    
    setLoading(true)
    try {
      const response = await fetch(
        \`\${endpoint}?page=\${page}&limit=\${pageSize}\`
      )
      const newItems = await response.json()
      
      if (newItems.length < pageSize) {
        setHasMore(false)
      }
      
      setItems(prev => [...prev, ...newItems])
      setPage(prev => prev + 1)
    } catch (error) {
      console.error('Failed to load more items:', error)
    } finally {
      setLoading(false)
    }
  }, [endpoint, page, pageSize, loading, hasMore])
  
  // Auto-load more when near the bottom
  useEffect(() => {
    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = document.documentElement
      
      if (scrollTop + clientHeight >= scrollHeight - 1000) {
        loadMoreItems()
      }
    }
    
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [loadMoreItems])
  
  useEffect(() => {
    loadMoreItems() // Load initial items
  }, [])
  
  return (
    <div>
      {items.map((item, index) => (
        <AsyncListItem key={item.id || index} item={item} />
      ))}
      {loading && <div>Loading more items...</div>}
      {!hasMore && <div>No more items to load</div>}
    </div>
  )
}`}
          </CodeSyntaxHighlighter>

          <PerformanceLazyLoadingDemo />

          <h3>Performance Monitoring and Profiling</h3>

          <CodeSyntaxHighlighter language='typescript'>
            {`// Performance monitoring for async operations
class AsyncPerformanceMonitor {
  private metrics = new Map()
  
  // Track async operation performance
  async measureAsync<T>(
    operationName: string, 
    operation: () => Promise<T>
  ): Promise<T> {
    const startTime = performance.now()
    const startMemory = (performance as any).memory?.usedJSHeapSize || 0
    
    try {
      const result = await operation()
      
      const endTime = performance.now()
      const endMemory = (performance as any).memory?.usedJSHeapSize || 0
      
      this.recordMetric(operationName, {
        duration: endTime - startTime,
        memoryDelta: endMemory - startMemory,
        success: true,
        timestamp: new Date().toISOString()
      })
      
      return result
    } catch (error) {
      const endTime = performance.now()
      
      this.recordMetric(operationName, {
        duration: endTime - startTime,
        success: false,
        error: error.message,
        timestamp: new Date().toISOString()
      })
      
      throw error
    }
  }
  
  private recordMetric(name: string, metric: any) {
    if (!this.metrics.has(name)) {
      this.metrics.set(name, [])
    }
    
    this.metrics.get(name).push(metric)
    
    // Send to analytics in production
    if (process.env.NODE_ENV === 'production') {
      this.sendToAnalytics(name, metric)
    }
  }
  
  private sendToAnalytics(name: string, metric: any) {
    // Send performance data to your analytics service
    fetch('/api/analytics/performance', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ operation: name, ...metric })
    }).catch(() => {
      // Silent fail for analytics
    })
  }
  
  // Get performance insights
  getMetrics(operationName?: string) {
    if (operationName) {
      return this.metrics.get(operationName) || []
    }
    return Object.fromEntries(this.metrics)
  }
  
  // Get average performance for an operation
  getAveragePerformance(operationName: string) {
    const metrics = this.metrics.get(operationName) || []
    if (metrics.length === 0) return null
    
    const successful = metrics.filter(m => m.success)
    const avgDuration = successful.reduce((sum, m) => sum + m.duration, 0) / successful.length
    const successRate = successful.length / metrics.length
    
    return {
      averageDuration: Math.round(avgDuration),
      successRate: Math.round(successRate * 100),
      totalOperations: metrics.length
    }
  }
}

// React hook for performance monitoring
function usePerformanceMonitor() {
  const monitor = useRef(new AsyncPerformanceMonitor())
  
  const measureAsync = useCallback(
    async <T>(name: string, operation: () => Promise<T>): Promise<T> => {
      return monitor.current.measureAsync(name, operation)
    },
    []
  )
  
  const getMetrics = useCallback((name?: string) => {
    return monitor.current.getMetrics(name)
  }, [])
  
  const getAveragePerformance = useCallback((name: string) => {
    return monitor.current.getAveragePerformance(name)
  }, [])
  
  return { measureAsync, getMetrics, getAveragePerformance }
}

// Usage in components
function DataDashboard() {
  const { measureAsync, getAveragePerformance } = usePerformanceMonitor()
  const [data, setData] = useState(null)
  const [performanceStats, setPerformanceStats] = useState(null)
  
  const loadDashboardData = async () => {
    const result = await measureAsync('dashboard-data-load', async () => {
      const [users, analytics, reports] = await Promise.all([
        fetchUsers(),
        fetchAnalytics(),
        fetchReports()
      ])
      
      return { users, analytics, reports }
    })
    
    setData(result)
    
    // Update performance stats
    const stats = getAveragePerformance('dashboard-data-load')
    setPerformanceStats(stats)
  }
  
  return (
    <div>
      <div>Dashboard Data</div>
      {performanceStats && (
        <div>
          Avg Load Time: {performanceStats.averageDuration}ms
          Success Rate: {performanceStats.successRate}%
        </div>
      )}
    </div>
  )
}`}
          </CodeSyntaxHighlighter>

          <PerformanceMonitoringDemo />

          <h2>10.3 Production-Ready Best Practices</h2>

          <p>
            Building production-ready async React applications requires
            attention to error boundaries, graceful degradation, monitoring, and
            comprehensive testing. These patterns ensure your application
            performs well under real-world conditions.
          </p>

          <h3>Comprehensive Error Boundaries for Async Operations</h3>

          <CodeSyntaxHighlighter language='typescript'>
            {`// Production-ready error boundary with async error handling
class AsyncErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      retryCount: 0
    }
  }
  
  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }
  
  componentDidCatch(error, errorInfo) {
    this.setState({ errorInfo })
    
    // Log error to monitoring service
    this.logErrorToService(error, errorInfo)
  }
  
  logErrorToService = async (error, errorInfo) => {
    try {
      await fetch('/api/errors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          error: error.toString(),
          stack: error.stack,
          componentStack: errorInfo.componentStack,
          timestamp: new Date().toISOString(),
          userAgent: navigator.userAgent,
          url: window.location.href
        })
      })
    } catch (logError) {
      // Silent fail - don't let logging errors break the app
      console.error('Failed to log error:', logError)
    }
  }
  
  handleRetry = () => {
    this.setState(prevState => ({
      hasError: false,
      error: null,
      errorInfo: null,
      retryCount: prevState.retryCount + 1
    }))
  }
  
  render() {
    if (this.state.hasError) {
      const canRetry = this.state.retryCount < 3
      
      return (
        <div className="error-boundary">
          <h2>Something went wrong</h2>
          <p>We're sorry, but something unexpected happened.</p>
          
          {process.env.NODE_ENV === 'development' && (
            <details>
              <summary>Error details (development only)</summary>
              <pre>{this.state.error.toString()}</pre>
              <pre>{this.state.errorInfo.componentStack}</pre>
            </details>
          )}
          
          <div className="error-actions">
            {canRetry && (
              <button onClick={this.handleRetry}>
                Try Again ({3 - this.state.retryCount} attempts left)
              </button>
            )}
            <button onClick={() => window.location.reload()}>
              Reload Page
            </button>
          </div>
        </div>
      )
    }
    
    return this.props.children
  }
}`}
          </CodeSyntaxHighlighter>

          <h3>Graceful Degradation Patterns</h3>

          <CodeSyntaxHighlighter language='typescript'>
            {`// Graceful degradation for async features
function AdvancedFeatureWrapper({ children, fallback }) {
  const [isSupported, setIsSupported] = useState(null)
  const [feature, setFeature] = useState(null)
  
  useEffect(() => {
    const checkFeatureSupport = async () => {
      try {
        // Check for required APIs
        if (!('serviceWorker' in navigator) || 
            !('indexedDB' in window) ||
            !('fetch' in window)) {
          setIsSupported(false)
          return
        }
        
        // Try to load advanced feature
        const module = await import('./AdvancedFeature')
        setFeature(() => module.default)
        setIsSupported(true)
      } catch (error) {
        console.warn('Advanced feature not available:', error)
        setIsSupported(false)
      }
    }
    
    checkFeatureSupport()
  }, [])
  
  // Loading state
  if (isSupported === null) {
    return <div>Checking feature availability...</div>
  }
  
  // Fallback for unsupported environments
  if (!isSupported || !feature) {
    return fallback || children
  }
  
  // Enhanced experience for supported environments
  const Feature = feature
  return <Feature>{children}</Feature>
}

// Network-aware data loading
function useNetworkAwareLoading(endpoint, options = {}) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [networkStatus, setNetworkStatus] = useState('online')
  
  useEffect(() => {
    const updateNetworkStatus = () => {
      setNetworkStatus(navigator.onLine ? 'online' : 'offline')
    }
    
    window.addEventListener('online', updateNetworkStatus)
    window.addEventListener('offline', updateNetworkStatus)
    
    return () => {
      window.removeEventListener('online', updateNetworkStatus)
      window.removeEventListener('offline', updateNetworkStatus)
    }
  }, [])
  
  const loadData = useCallback(async () => {
    // Skip loading if offline unless explicitly allowed
    if (networkStatus === 'offline' && !options.allowOffline) {
      setError(new Error('Cannot load data while offline'))
      return
    }
    
    setLoading(true)
    setError(null)
    
    try {
      let result
      
      if (networkStatus === 'offline' && options.cacheKey) {
        // Try to load from cache when offline
        result = await loadFromCache(options.cacheKey)
        if (!result) {
          throw new Error('No cached data available')
        }
      } else {
        // Normal network request
        result = await fetch(endpoint).then(res => res.json())
        
        // Cache for offline use
        if (options.cacheKey) {
          await saveToCache(options.cacheKey, result)
        }
      }
      
      setData(result)
    } catch (err) {
      setError(err)
    } finally {
      setLoading(false)
    }
  }, [endpoint, networkStatus, options])
  
  return { 
    data, 
    loading, 
    error, 
    networkStatus, 
    reload: loadData 
  }
}`}
          </CodeSyntaxHighlighter>

          <h2>Summary: Async Performance Checklist</h2>

          <p>
            Use this checklist to ensure your async React code follows
            performance best practices:
          </p>

          <CodeSyntaxHighlighter language='markdown'>
            {`## Async Performance Checklist

### Memory Management
- [ ] Clean up async operations in useEffect cleanup functions
- [ ] Use AbortController for cancellable requests  
- [ ] Implement proper error boundaries for async operations
- [ ] Monitor memory usage in development tools

### Race Conditions
- [ ] Prevent stale state updates with cleanup flags
- [ ] Use proper dependency arrays in useEffect
- [ ] Implement request cancellation for rapid state changes
- [ ] Consider using useCallback for stable function references

### Performance Optimization  
- [ ] Implement strategic code splitting for large components
- [ ] Use lazy loading for images and non-critical resources
- [ ] Cache API responses with appropriate invalidation strategies
- [ ] Monitor bundle sizes and async chunk loading times

### Error Handling
- [ ] Implement retry logic with exponential backoff
- [ ] Provide fallbacks for failed async operations
- [ ] Log errors to monitoring services in production
- [ ] Test error scenarios and edge cases

### User Experience
- [ ] Show loading states for async operations > 200ms
- [ ] Provide meaningful error messages to users
- [ ] Implement optimistic updates where appropriate
- [ ] Support offline functionality where relevant

### Monitoring & Analytics
- [ ] Track async operation performance metrics
- [ ] Monitor error rates and success rates  
- [ ] Set up alerts for performance regressions
- [ ] Use performance profiling tools regularly`}
          </CodeSyntaxHighlighter>
        </>
      )}
    </TutorialContent>
  )
}

export default Chapter10Content
