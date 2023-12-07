import Link from 'next/link'
import React from 'react'

function NotFound() {
  return (
    <div>
      <p>Sorry, the requested post does not exist.</p>
      <Link href={'/'}>Back to Home</Link>
    </div>
  )
}

export default NotFound
