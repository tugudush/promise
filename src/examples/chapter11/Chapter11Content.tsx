import { useState } from 'react'

import {
  CodeSyntaxHighlighter,
  LearningObjective,
  TutorialContent,
} from '@/examples/shared'

// Import demo components
import ArchitectureDecisionsDemo from './ArchitectureDecisionsDemo'
import CodeReviewDemo from './CodeReviewDemo'
import ProjectPlanningDemo from './ProjectPlanningDemo'
import RequirementsAnalysisDemo from './RequirementsAnalysisDemo'
import SocialMediaDashboardDemo from './SocialMediaDashboardDemo'

function Chapter11Content() {
  const [activeSection, setActiveSection] = useState<string>('planning')

  return (
    <TutorialContent>
      <h1>Chapter 11: Capstone Project - Social Media Dashboard</h1>

      <LearningObjective>
        Apply all learned async patterns to build a comprehensive social media
        dashboard. Master project planning, architecture decisions, error
        handling, performance optimization, and deployment strategies for
        production-ready React applications.
      </LearningObjective>

      <div style={{ marginBottom: '2rem' }}>
        <p>
          Welcome to the capstone project! In this chapter, you'll build a
          full-featured social media dashboard that demonstrates mastery of
          asynchronous JavaScript patterns in React. This project integrates
          concepts from all previous chapters into a real-world application.
        </p>
      </div>

      {/* Project Navigation */}
      <div style={{ marginBottom: '2rem' }}>
        <h3>Project Phases</h3>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          {[
            { id: 'planning', label: '11.1 Planning' },
            { id: 'implementation', label: '11.2 Implementation' },
            { id: 'review', label: '11.3 Review & Deployment' },
          ].map((phase) => (
            <button
              key={phase.id}
              onClick={() => setActiveSection(phase.id)}
              style={{
                padding: '0.5rem 1rem',
                backgroundColor:
                  activeSection === phase.id ? '#4f46e5' : '#e5e7eb',
                color: activeSection === phase.id ? 'white' : '#374151',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
              }}
            >
              {phase.label}
            </button>
          ))}
        </div>
      </div>

      {/* Project Overview */}
      <section style={{ marginBottom: '3rem' }}>
        <h2>🎯 Project Overview: Social Media Dashboard</h2>

        <div
          style={{
            background: '#f8fafc',
            padding: '1.5rem',
            borderRadius: '8px',
            border: '1px solid #e2e8f0',
            marginBottom: '2rem',
          }}
        >
          <h3>What We're Building</h3>
          <p>A comprehensive social media dashboard that allows users to:</p>
          <ul style={{ marginLeft: '1.5rem' }}>
            <li>View feeds from multiple social platforms</li>
            <li>Post content with real-time feedback</li>
            <li>Manage user authentication and profiles</li>
            <li>Monitor analytics and engagement metrics</li>
            <li>Handle offline scenarios gracefully</li>
          </ul>
        </div>

        <div
          style={{
            background: '#fef7cd',
            padding: '1.5rem',
            borderRadius: '8px',
            border: '1px solid #f59e0b',
            marginBottom: '2rem',
          }}
        >
          <h3>🚀 Async Patterns We'll Use</h3>
          <ul style={{ marginLeft: '1.5rem' }}>
            <li>
              <strong>Promise.all()</strong> - Loading multiple feeds
              simultaneously
            </li>
            <li>
              <strong>async/await</strong> - Clean API interactions
            </li>
            <li>
              <strong>Error boundaries</strong> - Graceful error handling
            </li>
            <li>
              <strong>Custom hooks</strong> - Reusable async logic
            </li>
            <li>
              <strong>Optimistic updates</strong> - Responsive user experience
            </li>
            <li>
              <strong>Background sync</strong> - Offline-first approach
            </li>
            <li>
              <strong>WebSockets</strong> - Real-time notifications
            </li>
          </ul>
        </div>
      </section>

      {/* Phase Content */}
      {activeSection === 'planning' && (
        <section>
          <h2>11.1 Project Planning Phase</h2>

          <p>
            Before writing any code, successful projects require careful
            planning. Let's analyze requirements, make architecture decisions,
            and select our technology stack.
          </p>

          <h3>Requirements Analysis</h3>
          <RequirementsAnalysisDemo />

          <h3>Architecture Decisions</h3>
          <ArchitectureDecisionsDemo />

          <h3>Technology Stack Selection</h3>
          <ProjectPlanningDemo />
        </section>
      )}

      {activeSection === 'implementation' && (
        <section>
          <h2>11.2 Implementation Phase</h2>

          <p>
            Time to build! We'll implement our social media dashboard using all
            the async patterns learned throughout this course.
          </p>

          <div
            style={{
              background: '#dcfce7',
              padding: '1.5rem',
              borderRadius: '8px',
              border: '1px solid #16a34a',
              marginBottom: '2rem',
            }}
          >
            <h3>🛠️ Implementation Strategy</h3>
            <ol style={{ marginLeft: '1.5rem' }}>
              <li>Set up project structure and routing</li>
              <li>Implement authentication system</li>
              <li>Build feed aggregation with Promise.all()</li>
              <li>Create posting functionality with optimistic updates</li>
              <li>Add real-time notifications via WebSockets</li>
              <li>Implement offline support and background sync</li>
              <li>Add comprehensive error handling</li>
              <li>Optimize performance and bundle size</li>
            </ol>
          </div>

          <SocialMediaDashboardDemo />
        </section>
      )}

      {activeSection === 'review' && (
        <section>
          <h2>11.3 Review and Deployment Phase</h2>

          <p>
            Let's review our implementation, analyze performance, and prepare
            for deployment. This phase focuses on production readiness and best
            practices.
          </p>

          <h3>Code Review Session</h3>
          <CodeReviewDemo />

          <h3>Performance Analysis</h3>
          <div
            style={{
              background: '#fef3c7',
              padding: '1.5rem',
              borderRadius: '8px',
              border: '1px solid #f59e0b',
              marginBottom: '2rem',
            }}
          >
            <h4>Performance Checklist</h4>
            <ul style={{ marginLeft: '1.5rem' }}>
              <li>✅ Bundle size optimization with code splitting</li>
              <li>✅ API call optimization and caching</li>
              <li>✅ Memory leak prevention</li>
              <li>✅ Responsive loading states</li>
              <li>✅ Error recovery mechanisms</li>
              <li>✅ Accessibility compliance</li>
            </ul>
          </div>

          <h3>Deployment Strategies</h3>
          <CodeSyntaxHighlighter language='bash'>
            {`# Production build optimization
npm run build

# Analyze bundle size
npm run analyze

# Deploy to production
npm run deploy

# Monitor performance
npm run monitor`}
          </CodeSyntaxHighlighter>
        </section>
      )}

      {/* Next Steps */}
      <section style={{ marginTop: '3rem' }}>
        <h2>🎓 Congratulations!</h2>

        <div
          style={{
            background: '#e0e7ff',
            padding: '2rem',
            borderRadius: '12px',
            border: '1px solid #6366f1',
          }}
        >
          <h3>What You've Accomplished</h3>
          <p>
            You've successfully built a production-ready React application that
            demonstrates mastery of async JavaScript patterns. You can now:
          </p>
          <ul style={{ marginLeft: '1.5rem' }}>
            <li>Design and implement complex async workflows</li>
            <li>Handle errors gracefully in production applications</li>
            <li>Optimize performance for real-world usage</li>
            <li>Deploy and monitor async React applications</li>
          </ul>

          <h3>🚀 Next Steps</h3>
          <ul style={{ marginLeft: '1.5rem' }}>
            <li>
              Explore advanced state management libraries (Redux Toolkit Query,
              SWR)
            </li>
            <li>Learn about Server-Side Rendering with Next.js</li>
            <li>Dive deeper into WebSocket and real-time applications</li>
            <li>Study advanced testing patterns for async code</li>
            <li>Explore micro-frontends and async module federation</li>
          </ul>
        </div>
      </section>
    </TutorialContent>
  )
}

export default Chapter11Content
