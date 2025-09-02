import styled from '@emotion/styled'
import { Link } from 'react-router-dom'

export const ChapterPageContainer = styled.div`
  width: 100%;
  margin: 0;
  padding: 0;
  min-height: 100vh;
`

export const ChapterNav = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding: 1rem 2rem;
  border-bottom: 1px solid #e5e7eb;
`

export const NavLink = styled(Link)`
  color: #4f46e5;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.2s ease;

  &:hover {
    color: #6366f1;
  }
`

export const ChapterProgress = styled.div`
  color: #6b7280;
  font-size: 0.9rem;
`

export const ChapterHeader = styled.header`
  margin-bottom: 3rem;
  text-align: center;
  padding: 2rem;
  max-width: 1200px;
  margin-left: auto;
  margin-right: auto;
`

export const ChapterMeta = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
  margin-bottom: 2rem;
  width: 100%;
`

export const ChapterNumber = styled.span`
  display: inline-block;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 0.6rem 1rem;
  border-radius: 6px;
  font-weight: 600;
  font-size: 0.85rem;
  letter-spacing: 0.25px;
  box-shadow: 0 2px 4px rgba(102, 126, 234, 0.2);
`

export const ChapterBadges = styled.div`
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
  justify-content: center;
`

export const DifficultyBadge = styled.span<{ difficulty: string }>`
  padding: 0.4rem 0.8rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;

  ${(props) => {
    switch (props.difficulty.toLowerCase()) {
      case 'beginner':
        return `
          background-color: #dcfce7;
          color: #166534;
        `
      case 'intermediate':
        return `
          background-color: #fef3c7;
          color: #92400e;
        `
      case 'advanced':
        return `
          background-color: #fee2e2;
          color: #991b1b;
        `
      default:
        return `
          background-color: #f3f4f6;
          color: #374151;
        `
    }
  }}
`

export const DurationBadge = styled.span`
  background-color: #f0f9ff;
  color: #0c4a6e;
  padding: 0.4rem 0.8rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 500;
`

export const ChapterTitle = styled.h1`
  font-size: 3rem;
  font-weight: 700;
  color: #1f2937;
  margin: 0;
  line-height: 1.2;
`

export const ChapterDescription = styled.p`
  font-size: 1.2rem;
  color: #4b5563;
  margin: 0;
  max-width: 700px;
`

export const ChapterContent = styled.main`
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
`

export const ComingSoon = styled.div`
  text-align: center;
  padding: 4rem 2rem;
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  border-radius: 16px;
  border: 1px solid #e2e8f0;

  h2 {
    font-size: 2rem;
    color: #334155;
    margin-bottom: 1rem;
  }

  p {
    font-size: 1.1rem;
    color: #64748b;
    margin-bottom: 1.5rem;
    line-height: 1.6;
  }

  ul {
    text-align: left;
    max-width: 400px;
    margin: 0 auto 2rem;

    li {
      color: #475569;
      margin-bottom: 0.5rem;
      line-height: 1.5;
    }
  }
`

export const ChapterNavigation = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  gap: 1rem;
`

export const NavButton = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.8rem 1.5rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  text-decoration: none;
  border-radius: 8px;
  font-weight: 500;
  font-size: 0.9rem;
  transition: all 0.2s ease;
  box-shadow: 0 2px 4px rgba(102, 126, 234, 0.2);

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 8px rgba(102, 126, 234, 0.3);
    color: white;
  }

  &:active {
    transform: translateY(0);
    color: white;
  }
`

export const NavButtonElement = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.8rem 1.5rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 500;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 2px 4px rgba(102, 126, 234, 0.2);

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 8px rgba(102, 126, 234, 0.3);
  }

  &:active {
    transform: translateY(0);
  }

  &:focus {
    outline: 2px solid #667eea;
    outline-offset: 2px;
  }
`

export const ChapterNotFound = styled.div`
  text-align: center;
  padding: 4rem 2rem;

  h1 {
    font-size: 2.5rem;
    color: #ef4444;
    margin-bottom: 1rem;
  }

  p {
    font-size: 1.2rem;
    color: #6b7280;
    margin-bottom: 2rem;
  }
`

export const BackHome = styled(Link)`
  display: inline-block;
  color: #4f46e5;
  text-decoration: none;
  font-weight: 500;
  font-size: 1.1rem;
  transition: color 0.2s ease;

  &:hover {
    color: #6366f1;
  }
`
