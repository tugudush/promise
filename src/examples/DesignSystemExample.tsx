import styled from '@emotion/styled'

import {
  Button,
  Container,
  H1,
  H2,
  P,
  Section,
  colors,
  semanticColors,
  spacing,
  typography,
} from '@/design-system'

/**
 * Example Component - Demonstrates Design System Usage
 * This component shows how to use the design system effectively
 */

const ExampleSection = styled(Section)`
  margin: ${spacing[8]} auto;
  background: linear-gradient(
    135deg,
    ${colors.secondary[50]} 0%,
    ${colors.secondary[100]} 100%
  );
`

const ButtonGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: ${spacing[4]};
  margin: ${spacing[6]} 0;
`

const ColorPalette = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: ${spacing[4]};
  margin: ${spacing[6]} 0;
`

const ColorSwatch = styled.div`
  padding: ${spacing[4]};
  border-radius: ${spacing[2]};
  text-align: center;
  color: ${colors.white};
  font-family: ${typography.fontFamily.mono};
  font-size: ${typography.fontSize.sm};
  font-weight: ${typography.fontWeight.medium};
`

function DesignSystemExample() {
  return (
    <Container size='large' padding='large'>
      <H1 align='center'>Design System Example</H1>
      <P align='center' color='secondary'>
        This component demonstrates how to use the design system effectively
      </P>

      <ExampleSection>
        <H2>Button Variants</H2>
        <P>
          The Button component supports multiple variants, sizes, and states.
        </P>

        <ButtonGrid>
          <Button variant='primary' size='small'>
            Small Primary
          </Button>
          <Button variant='primary' size='medium'>
            Medium Primary
          </Button>
          <Button variant='primary' size='large'>
            Large Primary
          </Button>
          <Button variant='primary' disabled>
            Disabled Primary
          </Button>
        </ButtonGrid>

        <ButtonGrid>
          <Button variant='secondary'>Secondary</Button>
          <Button variant='success'>Success</Button>
          <Button variant='warning'>Warning</Button>
          <Button variant='error'>Error</Button>
        </ButtonGrid>

        <ButtonGrid>
          <Button variant='primary' fullWidth>
            Full Width Button
          </Button>
        </ButtonGrid>
      </ExampleSection>

      <ExampleSection>
        <H2>Typography Scale</H2>
        <P>
          Consistent typography using design tokens for font sizes, weights, and
          spacing.
        </P>

        <H1>Heading 1 - Main page title</H1>
        <H2>Heading 2 - Section title</H2>
        <P>
          Paragraph - Regular body text with proper line height and spacing.
        </P>
        <P size='small' color='secondary'>
          Small paragraph - Secondary text for captions or metadata.
        </P>
      </ExampleSection>

      <ExampleSection>
        <H2>Color Palette</H2>
        <P>Primary color variations used throughout the application.</P>

        <ColorPalette>
          <ColorSwatch style={{ background: colors.primary[100] }}>
            primary[100]
          </ColorSwatch>
          <ColorSwatch style={{ background: colors.primary[300] }}>
            primary[300]
          </ColorSwatch>
          <ColorSwatch style={{ background: colors.primary[500] }}>
            primary[500]
          </ColorSwatch>
          <ColorSwatch style={{ background: colors.primary[700] }}>
            primary[700]
          </ColorSwatch>
          <ColorSwatch style={{ background: colors.primary[900] }}>
            primary[900]
          </ColorSwatch>
        </ColorPalette>
      </ExampleSection>

      <ExampleSection>
        <H2>Spacing Scale</H2>
        <P>Consistent spacing using a standardized scale based on 4px units.</P>

        <div
          style={{ display: 'flex', flexDirection: 'column', gap: spacing[4] }}
        >
          <div
            style={{
              height: spacing[2],
              background: semanticColors.primary,
              borderRadius: spacing[1],
            }}
          >
            spacing[2] = 8px
          </div>
          <div
            style={{
              height: spacing[4],
              background: semanticColors.primary,
              borderRadius: spacing[1],
            }}
          >
            spacing[4] = 16px
          </div>
          <div
            style={{
              height: spacing[8],
              background: semanticColors.primary,
              borderRadius: spacing[1],
            }}
          >
            spacing[8] = 32px
          </div>
          <div
            style={{
              height: spacing[16],
              background: semanticColors.primary,
              borderRadius: spacing[1],
            }}
          >
            spacing[16] = 64px
          </div>
        </div>
      </ExampleSection>
    </Container>
  )
}

export default DesignSystemExample
