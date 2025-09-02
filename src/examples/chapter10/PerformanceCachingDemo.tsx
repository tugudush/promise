import { useCallback, useRef, useState } from 'react'

import {
  CodeSyntaxHighlighter,
  DemoButton,
  DemoContainer,
  DemoSection,
  ExampleTitle,
  StatusIndicator,
} from '@/examples/shared'
import { simulateApiCall } from '@/utils/async-helpers'

// Simple cache implementation for demonstration
class SimpleCache {
  private cache = new Map()
  private readonly ttl: number

  constructor(ttlMs: number = 5 * 60 * 1000) {
    this.ttl = ttlMs
  }

  get(key: string) {
    const item = this.cache.get(key)
    if (!item) return null

    if (Date.now() > item.expiry) {
      this.cache.delete(key)
      return null
    }

    return item.data
  }

  set(key: string, data: unknown) {
    this.cache.set(key, {
      data,
      expiry: Date.now() + this.ttl,
    })
  }

  clear() {
    this.cache.clear()
  }

  size() {
    return this.cache.size
  }

  keys() {
    return Array.from(this.cache.keys())
  }
}

function PerformanceCachingDemo() {
  return (
    <DemoSection>
      <ExampleTitle>Demo: Caching Strategies</ExampleTitle>
      <p>
        Explore different caching approaches to improve performance and reduce
        unnecessary network requests in async React applications.
      </p>

      <MemoryCacheDemo />
      <RequestDeduplicationDemo />
      <CacheInvalidationDemo />
    </DemoSection>
  )
}

// Memory cache demonstration
function MemoryCacheDemo() {
  const [data, setData] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [cacheStats, setCacheStats] = useState({ hits: 0, misses: 0 })
  const cache = useRef(new SimpleCache(10000)) // 10 second TTL

  const fetchData = useCallback(async (useCache: boolean = true) => {
    const cacheKey = 'demo-data'

    setLoading(true)

    // Check cache first if enabled
    if (useCache) {
      const cached = cache.current.get(cacheKey)
      if (cached) {
        setData(cached as string)
        setCacheStats((prev) => ({ ...prev, hits: prev.hits + 1 }))
        setLoading(false)
        return
      }
    }

    // Cache miss - fetch from "API"
    setCacheStats((prev) => ({ ...prev, misses: prev.misses + 1 }))

    try {
      const result = await simulateApiCall(2000)
      const dataWithTimestamp = `${result} (fetched at ${new Date().toLocaleTimeString()})`

      if (useCache) {
        cache.current.set(cacheKey, dataWithTimestamp)
      }

      setData(dataWithTimestamp)
    } catch {
      // Silently handle fetch errors in demo
    } finally {
      setLoading(false)
    }
  }, [])

  const clearCache = useCallback(() => {
    cache.current.clear()
    setCacheStats({ hits: 0, misses: 0 })
  }, [])

  return (
    <DemoContainer>
      <h4>Memory Cache Implementation</h4>
      <p>
        Compare cached vs non-cached requests. Cached requests return
        immediately, while non-cached requests take 2 seconds:
      </p>

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
        <DemoButton onClick={() => fetchData(true)} disabled={loading}>
          Fetch with Cache
        </DemoButton>
        <DemoButton onClick={() => fetchData(false)} disabled={loading}>
          Fetch without Cache
        </DemoButton>
        <DemoButton onClick={clearCache}>Clear Cache</DemoButton>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1rem',
          marginBottom: '1rem',
        }}
      >
        <StatusIndicator status={loading ? 'loading' : 'idle'}>
          {loading ? 'Loading...' : data || 'No data loaded'}
        </StatusIndicator>

        <div
          style={{
            background: '#f0f9ff',
            padding: '1rem',
            borderRadius: '6px',
            fontSize: '0.875rem',
          }}
        >
          <div>
            <strong>Cache Stats:</strong>
          </div>
          <div>Hits: {cacheStats.hits}</div>
          <div>Misses: {cacheStats.misses}</div>
          <div>
            Hit Rate:{' '}
            {cacheStats.hits + cacheStats.misses > 0
              ? Math.round(
                  (cacheStats.hits / (cacheStats.hits + cacheStats.misses)) *
                    100
                )
              : 0}
            %
          </div>
        </div>
      </div>

      <CodeSyntaxHighlighter language='typescript'>
        {`// Simple memory cache implementation
class SimpleCache {
  private cache = new Map()
  private readonly ttl: number

  constructor(ttlMs = 5 * 60 * 1000) {
    this.ttl = ttlMs
  }

  get(key: string) {
    const item = this.cache.get(key)
    if (!item || Date.now() > item.expiry) {
      this.cache.delete(key)
      return null
    }
    return item.data
  }

  set(key: string, data: any) {
    this.cache.set(key, {
      data,
      expiry: Date.now() + this.ttl
    })
  }
}

// Usage in React hook
function useCachedData(key: string, fetcher: () => Promise<any>) {
  const cache = useRef(new SimpleCache())
  
  const fetchData = useCallback(async () => {
    const cached = cache.current.get(key)
    if (cached) return cached
    
    const result = await fetcher()
    cache.current.set(key, result)
    return result
  }, [key, fetcher])
  
  return { fetchData }
}`}
      </CodeSyntaxHighlighter>
    </DemoContainer>
  )
}

