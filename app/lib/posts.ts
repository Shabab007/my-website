import { compileMDX } from 'next-mdx-remote/rsc'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'
import rehypeHighlight from 'rehype-highlight/lib'
import rehypeSlug from 'rehype-slug'
import rehypePrismPlus from 'rehype-prism-plus'

type Filetree = {
  tree: [
    {
      path: string
    },
  ]
}
export async function getPostByName(filename: string): Promise<BlogPost | undefined> {
  console.log(filename)
  const res = await fetch(`https://raw.githubusercontent.com/shabab007/my-posts/main/${filename}`, {
    headers: {
      Accept: 'application/vnd.github+json',
      Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
      'X-GitHub-Api-Version': '2022-11-28',
    },
  })
  if (!res.ok) return undefined
  const rawMDX = await res.text()
  console.log('sdjalsjdlasldjalsdlasldjl111111111111')
  if (rawMDX === '404: Not Found') return undefined

  const { frontmatter, content } = await compileMDX<Meta>({
    source: rawMDX,
    options: {
      parseFrontmatter: true,
      mdxOptions: {
        rehypePlugins: [
          rehypeHighlight,
          rehypeSlug,
          [rehypePrismPlus, { defaultLanguage: 'js', ignoreMissing: true }],
          [
            rehypeAutolinkHeadings,
            {
              behavior: 'wrap',
            },
          ],
        ],
      },
    },
  })
  const id = filename.replace(/\.mdx$/, '')
  const blogPostObj: BlogPost = {
    meta: { id, title: frontmatter.title, date: frontmatter.date, tags: frontmatter.tags },
    content,
  }
  console.log(blogPostObj)
  return blogPostObj
}
export async function getPostsMeta(): Promise<Meta[] | undefined> {
  const res = await fetch(
    'https://api.github.com/repos/shabab007/my-posts/git/trees/main?recursive=1',
    {
      headers: {
        Accept: 'application/vnd.github+json',
        Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
        'X-GitHub-Api-Version': '2022-11-28',
      },
    },
  )
  if (!res.ok) return undefined

  const repoFiletree: Filetree = await res.json()
  console.log(repoFiletree)
  const filesArray = repoFiletree.tree
    .map((obj) => obj.path)
    .filter((path) => path.endsWith('.mdx'))

  const posts: Meta[] = []

  for (const file of filesArray) {
    const post = await getPostByName(file)
    if (post) {
      const { meta } = post
      posts.push(meta)
    }
  }

  return posts.sort((a, b) => (a.date < b.date ? 1 : -1))
}
