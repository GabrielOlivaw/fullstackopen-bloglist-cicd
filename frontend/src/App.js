import React, { useState, useEffect, useRef } from 'react'

import Blog from './components/Blog'
import LoginForm from './components/LoginForm'
import CreateBlogForm from './components/CreateBlogForm'
import Notification from './components/Notification'
import Togglable from './components/Togglable'

import blogService from './services/blogs'
import loginService from './services/login'

// TODO: When a blog with delete button is liked, delete button disappears
const App = () => {
  const [blogs, setBlogs] = useState([])

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)

  const [notification, setNotification] = useState(null)

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBloglistUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const showNotification = (message, type) => {
    setNotification({ message, type })
    setTimeout(() => {
      setNotification(null)
    }, 5000)
  }

  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const user = await loginService.login({ username, password })

      window.localStorage.setItem('loggedBloglistUser', JSON.stringify(user))
      setUser(user)
      setUsername('')
      setPassword('')

      showNotification(`User ${username} logged in.`, 'message')
    } catch (exception) {
      showNotification('Wrong credentials.', 'error')
    }
  }

  const handleLogout = (event) => {
    event.preventDefault()

    window.localStorage.removeItem('loggedBloglistUser')
    setUser(null)
  }

  const handleCreateBlog = async (blogObject) => {
    try {
      blogFormRef.current.toggleVisibility()

      const createdBlog = await blogService.create(blogObject)
      setBlogs(blogs.concat(createdBlog))

      showNotification(`A new blog ${blogObject.title} by ${blogObject.author} added.`, 'message')
    } catch (exception) {
      showNotification('Wrong credentials.', 'error')
    }
  }

  const handleLike = async (id, blogObject) => {
    try {
      const editBlog = await blogService.update(id, blogObject)
      setBlogs(blogs.map(blog => (blog.id === editBlog.id) ? editBlog : blog))

      showNotification(`Like added to blog ${blogObject.title}.`, 'message')
    } catch (exception) {
      showNotification('There was an error trying to like a blog.', 'error')
    }
  }
  const handleDelete = async (id) => {
    try {
      await blogService.remove(id)
      setBlogs(blogs.filter(blog => blog.id !== id))

      showNotification('Blog deleted successfully.', 'message')
    } catch (exception) {
      showNotification('There was an error trying to delete a blog.', 'error')
    }
  }

  const loginForm = () => (
    <div>
      <h2>Bloglist Login</h2>
      <LoginForm onSubmit={handleLogin}
        username={username} handleUsernameChange={({ target }) => setUsername(target.value)}
        password={password} handlePasswordChange={({ target }) => setPassword(target.value)} />
    </div>
  )

  const logoutForm = () => (
    <div style={{ marginBottom: '10px' }}>
      Welcome, {user.name}.
      <form onSubmit={handleLogout} style={{ display: 'inline-block' }}>
        <button type="submit">Logout</button>
      </form>
    </div>
  )

  const blogFormRef = useRef()

  const createBlogForm = () => (
    <div>
      <Togglable buttonLabel="New blog" ref={blogFormRef}>
        <h2>Create Blog</h2>
        <CreateBlogForm createBlog={handleCreateBlog} />
      </Togglable>
    </div>
  )

  return (
    <div>
      <h1>Bloglist application</h1>
      <Notification notification={notification} />
      {user === null ?
        loginForm() :
        <div>
          <h2>blogs</h2>
          {logoutForm()}
          {createBlogForm()}
          <div id="blogList">
            {
              blogs
                .sort((a, b) => b.likes - a.likes)
                .map(blog =>
                  <Blog key={blog.id} blog={blog} loggedUsername={user.username}
                    handleLike={handleLike} handleDelete={handleDelete} />
                )
            }
          </div>
        </div>
      }
      <p>Powered by GitHub Actions</p>
    </div>
  )
}

export default App