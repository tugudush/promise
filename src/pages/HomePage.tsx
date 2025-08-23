import { Link } from 'react-router-dom'
import styled from '@emotion/styled'

const HomePageContainer = styled.div`
  width: 100%;
  margin: 0;
  padding: 0;
  min-height: 100vh;
`

const Hero = styled.header`
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

const HeroSubtitle = styled.p`
  font-size: 1.5rem;
  font-weight: 600;
  margin: 0 0 1rem 0;
  opacity: 0.95;
`

const HeroDescription = styled.p`
  font-size: 1.2rem;
  margin: 0;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
  line-height: 1.6;
  opacity: 0.9;
`

const Overview = styled.section`
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

const LearningGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 2rem;
  margin-top: 2rem;
`

const LearningCard = styled.div`
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

const TableOfContents = styled.section`
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

const ChaptersGrid = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 3rem;
`

const ChapterGroup = styled.div`
  h3 {
    font-size: 1.5rem;
    font-weight: 600;
    color: #374151;
    margin-bottom: 1.5rem;
    padding-bottom: 0.5rem;
    border-bottom: 2px solid #e5e7eb;
  }
`

const Chapters = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`

const ChapterLink = styled(Link)`
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

const ChapterNumber = styled.span`
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

const Duration = styled.span`
  background: #f3f4f6;
  color: #6b7280;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 500;
`

const GettingStarted = styled.section`
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

const StartButton = styled(Link)`
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

function HomePage() {
  return (
    <HomePageContainer>
      <Hero>
        <h1>Promise</h1>
        <HeroSubtitle>
          Master JavaScript Async Programming in React
        </HeroSubtitle>
        <HeroDescription>
          An interactive tutorial covering async/await, Promises, and
          asynchronous patterns specifically designed for React developers.
        </HeroDescription>
      </Hero>

      <Overview>
        <h2>What You'll Learn</h2>
        <LearningGrid>
          <LearningCard>
            <h3>🔗 Promise Fundamentals</h3>
            <p>
              Understanding async operations, Promise states, and basic patterns
            </p>
          </LearningCard>
          <LearningCard>
            <h3>⚡ Async/Await Syntax</h3>
            <p>Modern asynchronous programming with clean, readable code</p>
          </LearningCard>
          <LearningCard>
            <h3>⚛️ React Integration</h3>
            <p>Handling async operations in React components and hooks</p>
          </LearningCard>
          <LearningCard>
            <h3>🛠️ Custom Hooks</h3>
            <p>
              Building reusable async logic with useFetch and useAsync patterns
            </p>
          </LearningCard>
          <LearningCard>
            <h3>🛡️ Error Handling</h3>
            <p>Graceful error management in async React applications</p>
          </LearningCard>
          <LearningCard>
            <h3>🚀 Performance</h3>
            <p>Optimization techniques for better user experience</p>
          </LearningCard>
        </LearningGrid>
      </Overview>

      <TableOfContents>
        <h2>Tutorial Chapters</h2>
        <ChaptersGrid>
          <ChapterGroup>
            <h3>Foundation (Beginner)</h3>
            <Chapters>
              <ChapterLink to='/chapter/1'>
                <ChapterNumber>01</ChapterNumber>
                <div>
                  <h4>Foundations of Asynchronous JavaScript</h4>
                  <p>Event loop, Promises, and basic async patterns</p>
                  <Duration>45 min</Duration>
                </div>
              </ChapterLink>
              <ChapterLink to='/chapter/2'>
                <ChapterNumber>02</ChapterNumber>
                <div>
                  <h4>Promise Patterns in React</h4>
                  <p>useEffect, loading states, and error boundaries</p>
                  <Duration>60 min</Duration>
                </div>
              </ChapterLink>
              <ChapterLink to='/chapter/3'>
                <ChapterNumber>03</ChapterNumber>
                <div>
                  <h4>Modern Async/Await Syntax</h4>
                  <p>Converting to async/await and error handling</p>
                  <Duration>50 min</Duration>
                </div>
              </ChapterLink>
            </Chapters>
          </ChapterGroup>

          <ChapterGroup>
            <h3>Advanced Patterns (Intermediate)</h3>
            <Chapters>
              <ChapterLink to='/chapter/4'>
                <ChapterNumber>04</ChapterNumber>
                <div>
                  <h4>Advanced Promise Patterns</h4>
                  <p>
                    Promise.all(), Promise.race(), and performance optimization
                  </p>
                  <Duration>75 min</Duration>
                </div>
              </ChapterLink>
              <ChapterLink to='/chapter/5'>
                <ChapterNumber>05</ChapterNumber>
                <div>
                  <h4>React Hooks and Async Patterns</h4>
                  <p>Custom hooks, useAsync, and complex async flows</p>
                  <Duration>90 min</Duration>
                </div>
              </ChapterLink>
              <ChapterLink to='/chapter/6'>
                <ChapterNumber>06</ChapterNumber>
                <div>
                  <h4>State Management with Async Operations</h4>
                  <p>Context API, optimistic updates, and state libraries</p>
                  <Duration>60 min</Duration>
                </div>
              </ChapterLink>
            </Chapters>
          </ChapterGroup>

          <ChapterGroup>
            <h3>Real-World Applications (Advanced)</h3>
            <Chapters>
              <ChapterLink to='/chapter/7'>
                <ChapterNumber>07</ChapterNumber>
                <div>
                  <h4>Real-World React Applications</h4>
                  <p>API integration, file operations, and background tasks</p>
                  <Duration>120 min</Duration>
                </div>
              </ChapterLink>
              <ChapterLink to='/chapter/8'>
                <ChapterNumber>08</ChapterNumber>
                <div>
                  <h4>Testing Async Code in React</h4>
                  <p>Testing async components and integration testing</p>
                  <Duration>45 min</Duration>
                </div>
              </ChapterLink>
              <ChapterLink to='/chapter/9'>
                <ChapterNumber>09</ChapterNumber>
                <div>
                  <h4>Performance and Best Practices</h4>
                  <p>Optimization, pitfalls, and code review guidelines</p>
                  <Duration>40 min</Duration>
                </div>
              </ChapterLink>
              <ChapterLink to='/chapter/10'>
                <ChapterNumber>10</ChapterNumber>
                <div>
                  <h4>Capstone Project</h4>
                  <p>Build a complete React application with async patterns</p>
                  <Duration>180 min</Duration>
                </div>
              </ChapterLink>
            </Chapters>
          </ChapterGroup>
        </ChaptersGrid>
      </TableOfContents>

      <GettingStarted>
        <h2>Ready to Start?</h2>
        <p>
          Begin with the fundamentals and work your way up to advanced patterns.
          Each chapter builds upon the previous one with hands-on examples and
          real-world applications.
        </p>
        <StartButton to='/chapter/1'>
          Start Chapter 1: Foundations
        </StartButton>
      </GettingStarted>
    </HomePageContainer>
  )
}

export default HomePage
