const _ = require('lodash')

const dummy = (blogs) => {
  return Array.isArray(blogs) ? 1 : 0
}

const totalLikes = (blogs) => {
  return Array.isArray(blogs) 
    ? blogs.reduce((totalLikes, blog) => totalLikes + blog.likes, 0)
    : 0
}

const favoriteBlog = (blogs) => {
  return Array.isArray(blogs) && blogs.length > 0 
    ? blogs.reduce((previous, blog) => (blog.likes > previous.likes) 
                                        ? blog
                                        : previous)
    : 0
}
/*
const mostBlogs = (blogs) => {
  return Array.isArray(blogs) && blogs.length > 0 
    ? _.reduce(blogs, (previous, blog) => (blog.likes > previous.likes) 
                                        ? blog
                                        : previous, blogs[0])
    : 0
}
*/

const mostBlogs = (blogs) => {
  if (!Array.isArray(blogs) || blogs.length == 0)
    return {}
  
  const blogsByAuthor = _.groupBy(blogs, (blog) => blog.author )
  
  const authorBlogCount = _.map(blogsByAuthor, 
    (author) => 
      { 
        return { 
          author: author[0].author, 
          blogs: author.length 
        }
      }
  )
  
  return _.maxBy(authorBlogCount, (author) => author.blogs )
}

const mostLikes = (blogs) => {
  if (!Array.isArray(blogs) || blogs.length == 0) 
    return {}
  
  const blogsByAuthor = _.groupBy(blogs, (blog) => blog.author )
  
  const authorBlogCount = _.map(blogsByAuthor, 
    (author) => 
      { 
        return { 
          author: author[0].author, 
          likes: author.reduce((likes, blog) => likes + blog.likes, 0)
        }
      }
  )
  
  return _.maxBy(authorBlogCount, (author) => author.likes )
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs, 
  mostLikes
}