// Request deduplication demonstration
function RequestDeduplicationDemo() {
  const [results, setResults] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [requestCount, setRequestCount] = useState(0)
  const pendingRequests = useRef(new Map<string, Promise<string>>())

  const fetchWithDeduplication = useCallback(async (id: string) => {
    const key = `request-${id}`

    // Check if request is already pending
    if (pendingRequests.current.has(key)) {
      // Request deduplication in action
      return pendingRequests.current.get(key)!
    }

    // Create new request
    setRequestCount((prev) => prev + 1)
    const requestPromise = simulateApiCall(2000).then((result) => {
      const response = `${result} for ID: ${id}`
      pendingRequests.current.delete(key)
      return response
    })

    pendingRequests.current.set(key, requestPromise)
    return requestPromise
  }, [])

  const simulateMultipleRequests = useCallback(async () => {
    setLoading(true)
    setResults([])
    setRequestCount(0)

    // Simulate multiple components requesting the same data simultaneously
    const promises = [
      fetchWithDeduplication('user-123'),
      fetchWithDeduplication('user-123'), // Duplicate
      fetchWithDeduplication('user-123'), // Duplicate
      fetchWithDeduplication('user-456'),
      fetchWithDeduplication('user-456'), // Duplicate
    ]

    try {
      const results = await Promise.all(promises)
      setResults(results)
    } catch {
      // Handle request errors silently in demo
    } finally {
      setLoading(false)
    }
  }, [fetchWithDeduplication])

  const simulateWithoutDeduplication = useCallback(async () => {
    setLoading(true)
    setResults([])
    setRequestCount(0)

    // Without deduplication - each request is separate
    const promises = [
      simulateApiCall(2000).then((r) => {
        setRequestCount((prev) => prev + 1)
        return `${r} for ID: user-123`
      }),
      simulateApiCall(2000).then((r) => {
        setRequestCount((prev) => prev + 1)
        return `${r} for ID: user-123`
      }),
      simulateApiCall(2000).then((r) => {
        setRequestCount((prev) => prev + 1)
        return `${r} for ID: user-123`
      }),
      simulateApiCall(2000).then((r) => {
        setRequestCount((prev) => prev + 1)
        return `${r} for ID: user-456`
      }),
      simulateApiCall(2000).then((r) => {
        setRequestCount((prev) => prev + 1)
        return `${r} for ID: user-456`
      }),
    ]

    try {
      const results = await Promise.all(promises)
      setResults(results)
    } catch {
      // Handle request errors silently in demo
    } finally {
      setLoading(false)
    }
  }, [])

  return (
    <DemoContainer>
      <h4>Request Deduplication</h4>
      <p>
        When multiple components need the same data simultaneously,
        deduplication prevents redundant network requests:
      </p>

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
        <DemoButton onClick={simulateMultipleRequests} disabled={loading}>
          5 Requests with Deduplication
        </DemoButton>
        <DemoButton onClick={simulateWithoutDeduplication} disabled={loading}>
          5 Requests without Deduplication
        </DemoButton>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr auto',
          gap: '1rem',
          marginBottom: '1rem',
        }}
      >
        <StatusIndicator status={loading ? 'loading' : 'idle'}>
          {loading
            ? 'Processing requests...'
            : `${results.length} responses received`}
        </StatusIndicator>

        <div
          style={{
            background: requestCount <= 2 ? '#dcfce7' : '#fee2e2',
            color: requestCount <= 2 ? '#166534' : '#dc2626',
            padding: '0.5rem 1rem',
            borderRadius: '6px',
            fontSize: '0.875rem',
            fontWeight: '600',
          }}
        >
          Network Requests: {requestCount}
        </div>
      </div>

      {results.length > 0 && (
        <div
          style={{
            background: '#f9fafb',
            padding: '1rem',
            borderRadius: '6px',
            maxHeight: '200px',
            overflowY: 'auto',
          }}
        >
          <h6>Responses:</h6>
          <ul style={{ margin: '0.5rem 0 0 1rem', fontSize: '0.875rem' }}>
            {results.map((result, index) => (
              <li key={index}>{result}</li>
            ))}
          </ul>
        </div>
      )}

      <CodeSyntaxHighlighter language='typescript'>
        {`// Request deduplication implementation
class RequestDeduplicator {
  private pendingRequests = new Map<string, Promise<any>>()

  async fetch<T>(key: string, fetcher: () => Promise<T>): Promise<T> {
    // Return existing promise if request is already pending
    if (this.pendingRequests.has(key)) {
      return this.pendingRequests.get(key)!
    }

    // Create new request and store promise
    const promise = fetcher().finally(() => {
      // Clean up when request completes
      this.pendingRequests.delete(key)
    })

    this.pendingRequests.set(key, promise)
    return promise
  }
}

// Usage with React hook
function useDedupedFetch() {
  const deduplicator = useRef(new RequestDeduplicator())
  
  return useCallback(async (key: string, fetcher: () => Promise<any>) => {
    return deduplicator.current.fetch(key, fetcher)
  }, [])
}`}
      </CodeSyntaxHighlighter>
    </DemoContainer>
  )
}

