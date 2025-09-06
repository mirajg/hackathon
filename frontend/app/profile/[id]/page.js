
'use client'
import { useParams } from 'next/navigation'
import React from 'react'

const PostPage = () => {
  const params = useParams(); 
  return (
    <div> 
      <h1>Post ID: {params.id}</h1>
    </div>
  )
}

export default PostPage
