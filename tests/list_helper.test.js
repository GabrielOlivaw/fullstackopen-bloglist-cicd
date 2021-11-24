const { TestScheduler } = require('jest')
const listHelper = require('../utils/list_helper')

const blogs = [
  {
    _id: "5f73865c25e1990990c75229",
    title: "What's so great about Bohemian Rhapsody?",
    author: "Frederik Mercurium",
    url: "/great-bohemian-rhapsody.html",
    likes: 268,
    __v: 0
  },
  {
    _id: "5f7631a16435ec312c56d500",
    title: "Retrofuturism in the 80s",
    author: "Sarah OConnor",
    url: "/retrofuturism-80s.html",
    likes: 460,
    __v: 0
  },
  {
    _id: "5f7631a86435ec312c56d5cd",
    title: "Retrofuturism in the 90s",
    author: "Sarah OConnor",
    url: "/retrofuturism-90s.html",
    likes: 124,
    __v: 0
  },
  {
    _id: "5f7635f5caed1b2d6809f001",
    title: "Science fiction: What's next?",
    author: "Isaak Oksimov",
    url: "/science-fiction-next.html",
    likes: 459,
    __v: 0
  },
  {
    _id: "5f7635f5caed1b2d6809f001",
    title: "Science fiction: What's next? II",
    author: "Isaak Oksimov",
    url: "/science-fiction-next-ii.html",
    likes: 250,
    __v: 0
  }
]

test('Dummy returns one', () => {
  const blogs = []

  const result = listHelper.dummy(blogs)
  expect(result).toBe(1)
})

describe('Total likes', () => {

  test('Non-array input', () => {
    const result = listHelper.totalLikes('test')
    expect(result).toBe(0)
  })

  test('Empty bloglist array', () => {
    const result = listHelper.totalLikes([])
    expect(result).toBe(0)
  })
  
  test('of a single blog array', () => {
    result = listHelper.totalLikes([blogs[1]])
    expect(result).toBe(blogs[1].likes)
  })
  
  test('of a multiple blog array', () => {
    result = listHelper.totalLikes(blogs)
    expect(result).toBe(blogs.reduce((acc, cur) => acc + cur.likes, 0))
  })

})

describe('Favorite blog', () => {
    
  test('Non-array input', () => {
    const result = listHelper.favoriteBlog(42)
    expect(result).toBe(0)
  })
  
  test('Empty bloglist array', () => {
    const result = listHelper.favoriteBlog([])
    expect(result).toBe(0)
  })
  
  test('of a single blog array', () => {
    const result = listHelper.favoriteBlog([blogs[2]])
    expect(result).toEqual(blogs[2])
  })
  
  test('of a multiple blog array', () => {
    const result = listHelper.favoriteBlog(blogs)
    expect(result).toEqual(blogs[1])
  })
})

describe('Most blogs', () => {

  test('Non-array input', () => {
    const result = listHelper.mostBlogs(20)
    expect(result).toEqual({})
  })

  test('Empty bloglist array', () => {
    const result = listHelper.mostBlogs([])
    expect(result).toEqual({})
  })

  test('of a single blog array', () => {
    const result = listHelper.mostBlogs([blogs[0]])
    expect(result).toEqual({ author: blogs[0].author, blogs: 1 })
  })

  test('of a multiple blog array', () => {
    const result = listHelper.mostBlogs(blogs)
    expect(result).toEqual({ author: blogs[1].author, blogs: 2 })
  })
})

describe('Most likes', () => {

  test('Non-array input', () => {
    const result = listHelper.mostLikes(4)
    expect(result).toEqual({})
  })

  test('Empty bloglist array', () => {
    const result = listHelper.mostLikes([])
    expect(result).toEqual({})
  })

  test('of a single blog array', () => {
    const result = listHelper.mostLikes([blogs[0]])
    expect(result).toEqual({ author: blogs[0].author, likes: blogs[0].likes })
  })

  test('of a multiple blog array', () => {
    const result = listHelper.mostLikes(blogs)
    expect(result).toEqual({ author: "Isaak Oksimov", likes: 709 })
  })
})