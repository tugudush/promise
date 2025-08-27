import styled from '@emotion/styled'
import { Link } from 'react-router-dom'

export const HomePageContainer = styled.div`
  min-height: 100vh;
  background: white;
  color: var(--text-primary);
`

export const Container = styled.div`
  min-height: 100vh;
  background: white;
  color: var(--text-primary);
`

export const Hero = styled.section`
  background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%);
  color: white;
  padding: var(--spacing-2xl) var(--spacing-lg);
  text-align: center;

  h1 {
    font-size: var(--font-size-4xl);
    font-weight: 700;
    margin: 0 0 var(--spacing-lg) 0;
    line-height: var(--line-height-tight);
    color: white;
  }
`

export const HeroSubtitle = styled.p`
  font-size: var(--font-size-xl);
  font-weight: 600;
  opacity: 0.95;
  line-height: var(--line-height-normal);
  color: white;
  max-width: 600px;
  margin: 0 auto var(--spacing-md) auto;
`

export const HeroDescription = styled.p`
  font-size: var(--font-size-lg);
  opacity: 0.9;
  max-width: 600px;
  margin: 0 auto var(--spacing-xl) auto;
  line-height: var(--line-height-normal);
  color: white;
`

export const Overview = styled.section`
  padding: var(--spacing-2xl) var(--spacing-lg);
  max-width: 1200px;
  margin: 0 auto;

  h2 {
    font-size: var(--font-size-3xl);
    font-weight: 700;
    color: var(--text-primary);
    text-align: center;
    margin: 0 0 var(--spacing-xl) 0;
  }

  p {
    font-size: var(--font-size-base);
    color: var(--text-secondary);
    text-align: center;
    max-width: 800px;
    margin: 0 auto var(--spacing-xl) auto;
    line-height: var(--line-height-normal);
  }
`

export const LearningGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: var(--spacing-xl);
  max-width: 1000px;
  margin: 0 auto;
`

export const LearningCard = styled.div`
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: var(--radius-lg);
  padding: var(--spacing-xl);
  text-align: center;
  box-shadow: var(--shadow-sm);
  transition: var(--transition-normal);

  &:hover {
    box-shadow: var(--shadow-md);
    transform: translateY(-2px);
  }

  h3 {
    font-size: var(--font-size-xl);
    font-weight: 600;
    color: var(--text-primary);
    margin: 0 0 var(--spacing-md) 0;
  }

  p {
    color: var(--text-secondary);
    font-size: var(--font-size-sm);
    line-height: var(--line-height-normal);
    margin: 0;
  }
`

export const TableOfContents = styled.div`
  background: var(--bg-secondary);
  padding: var(--spacing-xl) 0;
`

export const Chapters = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 var(--spacing-lg);

  h2 {
    font-size: var(--font-size-3xl);
    font-weight: 700;
    color: var(--text-primary);
    text-align: center;
    margin: 0 0 var(--spacing-xl) 0;
  }
`

export const ChaptersGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: var(--spacing-lg);
`

export const ChapterGroup = styled.div`
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: var(--radius-lg);
  padding: var(--spacing-lg);
  box-shadow: var(--shadow-sm);
  transition: var(--transition-normal);

  &:hover {
    box-shadow: var(--shadow-md);
    transform: translateY(-2px);
  }

  h3 {
    font-size: var(--font-size-lg);
    font-weight: 600;
    color: var(--text-primary);
    margin: 0 0 var(--spacing-md) 0;
  }
`

export const ChapterLink = styled(Link)`
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  text-decoration: none;
  color: inherit;
  padding: var(--spacing-sm);
  border-radius: var(--radius-md);
  transition: var(--transition-normal);

  &:hover {
    background: var(--bg-secondary);
    transform: translateX(4px);
  }
`

export const ChapterList = styled.section`
  padding: var(--spacing-2xl) var(--spacing-lg);
  background: var(--bg-secondary);

  h2 {
    font-size: var(--font-size-3xl);
    font-weight: 700;
    color: var(--text-primary);
    text-align: center;
    margin: 0 0 var(--spacing-xl) 0;
  }
`

export const ChapterGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: var(--spacing-lg);
  max-width: 1200px;
  margin: 0 auto;
`

export const ChapterCard = styled(Link)`
  display: block;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: var(--radius-lg);
  padding: var(--spacing-lg);
  text-decoration: none;
  transition: var(--transition-normal);
  box-shadow: var(--shadow-sm);

  &:hover {
    box-shadow: var(--shadow-md);
    transform: translateY(-2px);
    border-color: var(--color-primary);
  }
`

export const ChapterHeader = styled.div`
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-md);
`

export const ChapterInfo = styled.div`
  flex: 1;

  h3 {
    font-size: var(--font-size-lg);
    font-weight: 600;
    color: var(--text-primary);
    margin: 0 0 var(--spacing-xs) 0;
  }

  p {
    color: var(--text-secondary);
    font-size: var(--font-size-sm);
    margin: 0 0 var(--spacing-xs) 0;
    line-height: var(--line-height-normal);
  }
`

export const ChapterNumber = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  width: var(--spacing-xl);
  height: var(--spacing-xl);
  background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%);
  color: white;
  font-weight: 700;
  font-size: var(--font-size-base);
  border-radius: var(--radius-md);
  flex-shrink: 0;
`

export const Duration = styled.span`
  background: #f3f4f6;
  color: var(--text-secondary);
  padding: var(--spacing-xs) var(--spacing-sm);
  border-radius: var(--radius-sm);
  font-size: var(--font-size-xs);
  font-weight: 500;
`

export const GettingStarted = styled.section`
  text-align: center;
  padding: var(--spacing-2xl) var(--spacing-lg);
  max-width: 800px;
  margin: 0 auto;

  h2 {
    font-size: var(--font-size-3xl);
    color: var(--text-primary);
    margin-bottom: var(--spacing-lg);
  }

  p {
    font-size: var(--font-size-lg);
    color: var(--text-secondary);
    line-height: var(--line-height-normal);
    margin-bottom: var(--spacing-xl);
  }
`

export const StartButton = styled(Link)`
  display: inline-block;
  background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%);
  color: white;
  padding: var(--spacing-md) var(--spacing-lg);
  font-size: var(--font-size-base);
  font-weight: 600;
  text-decoration: none;
  border-radius: var(--radius-md);
  transition: var(--transition-normal);
  box-shadow: var(--shadow-md);

  &:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow-lg);
  }

  &:active {
    transform: translateY(0);
  }
`
