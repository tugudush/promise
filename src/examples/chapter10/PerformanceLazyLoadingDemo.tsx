import { useCallback, useEffect, useRef, useState } from 'react'

import {
  CodeSyntaxHighlighter,
  DemoButton,
  DemoContainer,
  DemoSection,
  ExampleTitle,
  StatusIndicator,
} from '@/examples/shared'

interface LazyImageProps {
  src: string
  alt: string
  placeholder?: string
}

function PerformanceLazyLoadingDemo() {
  return (
    <DemoSection>
      <ExampleTitle>Demo: Lazy Loading Techniques</ExampleTitle>
      <p>
        Discover how lazy loading can improve performance by deferring resource
        loading until they're actually needed.
      </p>

      <LazyImageDemo />
      <InfiniteScrollDemo />
      <ComponentLazyLoadDemo />
    </DemoSection>
  )
}

// Lazy image loading with intersection observer
function LazyImageDemo() {
  const [imageStats, setImageStats] = useState({ loaded: 0, total: 6 })
  const [resetKey, setResetKey] = useState(0)

  const handleImageLoad = useCallback(() => {
    setImageStats((prev) => ({ ...prev, loaded: prev.loaded + 1 }))
  }, [])

  const resetImages = useCallback(() => {
    setImageStats({ loaded: 0, total: 6 })
    setResetKey(prev => prev + 1) // Force component re-mount
  }, [])

  const images = [
    {
      id: 1,
      src: 'https://picsum.photos/300/200?random=1',
      alt: 'Lazy image 1',
    },
    {
      id: 2,
      src: 'https://picsum.photos/300/200?random=2',
      alt: 'Lazy image 2',
    },
    {
      id: 3,
      src: 'https://picsum.photos/300/200?random=3',
      alt: 'Lazy image 3',
    },
    {
      id: 4,
      src: 'https://picsum.photos/300/200?random=4',
      alt: 'Lazy image 4',
    },
    {
      id: 5,
      src: 'https://picsum.photos/300/200?random=5',
      alt: 'Lazy image 5',
    },
    {
      id: 6,
      src: 'https://picsum.photos/300/200?random=6',
      alt: 'Lazy image 6',
    },
  ]

  return (
    <DemoContainer>
      <h4>Lazy Image Loading</h4>
      <p>
        Images are loaded only when they come into view, reducing initial page
        load time and bandwidth usage:
      </p>

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '1rem',
        }}
      >
        <StatusIndicator
          status={
            imageStats.loaded === imageStats.total ? 'success' : 'loading'
          }
        >
          Images loaded: {imageStats.loaded} / {imageStats.total}
        </StatusIndicator>
        <DemoButton onClick={resetImages}>Reset Images</DemoButton>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '1rem',
          marginBottom: '1rem',
          maxHeight: '400px',
          overflowY: 'auto',
          padding: '1rem',
          border: '2px dashed #e5e7eb',
          borderRadius: '8px',
        }}
      >
        {images.map((image) => (
          <LazyImage
            key={`${image.id}-${resetKey}`} // Include resetKey to force re-render on reset
            src={image.src}
            alt={image.alt}
            placeholder='Loading image...'
            onLoad={handleImageLoad}
          />
        ))}
      </div>

      <CodeSyntaxHighlighter language='typescript'>
        {`// Lazy image loading with Intersection Observer
function LazyImage({ src, alt, placeholder }) {
  const [isLoaded, setIsLoaded] = useState(false)
  const [isInView, setIsInView] = useState(false)
  const imgRef = useRef<HTMLDivElement>(null)

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
}`}
      </CodeSyntaxHighlighter>
    </DemoContainer>
  )
}

// Lazy image component implementation
function LazyImage({
  src,
  alt,
  placeholder,
  onLoad,
}: LazyImageProps & { onLoad?: () => void }) {
  const [isLoaded, setIsLoaded] = useState(false)
  const [isInView, setIsInView] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const imgRef = useRef<HTMLDivElement>(null)

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
    if (isInView && !isLoaded && !isLoading) {
      setIsLoading(true)
      const img = new Image()
      img.onload = () => {
        setIsLoaded(true)
        setIsLoading(false)
        onLoad?.()
      }
      img.onerror = () => {
        setIsLoading(false)
      }
      img.src = src
    }
  }, [isInView, src, isLoaded, isLoading, onLoad])

  return (
    <div
      ref={imgRef}
      style={{
        width: '100%',
        height: '200px',
        background: '#f3f4f6',
        borderRadius: '8px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
      }}
    >
      {isLoaded ? (
        <img
          src={src}
          alt={alt}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'opacity 0.3s ease',
          }}
        />
      ) : (
        <div
          style={{
            textAlign: 'center',
            color: '#6b7280',
            fontSize: '0.875rem',
          }}
        >
          {isLoading
            ? 'Loading...'
            : placeholder || 'Image will load when visible'}
        </div>
      )}
    </div>
  )
}

