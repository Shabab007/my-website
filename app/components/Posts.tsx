import { getPostsMeta } from '../lib/posts'
import ListItem from './ListItem/ListItem'

const Posts = async () => {
  const posts = await getPostsMeta()
  console.log(posts)

  if (!posts) {
    return <p>Sorry, no posts available.</p>
  }
  return (
    <div>
      <h2>Blog</h2>
      <ul>
        {posts.map((post) => (
          <ListItem key={post.id} post={post} />
        ))}
      </ul>
    </div>
  )
}

export default Posts
