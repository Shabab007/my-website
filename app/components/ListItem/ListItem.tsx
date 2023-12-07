import Link from 'next/link'
import React from 'react'

type Props = {
  post: Meta
}
function getFormattedDate(dateString: string): string {
  return new Intl.DateTimeFormat('en-US', { dateStyle: 'long' }).format(new Date(dateString))
}
const ListItem = ({ post }: Props) => {
  const { id, title, date } = post
  return (
    <li>
      <Link className='underline hover:text-black/70 dark:hover:text-white' href={`/posts/${id}`}>
        {title}
      </Link>
      <br />
      <p>{getFormattedDate(date)}</p>
    </li>
  )
}

export default ListItem