// Infinite scroll demonstration
function InfiniteScrollDemo() {
  const [items, setItems] = useState<Array<{ id: string; content: string }>>([])
  const [loading, setLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [page, setPage] = useState(0)
  const loaderRef = useRef<HTMLDivElement>(null)
  const nextIdRef = useRef(1) // Use ref to ensure unique IDs

  const loadMoreItems = useCallback(async () => {
    if (loading || !hasMore) return

    setLoading(true)

    // Simulate API call with delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const newItems = Array.from({ length: 10 }, (_, index) => ({
      id: `item-${nextIdRef.current + index}`,
      content: `Item ${nextIdRef.current + index} - Loaded at ${new Date().toLocaleTimeString()}`,
    }))

    nextIdRef.current += 10 // Update counter for next batch

    if (page >= 4) {
      // Limit to 50 items for demo
      setHasMore(false)
    }

    setItems((prev) => [...prev, ...newItems])
    setPage((prev) => prev + 1)
    setLoading(false)
  }, [loading, hasMore, page])

  // Intersection observer for infinite scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !loading && hasMore) {
          loadMoreItems()
        }
      },
      { threshold: 1.0 }
    )

    if (loaderRef.current) {
      observer.observe(loaderRef.current)
    }

    return () => observer.disconnect()
  }, [loadMoreItems, loading, hasMore])

  // Load initial items
  useEffect(() => {
    if (items.length === 0) {
      loadMoreItems()
    }
  }, [items.length, loadMoreItems])

  const resetDemo = useCallback(() => {
    setItems([])
    setPage(0)
    setHasMore(true)
    setLoading(false)
    nextIdRef.current = 1 // Reset ID counter
  }, [])

  return (
    <DemoContainer>
      <h4>Infinite Scroll Implementation</h4>
      <p>
        Items are loaded progressively as the user scrolls, providing smooth
        navigation through large datasets:
      </p>

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '1rem',
        }}
      >
        <StatusIndicator
          status={loading ? 'loading' : hasMore ? 'idle' : 'success'}
        >
          Items: {items.length} {!hasMore && '(All loaded)'}
        </StatusIndicator>
        <DemoButton onClick={resetDemo}>Reset Demo</DemoButton>
      </div>

      <div
        style={{
          maxHeight: '300px',
          overflowY: 'auto',
          border: '2px dashed #e5e7eb',
          borderRadius: '8px',
          padding: '1rem',
        }}
      >
        {items.map((item) => (
          <div
            key={item.id}
            style={{
              padding: '0.75rem',
              margin: '0.5rem 0',
              background: '#f9fafb',
              borderRadius: '6px',
              border: '1px solid #e5e7eb',
            }}
          >
            {item.content}
          </div>
        ))}

        {hasMore && (
          <div
            ref={loaderRef}
            style={{
              padding: '1rem',
              textAlign: 'center',
              color: '#6b7280',
              fontSize: '0.875rem',
            }}
          >
            {loading ? 'Loading more items...' : 'Scroll to load more'}
          </div>
        )}

        {!hasMore && (
          <div
            style={{
              padding: '1rem',
              textAlign: 'center',
              color: '#6b7280',
              fontSize: '0.875rem',
              fontStyle: 'italic',
            }}
          >
            No more items to load
          </div>
        )}
      </div>

      <CodeSyntaxHighlighter language='typescript'>
        {`// Infinite scroll implementation
function useInfiniteScroll(loadMore: () => Promise<void>, hasMore: boolean) {
  const loaderRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && hasMore) {
          loadMore()
        }
      },
      { threshold: 1.0 }
    )

    if (loaderRef.current) {
      observer.observe(loaderRef.current)
    }

    return () => observer.disconnect()
  }, [loadMore, hasMore])

  return loaderRef
}

// Usage in component
function InfiniteList() {
  const [items, setItems] = useState([])
  const [hasMore, setHasMore] = useState(true)
  
  const loadMore = useCallback(async () => {
    const newItems = await fetchItems(page)
    setItems(prev => [...prev, ...newItems])
    setHasMore(newItems.length > 0)
  }, [page])
  
  const loaderRef = useInfiniteScroll(loadMore, hasMore)
  
  return (
    <div>
      {items.map(item => <Item key={item.id} {...item} />)}
      {hasMore && <div ref={loaderRef}>Loading...</div>}
    </div>
  )
}`}
      </CodeSyntaxHighlighter>
    </DemoContainer>
  )
}

