import { useState } from 'react'

interface ConditionalFeatureProps {
  userRole: 'user' | 'admin'
}

function ConditionalFeature({ userRole }: ConditionalFeatureProps) {
  const [adminAction, setAdminAction] = useState<string>('')

  const handleAdminAction = (action: string) => {
    setAdminAction(`Admin performed: ${action}`)
  }

  return (
    <div
      style={{
        background: '#fef3c7',
        padding: '1.5rem',
        borderRadius: '8px',
        margin: '1rem 0',
        border: '2px solid #f59e0b',
      }}
    >
      <h4>🔐 Admin Features (Conditionally Loaded)</h4>
      <p>This component is only loaded when user role is 'admin':</p>

      <div style={{ display: 'flex', gap: '0.5rem', margin: '1rem 0' }}>
        <button
          onClick={() => handleAdminAction('User Management')}
          style={{
            background: '#f59e0b',
            color: 'white',
            border: 'none',
            padding: '0.5rem 1rem',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          Manage Users
        </button>

        <button
          onClick={() => handleAdminAction('System Settings')}
          style={{
            background: '#f59e0b',
            color: 'white',
            border: 'none',
            padding: '0.5rem 1rem',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          System Settings
        </button>

        <button
          onClick={() => handleAdminAction('View Logs')}
          style={{
            background: '#f59e0b',
            color: 'white',
            border: 'none',
            padding: '0.5rem 1rem',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          View Logs
        </button>
      </div>

      {adminAction && (
        <div
          style={{
            background: '#dcfce7',
            padding: '0.75rem',
            borderRadius: '4px',
            marginTop: '1rem',
            border: '1px solid #22c55e',
          }}
        >
          ✅ {adminAction}
        </div>
      )}

      <p style={{ fontSize: '0.875rem', color: '#92400e', marginTop: '1rem' }}>
        💡 Current user role: <strong>{userRole}</strong>
        <br />
        This component and its dependencies are only downloaded when needed,
        reducing bundle size for regular users.
      </p>
    </div>
  )
}

export default ConditionalFeature
