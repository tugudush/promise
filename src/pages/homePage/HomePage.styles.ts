import { Link } from 'react-router-dom'
import styled from '@emotion/styled'

export const HomePageContainer = styled.div`
  width: 100%;
  margin: 0;
  padding: 0;
  min-height: 100vh;
`

export const Hero = styled.header`
  text-align: center;
  padding: 6rem 2rem 4rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  margin: 0;

  h1 {
    font-size: 4.5rem;
    font-weight: 800;
    margin: 0 0 1.5rem 0;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
`

export const HeroSubtitle = styled.p`
  font-size: 1.5rem;
  font-weight: 600;
  margin: 0 0 1rem 0;
  opacity: 0.95;
`

export const HeroDescription = styled.p`
  font-size: 1.2rem;
  margin: 0;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
  line-height: 1.6;
  opacity: 0.9;
`

export const Overview = styled.section`
  padding: 4rem 2rem;
  max-width: 1200px;
  margin: 0 auto;

  h2 {
    font-size: 2.5rem;
    text-align: center;
    color: #1f2937;
    margin-bottom: 3rem;
  }
`

export const LearningGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 2rem;
  margin-top: 2rem;
`

export const LearningCard = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  border: 1px solid #e5e7eb;
  transition: all 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
  }

  h3 {
    font-size: 1.25rem;
    font-weight: 600;
    color: #1f2937;
    margin: 0 0 1rem 0;
  }

  p {
    color: #6b7280;
    line-height: 1.6;
    margin: 0;
  }
`

export const TableOfContents = styled.section`
  padding: 4rem 2rem;
  background: #f9fafb;
  margin: 0;

  h2 {
    font-size: 2.5rem;
    text-align: center;
    color: #1f2937;
    margin-bottom: 3rem;
  }
`

export const ChaptersGrid = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 3rem;
`

export const ChapterGroup = styled.div`
  h3 {
    font-size: 1.5rem;
    font-weight: 600;
    color: #374151;
    margin-bottom: 1.5rem;
    padding-bottom: 0.5rem;
    border-bottom: 2px solid #e5e7eb;
  }
`

export const Chapters = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`

export const ChapterLink = styled(Link)`
  display: flex;
  align-items: center;
  gap: 1.5rem;
  padding: 1.5rem;
  background: white;
  border-radius: 8px;
  text-decoration: none;
  border: 1px solid #e5e7eb;
  transition: all 0.2s ease;

  &:hover {
    transform: translateX(4px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    border-color: #6366f1;
  }

  h4 {
    font-size: 1.1rem;
    font-weight: 600;
    color: #1f2937;
    margin: 0 0 0.5rem 0;
  }

  p {
    color: #6b7280;
    font-size: 0.9rem;
    margin: 0 0 0.5rem 0;
    line-height: 1.4;
  }
`

export const ChapterNumber = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 3rem;
  height: 3rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  font-weight: 700;
  font-size: 1.1rem;
  border-radius: 8px;
  flex-shrink: 0;
`

export const Duration = styled.span`
  background: #f3f4f6;
  color: #6b7280;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 500;
`

export const GettingStarted = styled.section`
  text-align: center;
  padding: 4rem 2rem;
  max-width: 800px;
  margin: 0 auto;

  h2 {
    font-size: 2.5rem;
    color: #1f2937;
    margin-bottom: 1.5rem;
  }

  p {
    font-size: 1.2rem;
    color: #6b7280;
    line-height: 1.6;
    margin-bottom: 2.5rem;
  }
`

export const StartButton = styled(Link)`
  display: inline-block;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 1rem 2rem;
  font-size: 1.1rem;
  font-weight: 600;
  text-decoration: none;
  border-radius: 8px;
  transition: all 0.2s ease;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.2);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(102, 126, 234, 0.3);
  }

  &:active {
    transform: translateY(0);
  }
`