// Component lazy loading demonstration
function ComponentLazyLoadDemo() {
  const [activeFeatures, setActiveFeatures] = useState<string[]>([])
  const [loadingFeatures, setLoadingFeatures] = useState<string[]>([])

  const features = [
    {
      id: 'charts',
      name: 'Charts Module',
      description: 'Data visualization components',
    },
    { id: 'editor', name: 'Rich Editor', description: 'WYSIWYG text editor' },
    {
      id: 'calendar',
      name: 'Calendar Widget',
      description: 'Event scheduling component',
    },
  ]

  const loadFeature = useCallback(
    async (featureId: string) => {
      if (
        activeFeatures.includes(featureId) ||
        loadingFeatures.includes(featureId)
      ) {
        return
      }

      setLoadingFeatures((prev) => [...prev, featureId])

      // Simulate dynamic import with delay
      await new Promise((resolve) => setTimeout(resolve, 2000))

      setLoadingFeatures((prev) => prev.filter((id) => id !== featureId))
      setActiveFeatures((prev) => [...prev, featureId])
    },
    [activeFeatures, loadingFeatures]
  )

  const unloadFeature = useCallback((featureId: string) => {
    setActiveFeatures((prev) => prev.filter((id) => id !== featureId))
  }, [])

  const renderFeatureComponent = (featureId: string) => {
    const featureComponents = {
      charts: (
        <div
          style={{
            padding: '1rem',
            background: '#dbeafe',
            borderRadius: '6px',
          }}
        >
          📊 Charts component loaded - Ready for data visualization
        </div>
      ),
      editor: (
        <div
          style={{
            padding: '1rem',
            background: '#dcfce7',
            borderRadius: '6px',
          }}
        >
          📝 Rich editor loaded - Text formatting tools available
        </div>
      ),
      calendar: (
        <div
          style={{
            padding: '1rem',
            background: '#fef3c7',
            borderRadius: '6px',
          }}
        >
          📅 Calendar widget loaded - Event scheduling ready
        </div>
      ),
    }

    return (
      featureComponents[featureId as keyof typeof featureComponents] || null
    )
  }

  return (
    <DemoContainer>
      <h4>Component Lazy Loading</h4>
      <p>
        Load heavy feature components only when users need them, keeping the
        initial bundle small and responsive:
      </p>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '1rem',
          marginBottom: '1.5rem',
        }}
      >
        {features.map((feature) => (
          <div
            key={feature.id}
            style={{
              padding: '1rem',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              background: '#f9fafb',
            }}
          >
            <h5 style={{ margin: '0 0 0.5rem 0' }}>{feature.name}</h5>
            <p
              style={{
                margin: '0 0 1rem 0',
                fontSize: '0.875rem',
                color: '#6b7280',
              }}
            >
              {feature.description}
            </p>

            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <DemoButton
                onClick={() => loadFeature(feature.id)}
                disabled={
                  loadingFeatures.includes(feature.id) ||
                  activeFeatures.includes(feature.id)
                }
                style={{ fontSize: '0.75rem', padding: '0.25rem 0.75rem' }}
              >
                {loadingFeatures.includes(feature.id)
                  ? 'Loading...'
                  : activeFeatures.includes(feature.id)
                    ? 'Loaded'
                    : 'Load'}
              </DemoButton>

              {activeFeatures.includes(feature.id) && (
                <DemoButton
                  onClick={() => unloadFeature(feature.id)}
                  style={{ fontSize: '0.75rem', padding: '0.25rem 0.75rem' }}
                >
                  Unload
                </DemoButton>
              )}
            </div>
          </div>
        ))}
      </div>

      {activeFeatures.length > 0 && (
        <div style={{ marginBottom: '1rem' }}>
          <h6>Loaded Components:</h6>
          <div
            style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}
          >
            {activeFeatures.map((featureId) => (
              <div key={featureId}>{renderFeatureComponent(featureId)}</div>
            ))}
          </div>
        </div>
      )}

      <CodeSyntaxHighlighter language='typescript'>
        {`// Component lazy loading with React.lazy
import { lazy, Suspense } from 'react'

// Lazy load heavy components
const ChartsModule = lazy(() => import('./components/ChartsModule'))
const RichEditor = lazy(() => import('./components/RichEditor'))
const CalendarWidget = lazy(() => import('./components/CalendarWidget'))

// Conditional lazy loading
function FeatureLoader({ featureId, children }) {
  const [Component, setComponent] = useState(null)
  const [loading, setLoading] = useState(false)

  const loadFeature = useCallback(async () => {
    if (Component || loading) return

    setLoading(true)
    try {
      const module = await import(\`./features/\${featureId}\`)
      setComponent(() => module.default)
    } catch (error) {
      console.error(\`Failed to load feature \${featureId}:\`, error)
    } finally {
      setLoading(false)
    }
  }, [featureId, Component, loading])

  useEffect(() => {
    loadFeature()
  }, [loadFeature])

  if (loading) return <div>Loading {featureId}...</div>
  if (!Component) return null

  return (
    <Suspense fallback={<div>Initializing {featureId}...</div>}>
      <Component>{children}</Component>
    </Suspense>
  )
}

// Usage with feature flags
function App({ features }) {
  return (
    <div>
      <MainContent />
      {features.charts && (
        <Suspense fallback={<ChartsSkeleton />}>
          <ChartsModule />
        </Suspense>
      )}
      {features.editor && (
        <Suspense fallback={<EditorSkeleton />}>
          <RichEditor />
        </Suspense>
      )}
    </div>
  )
}`}
      </CodeSyntaxHighlighter>
    </DemoContainer>
  )
}

export default PerformanceLazyLoadingDemo
