import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import remark from 'remark'
import html from 'remark-html'

const collectionsDirectory = path.join(process.cwd(), 'collections')

export function getSortedCollectionsData() {
  // Get file names under /collections
  const fileNames = fs.readdirSync(collectionsDirectory)
  const allCollectionsData = fileNames.map(fileName => {
    // Remove ".md" from file name to get id
    const id = fileName.replace(/\.md$/, '')

    // Read markdown file as string
    const fullPath = path.join(collectionsDirectory, fileName)
    const fileContents = fs.readFileSync(fullPath, 'utf8')

    // Use gray-matter to parse the collection metadata section
    const matterResult = matter(fileContents)

    // Combine the data with the id
    return {
        id,
      ...(matterResult.data as { date: string; title: string; image: string })
    }
  })
  // Sort collections by date
  return allCollectionsData.sort((a, b) => {
    if (a.date < b.date) {
      return 1
    } else {
      return -1
    }
  })
}

export function getAllCollectionsIds() {
  const fileNames = fs.readdirSync(collectionsDirectory)
  return fileNames.map(fileName => {
    return {
      params: {
        id: fileName.replace(/\.md$/, '')
      }
    }
  })
}

export async function getCollectionData(id: string) {
  const fullPath = path.join(collectionsDirectory, `${id}.md`)
  const fileContents = fs.readFileSync(fullPath, 'utf8')
  // Use gray-matter to parse the post metadata section
  const matterResult = matter(fileContents)

  // Use remark to convert markdown into HTML string
  const processedContent = await remark()
    .use(html)
    .process(matterResult.content)

  const contentHtml = processedContent.toString()

  // Combine the data with the id and contentHtml
  return {
    id,
    contentHtml,
    ...(matterResult.data as { date: string; title: string; image: string })
  }
}