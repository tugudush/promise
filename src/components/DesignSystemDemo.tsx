import styled from '@emotion/styled'

const DesignSystemContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: var(--spacing-lg);
`

const Section = styled.section`
  margin-bottom: var(--spacing-2xl);

  h2 {
    color: var(--text-primary);
    border-bottom: 2px solid var(--color-accent);
    padding-bottom: var(--spacing-sm);
    margin-bottom: var(--spacing-lg);
  }
`

const ColorGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-lg);
`

const ColorSwatch = styled.div<{ color: string }>`
  background: ${(props) => `var(--${props.color})`};
  height: 80px;
  border-radius: var(--radius-md);
  display: flex;
  align-items: end;
  padding: var(--spacing-sm);
  color: var(--text-light);
  font-family: var(--font-family-mono);
  font-size: var(--font-size-sm);
  box-shadow: var(--shadow-md);
`

const SpacingDemo = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-md);
  align-items: end;
`

const SpacingBox = styled.div<{ size: string }>`
  width: ${(props) => `var(--spacing-${props.size})`};
  height: ${(props) => `var(--spacing-${props.size})`};
  background: var(--color-accent);
  border-radius: var(--radius-sm);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-light);
  font-size: var(--font-size-xs);
  font-weight: 600;
`

const TypeScale = styled.div`
  h1,
  h2,
  h3,
  h4,
  h5,
  h6,
  p {
    margin: var(--spacing-sm) 0;
  }
`

const ButtonShowcase = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-md);
  align-items: center;
`

const StatusButton = styled.button<{
  variant: 'success' | 'warning' | 'error' | 'info'
}>`
  background: ${(props) => `var(--color-${props.variant})`};

  &:hover {
    opacity: 0.9;
  }
`

function DesignSystemDemo() {
  return (
    <DesignSystemContainer>
      <h1>Design System Documentation</h1>
      <p>
        Comprehensive design tokens and components for the tutorial application.
      </p>

      <Section>
        <h2>Color Palette</h2>
        <ColorGrid>
          <ColorSwatch color='color-primary'>--color-primary</ColorSwatch>
          <ColorSwatch color='color-secondary'>--color-secondary</ColorSwatch>
          <ColorSwatch color='color-accent'>--color-accent</ColorSwatch>
          <ColorSwatch color='color-success'>--color-success</ColorSwatch>
          <ColorSwatch color='color-warning'>--color-warning</ColorSwatch>
          <ColorSwatch color='color-error'>--color-error</ColorSwatch>
        </ColorGrid>
      </Section>

      <Section>
        <h2>Spacing Scale</h2>
        <SpacingDemo>
          <div>
            <SpacingBox size='xs'>XS</SpacingBox>
            <p>--spacing-xs: 0.25rem</p>
          </div>
          <div>
            <SpacingBox size='sm'>SM</SpacingBox>
            <p>--spacing-sm: 0.5rem</p>
          </div>
          <div>
            <SpacingBox size='md'>MD</SpacingBox>
            <p>--spacing-md: 1rem</p>
          </div>
          <div>
            <SpacingBox size='lg'>LG</SpacingBox>
            <p>--spacing-lg: 2rem</p>
          </div>
          <div>
            <SpacingBox size='xl'>XL</SpacingBox>
            <p>--spacing-xl: 3rem</p>
          </div>
        </SpacingDemo>
      </Section>

      <Section>
        <h2>Typography Scale</h2>
        <TypeScale>
          <h1>Heading 1 - var(--font-size-3xl)</h1>
          <h2>Heading 2 - var(--font-size-2xl)</h2>
          <h3>Heading 3 - var(--font-size-xl)</h3>
          <h4>Heading 4 - var(--font-size-lg)</h4>
          <p>Body text - var(--font-size-base)</p>
          <p style={{ fontSize: 'var(--font-size-sm)' }}>
            Small text - var(--font-size-sm)
          </p>
        </TypeScale>
      </Section>

      <Section>
        <h2>Button Variants</h2>
        <ButtonShowcase>
          <button>Default Button</button>
          <StatusButton variant='success'>Success</StatusButton>
          <StatusButton variant='warning'>Warning</StatusButton>
          <StatusButton variant='error'>Error</StatusButton>
          <StatusButton variant='info'>Info</StatusButton>
          <button disabled>Disabled</button>
        </ButtonShowcase>
      </Section>

      <Section>
        <h2>Code Examples</h2>
        <p>
          Inline code: <code>var(--color-primary)</code>
        </p>
        <pre>
          <code>{`// CSS Variable Usage Example
.my-component {
  padding: var(--spacing-md);
  background: var(--bg-secondary);
  border-radius: var(--radius-md);
  color: var(--text-primary);
}`}</code>
        </pre>
      </Section>
    </DesignSystemContainer>
  )
}

export default DesignSystemDemo
