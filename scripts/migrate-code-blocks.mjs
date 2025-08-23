#!/usr/bin/env node
/**
 * Migration script to replace all CodeBlock usages with CodeSyntaxHighlighter
 * This ensures consistent syntax highlighting across all tutorial components
 */
import { readFileSync, writeFileSync } from 'fs'
import { glob } from 'glob'

const FILES_TO_UPDATE = [
  'src/examples/**/*.tsx',
  '!src/examples/shared/SyntaxHighlighter.tsx', // Exclude the highlighter itself
]

// Files to process
const files = glob.sync(FILES_TO_UPDATE.join(','), {
  ignore: FILES_TO_UPDATE.filter((f) => f.startsWith('!')),
})

console.log('🔍 Found files to process:', files.length)

files.forEach((file) => {
  console.log(`📝 Processing: ${file}`)

  let content = readFileSync(file, 'utf8')
  let hasChanges = false

  // Step 1: Update imports - Replace CodeBlock import with CodeSyntaxHighlighter
  if (
    content.includes('CodeBlock,') &&
    !content.includes('CodeSyntaxHighlighter,')
  ) {
    content = content.replace(
      /import\s*{\s*([^}]*),?\s*CodeBlock,?\s*([^}]*)\s*}\s*from\s*['"][^'"]*['"]/g,
      (match, before, after) => {
        const beforeClean = before ? before.trim() : ''
        const afterClean = after ? after.trim() : ''
        const allImports = [beforeClean, 'CodeSyntaxHighlighter', afterClean]
          .filter(Boolean)
          .join(',\n  ')
        return match.replace(/CodeBlock/, 'CodeSyntaxHighlighter')
      }
    )
    hasChanges = true
    console.log('  ✅ Updated imports')
  }

  // Step 2: Replace CodeBlock usage with CodeSyntaxHighlighter
  if (content.includes('<CodeBlock>')) {
    // Replace opening tag
    content = content.replace(
      /<CodeBlock>/g,
      '<CodeSyntaxHighlighter language="javascript">'
    )

    // Replace closing tag
    content = content.replace(/<\/CodeBlock>/g, '</CodeSyntaxHighlighter>')

    hasChanges = true
    console.log('  ✅ Updated CodeBlock usage')
  }

  // Step 3: Handle TypeScript/JSX content with appropriate language
  if (
    content.includes('useEffect') ||
    content.includes('useState') ||
    content.includes('React')
  ) {
    content = content.replace(
      /<CodeSyntaxHighlighter language="javascript">/g,
      '<CodeSyntaxHighlighter language="typescript">'
    )
    console.log('  ✅ Updated language to TypeScript for React content')
  }

  if (hasChanges) {
    writeFileSync(file, content, 'utf8')
    console.log(`  💾 Saved changes to ${file}`)
  } else {
    console.log(`  ⏭️  No changes needed for ${file}`)
  }
})

console.log('\n🎉 Migration completed!')
console.log(
  'Run `npm run fix && npm run build` to verify everything works correctly.'
)
