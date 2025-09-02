import { useState } from 'react'

import { CodeSyntaxHighlighter } from '@/examples/shared'

function ProjectPlanningDemo() {
  const [selectedStack, setSelectedStack] = useState<string>('frontend')

  const techStacks = {
    frontend: {
      title: 'Frontend Technology Stack',
      choices: [
        {
          name: 'React 19',
          reason: 'Latest features, excellent TypeScript support',
          async: 'Suspense for data fetching, concurrent features',
        },
        {
          name: 'TypeScript',
          reason: 'Type safety, better developer experience',
          async: 'Typed async functions, Promise generics',
        },
        {
          name: 'Vite',
          reason: 'Fast development, optimized builds',
          async: 'Dynamic imports, code splitting',
        },
        {
          name: 'Emotion',
          reason: 'CSS-in-JS, component-scoped styles',
          async: 'No impact on async patterns',
        },
        {
          name: 'React Router v7',
          reason: 'Declarative routing, code splitting',
          async: 'Lazy route loading, data loading patterns',
        },
      ],
      alternatives: [
        'Next.js (Overkill for SPA)',
        'Vue.js (Team expertise in React)',
        'Angular (Too heavy for this scope)',
        'Svelte (Less ecosystem support)',
      ],
    },
    backend: {
      title: 'Backend & API Technology Stack',
      choices: [
        {
          name: 'Node.js + Express',
          reason: 'JavaScript everywhere, fast development',
          async: 'Native Promise support, async/await',
        },
        {
          name: 'JSON Web Tokens',
          reason: 'Stateless authentication',
          async: 'Async token verification and refresh',
        },
        {
          name: 'Socket.io/WebSocket',
          reason: 'Real-time communication',
          async: 'Event-driven async messaging',
        },
        {
          name: 'REST APIs',
          reason: 'Standard, well-understood',
          async: 'Promise-based HTTP requests',
        },
        {
          name: 'MongoDB',
          reason: 'JSON-native, flexible schema',
          async: 'Async database operations',
        },
      ],
      alternatives: [
        'GraphQL (Complex for this scope)',
        'PostgreSQL (Relational not needed)',
        'Python/Django (Team expertise)',
        'Go/Gin (Performance not critical)',
      ],
    },
    infrastructure: {
      title: 'Infrastructure & Deployment',
      choices: [
        {
          name: 'Vercel',
          reason: 'Optimized for React, easy deployment',
          async: 'Edge functions for API routes',
        },
        {
          name: 'Service Workers',
          reason: 'Offline functionality, background sync',
          async: 'Background data synchronization',
        },
        {
          name: 'Local Storage',
          reason: 'Client-side caching, offline data',
          async: 'Async data persistence',
        },
        {
          name: 'CDN',
          reason: 'Global content delivery, performance',
          async: 'Async asset loading',
        },
        {
          name: 'Monitoring',
          reason: 'Error tracking, performance metrics',
          async: 'Async error reporting',
        },
      ],
      alternatives: [
        'Netlify (Similar to Vercel)',
        'AWS (Too complex)',
        'Docker + K8s (Overkill)',
        'Traditional hosting (Less optimized)',
      ],
    },
    development: {
      title: 'Development Tools & Workflow',
      choices: [
        {
          name: 'ESLint + Prettier',
          reason: 'Code quality, consistent formatting',
          async: 'Async/await linting rules',
        },
        {
          name: 'Jest + RTL',
          reason: 'Comprehensive testing framework',
          async: 'Async test utilities',
        },
        {
          name: 'Storybook',
          reason: 'Component development and documentation',
          async: 'Async component states',
        },
        {
          name: 'Husky + lint-staged',
          reason: 'Pre-commit quality checks',
          async: 'No direct async impact',
        },
        {
          name: 'GitHub Actions',
          reason: 'CI/CD automation',
          async: 'Automated testing and deployment',
        },
      ],
      alternatives: [
        'Webpack (Vite is faster)',
        'Cypress (E2E not needed)',
        'Travis CI (GitHub Actions integrated)',
        'Manual deployment (Error-prone)',
      ],
    },
  }

  const currentStack = techStacks[selectedStack as keyof typeof techStacks]

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
          <strong>Technology Stack Selection</strong> directly impacts how we
          implement async patterns. Each choice should support our async
          requirements while maintaining development velocity and team
          expertise.
        </p>
      </div>

      {/* Stack Type Selector */}
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {Object.keys(techStacks).map((type) => (
            <button
              key={type}
              onClick={() => setSelectedStack(type)}
              style={{
                padding: '0.5rem 1rem',
                backgroundColor: selectedStack === type ? '#5b21b6' : '#f3f4f6',
                color: selectedStack === type ? 'white' : '#1f2937',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                cursor: 'pointer',
                textTransform: 'capitalize',
              }}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Selected Stack Display */}
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
            background: '#5b21b6',
            color: 'white',
            padding: '1rem',
          }}
        >
          <h4 style={{ margin: 0, color: 'white' }}>{currentStack.title}</h4>
        </div>

        <div style={{ padding: '1.5rem' }}>
          {/* Technology Choices */}
          <div style={{ marginBottom: '2rem' }}>
            <h5>Selected Technologies</h5>
            <div
              style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}
            >
              {currentStack.choices.map((choice, index) => (
                <div
                  key={index}
                  style={{
                    background: '#f8fafc',
                    border: '1px solid #e2e8f0',
                    borderRadius: '6px',
                    padding: '1rem',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                      marginBottom: '0.5rem',
                    }}
                  >
                    <strong style={{ color: '#5b21b6' }}>{choice.name}</strong>
                    <span
                      style={{
                        fontSize: '0.75rem',
                        background: '#dcfce7',
                        color: '#166534',
                        padding: '0.25rem 0.5rem',
                        borderRadius: '4px',
                      }}
                    >
                      Async: {choice.async}
                    </span>
                  </div>
                  <p
                    style={{ margin: 0, color: '#374151', fontSize: '0.9rem' }}
                  >
                    {choice.reason}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Alternatives Considered */}
          <div>
            <h5>Alternatives Considered</h5>
            <ul style={{ marginLeft: '1rem' }}>
              {currentStack.alternatives.map((alternative, index) => (
                <li
                  key={index}
                  style={{
                    marginBottom: '0.5rem',
                    color: '#374151',
                  }}
                >
                  {alternative}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Project Structure */}
      <div style={{ marginTop: '2rem' }}>
        <h4>Recommended Project Structure</h4>
        <CodeSyntaxHighlighter language='bash'>
          {`social-media-dashboard/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── ui/             # Basic UI elements (Button, Input)
│   │   ├── forms/          # Form components with async validation
│   │   └── layout/         # Layout components
│   │
│   ├── pages/              # Route components
│   │   ├── dashboard/      # Dashboard with async feed loading
│   │   ├── profile/        # User profile with async updates
│   │   └── auth/           # Authentication pages
│   │
│   ├── hooks/              # Custom React hooks
│   │   ├── useAuth.ts      # Authentication state management
│   │   ├── useFeeds.ts     # Feed data fetching
│   │   ├── useWebSocket.ts # Real-time communication
│   │   └── useAsync.ts     # Generic async state management
│   │
│   ├── services/           # API and external service integration
│   │   ├── api/            # REST API client
│   │   ├── websocket/      # WebSocket client
│   │   └── storage/        # Local storage utilities
│   │
│   ├── contexts/           # React Context providers
│   │   ├── AuthContext.tsx # Global auth state
│   │   └── ThemeContext.tsx# UI theme state
│   │
│   ├── utils/              # Helper functions
│   │   ├── async-helpers.ts # Async utilities (retry, timeout)
│   │   ├── validators.ts    # Form validation
│   │   └── formatters.ts    # Data formatting
│   │
│   └── types/              # TypeScript type definitions
│       ├── api.ts          # API response types
│       ├── user.ts         # User-related types
│       └── posts.ts        # Post-related types
│
├── public/                 # Static assets
├── tests/                  # Test files
│   ├── __mocks__/         # Mock data and services
│   ├── utils/             # Test utilities
│   └── integration/       # Integration tests
│
└── docs/                  # Project documentation
    ├── architecture.md    # Architecture decisions
    ├── api.md            # API documentation
    └── deployment.md     # Deployment guide`}
        </CodeSyntaxHighlighter>
      </div>

      {/* Development Timeline */}
      <div style={{ marginTop: '2rem' }}>
        <h4>Development Timeline & Async Pattern Integration</h4>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '1rem',
            marginTop: '1rem',
          }}
        >
          {[
            {
              phase: 'Week 1: Foundation',
              duration: '5 days',
              tasks: [
                'Project setup and configuration',
                'Basic routing and layout',
                'Authentication system with async JWT',
                'Error boundary implementation',
              ],
              asyncFocus: 'Basic async patterns, error handling',
            },
            {
              phase: 'Week 2: Core Features',
              duration: '7 days',
              tasks: [
                'Feed aggregation with Promise.all()',
                'Post creation with optimistic updates',
                'Real-time notifications via WebSocket',
                'Offline detection and caching',
              ],
              asyncFocus: 'Parallel processing, real-time communication',
            },
            {
              phase: 'Week 3: Polish & Performance',
              duration: '5 days',
              tasks: [
                'Code splitting and lazy loading',
                'Performance optimization',
                'Comprehensive error handling',
                'Testing and documentation',
              ],
              asyncFocus: 'Performance optimization, production readiness',
            },
          ].map((week, index) => (
            <div
              key={index}
              style={{
                background: '#fef7cd',
                border: '1px solid #d97706',
                borderRadius: '8px',
                padding: '1rem',
              }}
            >
              <h5 style={{ color: '#78350f', marginBottom: '0.5rem' }}>
                {week.phase}
              </h5>
              <p
                style={{
                  fontSize: '0.875rem',
                  color: '#374151',
                  marginBottom: '1rem',
                }}
              >
                Duration: {week.duration}
              </p>

              <h6>Tasks:</h6>
              <ul style={{ fontSize: '0.875rem', marginLeft: '1rem' }}>
                {week.tasks.map((task, taskIndex) => (
                  <li key={taskIndex} style={{ marginBottom: '0.25rem' }}>
                    {task}
                  </li>
                ))}
              </ul>

              <div
                style={{
                  background: '#d97706',
                  color: '#78350f',
                  padding: '0.5rem',
                  borderRadius: '4px',
                  marginTop: '0.5rem',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                }}
              >
                🎯 Async Focus: {week.asyncFocus}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Technology Evaluation Matrix */}
      <div
        style={{
          background: '#e0e7ff',
          padding: '1.5rem',
          borderRadius: '8px',
          border: '1px solid #6366f1',
          marginTop: '2rem',
        }}
      >
        <h4>🎯 Technology Selection Criteria</h4>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '1rem',
          }}
        >
          <div>
            <h5>Evaluation Factors</h5>
            <ul style={{ marginLeft: '1rem' }}>
              <li>Async pattern support</li>
              <li>TypeScript compatibility</li>
              <li>Community support</li>
              <li>Learning curve</li>
              <li>Performance impact</li>
            </ul>
          </div>
          <div>
            <h5>Success Metrics</h5>
            <ul style={{ marginLeft: '1rem' }}>
              <li>Development velocity</li>
              <li>Code maintainability</li>
              <li>Runtime performance</li>
              <li>Team expertise alignment</li>
              <li>Long-term sustainability</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProjectPlanningDemo
