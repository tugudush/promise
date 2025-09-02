import { useEffect, useState } from 'react'

// This simulates a heavy component that would benefit from code splitting
function HeavyComponent() {
  const [data, setData] = useState<string[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate loading heavy data/libraries
    const timer = setTimeout(() => {
      setData([
        'Heavy computation result 1',
        'Large dataset item 2',
        'Complex visualization 3',
        'Advanced analytics 4',
        'Machine learning model 5',
      ])
      setLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  if (loading) {
    return <div>Loading heavy component...</div>
  }

  return (
    <div
      style={{
        background: '#f3f4f6',
        padding: '1.5rem',
        borderRadius: '8px',
        margin: '1rem 0',
      }}
    >
      <h4>🏋️ Heavy Component Loaded</h4>
      <p>
        This component represents a heavy feature that benefits from code
        splitting:
      </p>
      <ul>
        {data.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
      <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>
        💡 In a real app, this might include large libraries like D3.js,
        Three.js, or complex data processing modules.
      </p>
    </div>
  )
}

export default HeavyComponent