// Cache invalidation demonstration
function CacheInvalidationDemo() {
  const [userData, setUserData] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [cacheVersion, setCacheVersion] = useState(1)
  const cache = useRef(new SimpleCache(30000)) // 30 second TTL

  const fetchUserData = useCallback(
    async (invalidateCache = false) => {
      const cacheKey = `user-data-v${cacheVersion}`

      setLoading(true)

      if (!invalidateCache) {
        const cached = cache.current.get(cacheKey)
        if (cached) {
          setUserData(cached as string)
          setLoading(false)
          return
        }
      }

      try {
        const result = await simulateApiCall(1500)
        const dataWithVersion = `${result} (v${cacheVersion} at ${new Date().toLocaleTimeString()})`
        cache.current.set(cacheKey, dataWithVersion)
        setUserData(dataWithVersion)
      } catch {
        // Silently handle fetch errors in demo
      } finally {
        setLoading(false)
      }
    },
    [cacheVersion]
  )

  const simulateDataUpdate = useCallback(() => {
    // Simulate updating data on the server
    setCacheVersion((prev) => prev + 1)
    // Clear old cache entries
    cache.current.clear()
  }, [])

  const getCacheInfo = useCallback(() => {
    return {
      size: cache.current.size(),
      keys: cache.current.keys(),
    }
  }, [])

  const cacheInfo = getCacheInfo()

  return (
    <DemoContainer>
      <h4>Cache Invalidation Strategies</h4>
      <p>
        Proper cache invalidation ensures users see fresh data when the
        underlying information changes:
      </p>

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
        <DemoButton onClick={() => fetchUserData(false)} disabled={loading}>
          Fetch (Use Cache)
        </DemoButton>
        <DemoButton onClick={() => fetchUserData(true)} disabled={loading}>
          Force Refresh
        </DemoButton>
        <DemoButton onClick={simulateDataUpdate}>
          Simulate Server Update
        </DemoButton>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '2fr 1fr',
          gap: '1rem',
          marginBottom: '1rem',
        }}
      >
        <StatusIndicator status={loading ? 'loading' : 'idle'}>
          {loading ? 'Loading...' : userData || 'No data loaded'}
        </StatusIndicator>

        <div
          style={{
            background: '#f0f9ff',
            padding: '1rem',
            borderRadius: '6px',
            fontSize: '0.875rem',
          }}
        >
          <div>
            <strong>Cache Info:</strong>
          </div>
          <div>Version: {cacheVersion}</div>
          <div>Entries: {cacheInfo.size}</div>
          <div
            style={{
              fontSize: '0.75rem',
              color: '#6b7280',
              marginTop: '0.5rem',
            }}
          >
            Keys: {cacheInfo.keys.join(', ') || 'None'}
          </div>
        </div>
      </div>

      <CodeSyntaxHighlighter language='typescript'>
        {`// Cache invalidation strategies

// 1. Version-based invalidation
function useVersionedCache(version: number) {
  const cache = useRef(new Map())
  
  const get = (key: string) => {
    const versionedKey = \`\${key}-v\${version}\`
    return cache.current.get(versionedKey)
  }
  
  const set = (key: string, data: any) => {
    const versionedKey = \`\${key}-v\${version}\`
    cache.current.set(versionedKey, data)
  }
  
  return { get, set }
}

// 2. Tag-based invalidation
class TaggedCache {
  private cache = new Map()
  private tags = new Map() // key -> tags[]
  
  set(key: string, data: any, tags: string[] = []) {
    this.cache.set(key, data)
    this.tags.set(key, tags)
  }
  
  invalidateByTag(tag: string) {
    for (const [key, keyTags] of this.tags.entries()) {
      if (keyTags.includes(tag)) {
        this.cache.delete(key)
        this.tags.delete(key)
      }
    }
  }
}

// 3. Time-based invalidation with refresh
class SmartCache {
  private cache = new Map()
  
  async getOrFetch(key: string, fetcher: () => Promise<any>, ttl = 300000) {
    const item = this.cache.get(key)
    
    if (item && Date.now() < item.expiry) {
      return item.data
    }
    
    // Background refresh for expired but existing data
    if (item) {
      this.refreshInBackground(key, fetcher, ttl)
      return item.data // Return stale data while refreshing
    }
    
    // No cached data - fetch immediately
    return this.fetchAndCache(key, fetcher, ttl)
  }
  
  private async refreshInBackground(key: string, fetcher: () => Promise<any>, ttl: number) {
    try {
      const data = await fetcher()
      this.cache.set(key, { data, expiry: Date.now() + ttl })
    } catch (error) {
      console.warn('Background refresh failed:', error)
    }
  }
}`}
      </CodeSyntaxHighlighter>

      <div
        style={{
          background: '#fffbeb',
          padding: '1rem',
          borderRadius: '6px',
          border: '1px solid #f59e0b',
          marginTop: '1rem',
        }}
      >
        <h6 style={{ color: '#92400e', margin: '0 0 0.5rem 0' }}>
          💡 Cache Invalidation Best Practices
        </h6>
        <ul
          style={{
            margin: 0,
            paddingLeft: '1.5rem',
            fontSize: '0.875rem',
            color: '#92400e',
          }}
        >
          <li>Use versioning for data that changes predictably</li>
          <li>Implement tag-based invalidation for related data</li>
          <li>Consider stale-while-revalidate for better UX</li>
          <li>Set appropriate TTL based on data volatility</li>
          <li>Monitor cache hit rates and adjust strategies</li>
        </ul>
      </div>
    </DemoContainer>
  )
}

export default PerformanceCachingDemo
