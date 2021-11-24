import React, { useState } from 'react'

const CreateBlogForm = ({ createBlog }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const addBlog = (event) => {
    event.preventDefault()

    createBlog({
      title, author, url
    })
    setTitle('')
    setAuthor('')
    setUrl('')
  }

  return (
    <>
      <form onSubmit={addBlog}>
        <label htmlFor="Title">Title</label>
        <input type="text"
          value={title}
          id="Title"
          name="Title"
          onChange={({ target }) => setTitle(target.value)} />

        <label htmlFor="Author">Author</label>
        <input type="text"
          value={author}
          id="Author"
          name="Author"
          onChange={({ target }) => setAuthor(target.value)} />

        <label htmlFor="Url">Url</label>
        <input type="text"
          value={url}
          id="Url"
          name="Url"
          onChange={({ target }) => setUrl(target.value)} />

        <button id="createBlogButton" type="submit">Create</button>
      </form>
    </>
  )
}

export default CreateBlogForm