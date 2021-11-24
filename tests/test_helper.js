const Blog = require('../models/blog')
const User = require('../models/user')

const initialBlogs = [
    {
        title: 'Flintknapping: The Basics',
        author: 'Ferdinand Aubert',
        url: '/flintknapping-basics.html',
        likes: 85
    },
    {
        title: 'Castle exploring in Germany',
        author: 'Mark Jensen',
        url: '/castle-exploring-germany.html',
        likes: 67
    },
    {
        title: 'Linear thought sentience',
        author: 'Vaanien Song',
        url: '/linear-thought-sentience.html',
        likes: 153
    }
]

const blogsInDb = async () => {
    const blogs = await Blog.find({})
    return blogs.map(blog => blog.toJSON())
}

const usersInDb = async () => {
    const users = await User.find({})
    return users.map(user => user.toJSON())
}

module.exports = {
    initialBlogs, blogsInDb, usersInDb
}