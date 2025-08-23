import {
  ChapterGroup,
  ChapterLink,
  ChapterNumber,
  Chapters,
  ChaptersGrid,
  Duration,
  GettingStarted,
  Hero,
  HeroDescription,
  HeroSubtitle,
  HomePageContainer,
  LearningCard,
  LearningGrid,
  Overview,
  StartButton,
  TableOfContents,
} from './HomePage.styles'

function HomePage() {
  return (
    <HomePageContainer>
      <Hero>
        <h1>JavaScript Async Programming</h1>
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
                  <h4>Mastering Error Handling in Async React</h4>
                  <p>Error patterns, React error boundaries, and production strategies</p>
                  <Duration>60 min</Duration>
                </div>
              </ChapterLink>
              <ChapterLink to='/chapter/4'>
                <ChapterNumber>04</ChapterNumber>
                <div>
                  <h4>Modern Async/Await Syntax</h4>
                  <p>Converting to async/await and advanced try/catch patterns</p>
                  <Duration>50 min</Duration>
                </div>
              </ChapterLink>
            </Chapters>
          </ChapterGroup>

          <ChapterGroup>
            <h3>Advanced Patterns (Intermediate)</h3>
            <Chapters>
              <ChapterLink to='/chapter/5'>
                <ChapterNumber>05</ChapterNumber>
                <div>
                  <h4>Advanced Promise Patterns</h4>
                  <p>
                    Promise.all(), Promise.race(), and performance optimization
                  </p>
                  <Duration>75 min</Duration>
                </div>
              </ChapterLink>
              <ChapterLink to='/chapter/6'>
                <ChapterNumber>06</ChapterNumber>
                <div>
                  <h4>React Hooks and Async Patterns</h4>
                  <p>Custom hooks, useAsync, and complex async flows</p>
                  <Duration>90 min</Duration>
                </div>
              </ChapterLink>
              <ChapterLink to='/chapter/7'>
                <ChapterNumber>07</ChapterNumber>
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
              <ChapterLink to='/chapter/8'>
                <ChapterNumber>08</ChapterNumber>
                <div>
                  <h4>Real-World React Applications</h4>
                  <p>API integration, file operations, and background tasks</p>
                  <Duration>120 min</Duration>
                </div>
              </ChapterLink>
              <ChapterLink to='/chapter/9'>
                <ChapterNumber>09</ChapterNumber>
                <div>
                  <h4>Testing Async Code in React</h4>
                  <p>Testing async components and integration testing</p>
                  <Duration>45 min</Duration>
                </div>
              </ChapterLink>
              <ChapterLink to='/chapter/10'>
                <ChapterNumber>10</ChapterNumber>
                <div>
                  <h4>Performance and Best Practices</h4>
                  <p>Optimization, pitfalls, and code review guidelines</p>
                  <Duration>40 min</Duration>
                </div>
              </ChapterLink>
              <ChapterLink to='/chapter/11'>
                <ChapterNumber>11</ChapterNumber>
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
        <StartButton to='/chapter/1'>Start Chapter 1: Foundations</StartButton>
      </GettingStarted>
    </HomePageContainer>
  )
}

export default HomePage
