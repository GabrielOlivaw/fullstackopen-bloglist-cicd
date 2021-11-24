import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, fireEvent } from '@testing-library/react'
import CreateBlogForm from './CreateBlogForm'

test('Testing <CreateBlogForm /> when a new blog is created.', () => {
  const createBlog = jest.fn()

  const component = render(
    <CreateBlogForm createBlog={createBlog} />
  )

  // Fill create blog form fields
  const title = component.container.querySelector('#Title')
  fireEvent.change(title, {
    target: { value: 'Web development on fullstack' }
  })
  const author = component.container.querySelector('#Author')
  fireEvent.change(author, {
    target: { value: 'Jana Johnson' }
  })
  const url = component.container.querySelector('#Url')
  fireEvent.change(url, {
    target: { value: 'entries/web-development-fullstack.html' }
  })

  // Submit create blog form
  const form = component.container.querySelector('form')
  fireEvent.submit(form)

  expect(createBlog.mock.calls).toHaveLength(1)
  expect(createBlog.mock.calls[0][0].title).toBe('Web development on fullstack')
  expect(createBlog.mock.calls[0][0].author).toBe('Jana Johnson')
  expect(createBlog.mock.calls[0][0].url).toBe('entries/web-development-fullstack.html')
})