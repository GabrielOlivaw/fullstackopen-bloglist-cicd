import React, { useState } from 'react'
import './Blog.css'

const Blog = ({ blog, loggedUsername, handleLike, handleDelete }) => {
  const [showDetails, setShowDetails] = useState(false)

  const toggleVisibility = () => {
    setShowDetails(!showDetails)
  }

  const addLike = () => {
    const likedBlog = {
      ...blog,
      likes: blog.likes + 1
    }
    handleLike(blog.id, likedBlog)
  }

  const deleteBlog = () => {
    if (window.confirm(`Are you sure you want to delete ${blog.title} by ${blog.author}?`))
      handleDelete(blog.id)
  }

  const deleteButton = () =>  (
    <><button type="button" onClick={deleteBlog}>Delete</button></>
  )

  const showBlogDetails = () => (
    <div className="blogDetails">
      <div>{blog.url}</div>
      <div>Likes: {blog.likes} <button className="likeButton" type="button" onClick={addLike}>Like</button></div>
      <div>{blog.user?.name}</div>
      {blog.user?.username === loggedUsername && deleteButton()}
    </div>
  )

  return (
    <div id={blog.id} className="blog">
      {blog.title} {blog.author}
      <button className="showButton" type="button" onClick={toggleVisibility}>{showDetails ? 'Hide' : 'Show'}</button>
      { showDetails && showBlogDetails() }
    </div>
  )
}

export default Blog