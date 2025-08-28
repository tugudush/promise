import styled from '@emotion/styled'
import { Link } from 'react-router-dom'

import {
  Button,
  H1,
  H2,
  P,
  PageContainer,
  Section,
  colors,
  semanticColors,
  spacing,
  typography,
} from '@/design-system'

/**
 * HomePage Styles - Refactored to use Design System
 * Demonstrates how to use the centralized design system
 */

// Layout Components
export const HomePageContainer = styled(PageContainer)`
  background: linear-gradient(
    135deg,
    ${colors.primary[500]} 0%,
    ${colors.primary[700]} 100%
  );
`

export const HeroSection = styled.section`
  text-align: center;
  padding: ${spacing[24]} ${spacing[8]} ${spacing[16]};
  color: ${colors.white};
  background: linear-gradient(
    135deg,
    ${colors.primary[500]} 0%,
    ${colors.primary[700]} 100%
  );
`

export const ContentSection = styled(Section)`
  background: ${colors.white};
  margin: ${spacing[8]} auto;
  padding: ${spacing[8]};
  border-radius: ${spacing[3]};
  box-shadow:
    0 10px 15px -3px rgb(0 0 0 / 0.1),
    0 4px 6px -4px rgb(0 0 0 / 0.1);
`

// Hero Components
export const HeroTitle = styled(H1)`
  color: ${colors.white};
  font-size: ${typography.fontSize['6xl']};
  font-weight: ${typography.fontWeight.extrabold};
  margin: 0 0 ${spacing[6]} 0;
  text-shadow: 0 2px 4px rgba(0 0 0, 0.1);
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;
`

export const HeroSubtitle = styled(H2)`
  color: ${colors.white};
  font-size: ${typography.fontSize['2xl']};
  font-weight: ${typography.fontWeight.semibold};
  margin: 0 0 ${spacing[4]} 0;
  opacity: 0.9;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
`

export const HeroDescription = styled(P)`
  color: ${colors.white};
  font-size: ${typography.fontSize.xl};
  margin: 0;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
  line-height: ${typography.lineHeight.relaxed};
  opacity: 0.9;
`

// Overview Section
export const OverviewSection = styled(ContentSection)`
  text-align: center;
`

export const OverviewTitle = styled(H2)`
  color: ${semanticColors.text};
  margin-bottom: ${spacing[8]};
`

export const LearningGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: ${spacing[6]};
  margin: ${spacing[8]} 0;
`

export const LearningCard = styled.div`
  background: ${colors.white};
  padding: ${spacing[6]};
  border-radius: ${spacing[3]};
  border: 1px solid ${colors.border.light};
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow:
      0 20px 25px -5px rgb(0 0 0 / 0.1),
      0 8px 10px -6px rgb(0 0 0 / 0.1);
  }

  h3 {
    color: ${semanticColors.primary};
    font-size: ${typography.fontSize.xl};
    font-weight: ${typography.fontWeight.semibold};
    margin: 0 0 ${spacing[3]} 0;
  }

  p {
    color: ${semanticColors.textSecondary};
    font-size: ${typography.fontSize.base};
    line-height: ${typography.lineHeight.relaxed};
    margin: 0;
  }
`

// Chapters Section
export const ChaptersSection = styled(ContentSection)`
  text-align: center;
`

export const ChaptersTitle = styled(H2)`
  color: ${semanticColors.text};
  margin-bottom: ${spacing[8]};
`

export const ChaptersGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: ${spacing[8]};
  margin: ${spacing[8]} 0;

  @media (min-width: 768px) {
    grid-template-columns: repeat(3, 1fr);
  }
`

export const ChapterGroup = styled.div`
  h3 {
    color: ${semanticColors.primary};
    font-size: ${typography.fontSize.lg};
    font-weight: ${typography.fontWeight.semibold};
    margin: 0 0 ${spacing[4]} 0;
    text-align: left;
  }
`

export const Chapters = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${spacing[3]};
`

export const ChapterLink = styled(Link)`
  display: block;
  padding: ${spacing[4]};
  background: ${colors.white};
  border: 1px solid ${colors.border.light};
  border-radius: ${spacing[2]};
  text-decoration: none;
  transition: all 0.2s ease;
  text-align: left;

  &:hover {
    background: ${colors.primary[50]};
    border-color: ${semanticColors.primary};
    transform: translateY(-1px);
    box-shadow:
      0 4px 6px -1px rgb(0 0 0 / 0.1),
      0 2px 4px -2px rgb(0 0 0 / 0.1);
  }

  h4 {
    color: ${semanticColors.text};
    font-size: ${typography.fontSize.lg};
    font-weight: ${typography.fontWeight.semibold};
    margin: 0 0 ${spacing[2]} 0;
  }

  p {
    color: ${semanticColors.textSecondary};
    font-size: ${typography.fontSize.sm};
    margin: 0 0 ${spacing[2]} 0;
    line-height: ${typography.lineHeight.normal};
  }
`

export const ChapterNumber = styled.div`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: ${spacing[10]};
  height: ${spacing[10]};
  background: ${semanticColors.primary};
  color: ${colors.white};
  border-radius: ${spacing[2]};
  font-size: ${typography.fontSize.sm};
  font-weight: ${typography.fontWeight.bold};
  margin-bottom: ${spacing[3]};
`

export const Duration = styled.span`
  color: ${semanticColors.textTertiary};
  font-size: ${typography.fontSize.xs};
  font-weight: ${typography.fontWeight.medium};
  background: ${colors.gray[100]};
  padding: ${spacing[1]} ${spacing[2]};
  border-radius: ${spacing[1]};
  text-transform: uppercase;
  letter-spacing: ${typography.letterSpacing.wider};
`

// Getting Started Section
export const GettingStartedSection = styled(ContentSection)`
  text-align: center;
  background: linear-gradient(
    135deg,
    ${colors.secondary[50]} 0%,
    ${colors.secondary[100]} 100%
  );
`

export const GettingStartedTitle = styled(H2)`
  color: ${semanticColors.text};
  margin-bottom: ${spacing[4]};
`

export const GettingStartedDescription = styled(P)`
  color: ${semanticColors.textSecondary};
  font-size: ${typography.fontSize.lg};
  margin-bottom: ${spacing[6]};
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
`

export const StartButton = styled(Button)`
  font-size: ${typography.fontSize.lg};
  padding: ${spacing[3]} ${spacing[6]};
  background: ${semanticColors.primary};
  color: ${colors.white};
  border-radius: ${spacing[3]};

  &:hover {
    background: ${semanticColors.primaryHover};
    transform: translateY(-1px);
  }
`
