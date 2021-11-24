import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, fireEvent } from '@testing-library/react'
import Blog from './Blog'

describe('Render and behavior of a <Blog /> element.', () => {
  const blog = {
    title: 'Testing frontend I',
    author: 'Gabriel Knight',
    url: 'https://testblog.com/entries/testing-frontend-i',
    likes: 78
  }

  let component, likeBlog
  beforeEach(() => {
    likeBlog = jest.fn()

    component = render(
      <Blog blog={blog} handleLike={likeBlog} />
    )
  })

  test('Renders Blog title and author, not url or likes by default.', () => {
    const container = component.container

    expect(container).toHaveTextContent(blog.title)
    expect(container).toHaveTextContent(blog.author)
    expect(container).not.toHaveTextContent(blog.url)
    expect(container).not.toHaveTextContent(blog.likes)
  })

  test('Renders Blog url and likes when Show button is clicked.', () => {
    const showButton = component.container.querySelector('.showButton')
    fireEvent.click(showButton)

    const blogDetails = component.container.querySelector('.blogDetails')
    expect(blogDetails).not.toHaveStyle('display: none')
    expect(blogDetails).toHaveTextContent(blog.url)
    expect(blogDetails).toHaveTextContent(blog.likes)
  })

  test('Like event handler is called twice when Like button is clicked twice.', () => {
    const showButton = component.container.querySelector('.showButton')
    fireEvent.click(showButton)

    const likeButton = component.container.querySelector('.likeButton')
    fireEvent.click(likeButton)
    fireEvent.click(likeButton)

    expect(likeBlog.mock.calls).toHaveLength(2)
  })
})
