import { useState } from 'react'

import { CodeSyntaxHighlighter } from '@/examples/shared'

function RequirementsAnalysisDemo() {
  const [selectedRequirement, setSelectedRequirement] =
    useState<string>('functional')

  const requirements = {
    functional: {
      title: 'Functional Requirements',
      items: [
        'User authentication and profile management',
        'Multi-platform feed aggregation',
        'Content posting with media upload',
        'Real-time notifications',
        'Analytics dashboard',
        'Offline functionality',
      ],
      asyncPatterns: [
        'JWT token management with automatic refresh',
        'Promise.all() for parallel feed loading',
        'File upload with progress tracking',
        'WebSocket connection management',
        'Background data synchronization',
      ],
    },
    nonFunctional: {
      title: 'Non-Functional Requirements',
      items: [
        'Response time < 200ms for UI interactions',
        'Support for 10,000+ concurrent users',
        'Offline-first architecture',
        'Cross-browser compatibility',
        'Mobile-responsive design',
        '99.9% uptime availability',
      ],
      asyncPatterns: [
        'Optimistic updates for perceived performance',
        'Connection pooling and request batching',
        'Service Worker for offline capabilities',
        'Progressive loading strategies',
        'Error boundaries and graceful degradation',
      ],
    },
    technical: {
      title: 'Technical Requirements',
      items: [
        'React 19 with TypeScript',
        'RESTful API integration',
        'WebSocket real-time communication',
        'Local storage and caching',
        'Bundle size < 500KB gzipped',
        'Accessibility (WCAG 2.1 AA)',
      ],
      asyncPatterns: [
        'Custom hooks for reusable async logic',
        'API client with retry mechanisms',
        'Connection state management',
        'Cache invalidation strategies',
        'Lazy loading and code splitting',
      ],
    },
  }

  const currentReq =
    requirements[selectedRequirement as keyof typeof requirements]

  return (
    <div style={{ marginBottom: '2rem' }}>
      <div
        style={{
          background: '#f8fafc',
          padding: '1.5rem',
          borderRadius: '8px',
          border: '1px solid #e2e8f0',
          marginBottom: '1.5rem',
        }}
      >
        <p>
          <strong>Requirements Analysis</strong> is the foundation of any
          successful project. For our social media dashboard, we need to
          identify functional, non-functional, and technical requirements, then
          map them to appropriate async patterns.
        </p>
      </div>

      {/* Requirement Type Selector */}
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {Object.keys(requirements).map((type) => (
            <button
              key={type}
              onClick={() => setSelectedRequirement(type)}
              style={{
                padding: '0.5rem 1rem',
                backgroundColor:
                  selectedRequirement === type ? '#3b82f6' : '#f3f4f6',
                color: selectedRequirement === type ? 'white' : '#374151',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                cursor: 'pointer',
                textTransform: 'capitalize',
              }}
            >
              {type} Requirements
            </button>
          ))}
        </div>
      </div>

      {/* Selected Requirements Display */}
      <div
        style={{
          background: 'white',
          border: '1px solid #e2e8f0',
          borderRadius: '8px',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            background: '#3b82f6',
            color: 'white',
            padding: '1rem',
          }}
        >
          <h4 style={{ margin: 0 }}>{currentReq.title}</h4>
        </div>

        <div style={{ padding: '1.5rem' }}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '2rem',
            }}
          >
            {/* Requirements List */}
            <div>
              <h5>Requirements</h5>
              <ul style={{ marginLeft: '1rem' }}>
                {currentReq.items.map((item, index) => (
                  <li key={index} style={{ marginBottom: '0.5rem' }}>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Async Patterns */}
            <div>
              <h5>Related Async Patterns</h5>
              <ul style={{ marginLeft: '1rem' }}>
                {currentReq.asyncPatterns.map((pattern, index) => (
                  <li
                    key={index}
                    style={{
                      marginBottom: '0.5rem',
                      color: '#059669',
                      fontFamily: 'monospace',
                    }}
                  >
                    {pattern}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Requirements to Code Mapping */}
      <div style={{ marginTop: '2rem' }}>
        <h4>From Requirements to Implementation</h4>
        <p>Here's how we translate requirements into async code patterns:</p>

        <CodeSyntaxHighlighter language='typescript'>
          {`// Example: Multi-platform feed aggregation requirement
// Maps to Promise.all() pattern for parallel loading

interface FeedSource {
  name: string
  endpoint: string
  transform: (data: any) => Post[]
}

const feedSources: FeedSource[] = [
  { name: 'twitter', endpoint: '/api/twitter/feed', transform: transformTwitter },
  { name: 'instagram', endpoint: '/api/instagram/feed', transform: transformInstagram },
  { name: 'linkedin', endpoint: '/api/linkedin/feed', transform: transformLinkedIn },
]

async function aggregateFeeds(): Promise<Post[]> {
  try {
    // Parallel loading for better performance
    const responses = await Promise.all(
      feedSources.map(source => 
        fetch(source.endpoint)
          .then(res => res.json())
          .then(source.transform)
      )
    )
    
    // Combine and sort by timestamp
    return responses
      .flat()
      .sort((a, b) => b.timestamp - a.timestamp)
      
  } catch (error) {
    // Graceful degradation - show cached content
    console.error('Feed aggregation failed:', error)
    return getCachedPosts()
  }
}`}
        </CodeSyntaxHighlighter>
      </div>

      {/* Requirements Validation */}
      <div
        style={{
          background: '#fef7cd',
          padding: '1.5rem',
          borderRadius: '8px',
          border: '1px solid #f59e0b',
          marginTop: '2rem',
        }}
      >
        <h4>🔍 Requirements Validation</h4>
        <p>Each requirement should be:</p>
        <ul style={{ marginLeft: '1.5rem' }}>
          <li>
            <strong>Specific</strong> - Clear and unambiguous
          </li>
          <li>
            <strong>Measurable</strong> - Can be tested and validated
          </li>
          <li>
            <strong>Achievable</strong> - Technically feasible
          </li>
          <li>
            <strong>Relevant</strong> - Adds value to users
          </li>
          <li>
            <strong>Time-bound</strong> - Has delivery constraints
          </li>
        </ul>
      </div>
    </div>
  )
}

export default RequirementsAnalysisDemo
