const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_helper')
const bcrypt = require('bcrypt')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blog')
const User = require('../models/user')

describe('When there are multiple blogs in db', () => {
    beforeEach(async () => {
        await User.deleteMany({})
        const passwordHash = await bcrypt.hash('secret', 10)
        const user = new User({ username: 'root', password: passwordHash })
        await user.save()

        await Blog.deleteMany({})
        const blogObjects = helper.initialBlogs
            .map(blog => new Blog({ ...blog, user: user.id }))
        const promiseArray = blogObjects.map(blog => blog.save())
        await Promise.all(promiseArray)

        user.blogs = user.blogs.concat(blogObjects)
        await user.save()
    })
    
    test('Blogs are returned as JSON', async () => {
        await api
            .get('/api/blogs')
            .expect(200)
            .expect('Content-Type', /application\/json/)
    
        const blogsAfterCreation = await helper.blogsInDb()
        
        expect(blogsAfterCreation).toHaveLength(helper.initialBlogs.length)
    })
    
    test('Blogs have property named id instead of _id', async () => {
        const blogsAfterCreation = await helper.blogsInDb()
        
        expect(blogsAfterCreation[0].id).toBeDefined()
        expect(blogsAfterCreation[0]._id).not.toBeDefined()
    })
    
    test('A new blog can be added', async() => {
        const user = (await helper.usersInDb())[0]
        const loginRequest = await api
            .post('/api/login')
            .send({ username: user.username, password: 'secret' })
            .expect(200)
            .expect('Content-Type', /application\/json/)

        const newBlog = {
            title: 'DIY for dummies',
            author: 'Mark Szczecin',
            url: '/diy-for-dummies.html',
            likes: 45
        }
    
        await api
            .post('/api/blogs')
            .set('Authorization', `bearer ${loginRequest.body.token}`)
            .send(newBlog)
            .expect(200)
            .expect('Content-Type', /application\/json/)
        
        const blogsAtEnd = await helper.blogsInDb()
        expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)
    
        const titles = blogsAtEnd.map(r => r.title)
        expect(titles).toContain(
            'DIY for dummies'
        )
    })
    
    test('A new blog without likes defaults to 0', async () => {
        const user = (await helper.usersInDb())[0]
        const loginRequest = await api
            .post('/api/login')
            .send({ username: user.username, password: 'secret' })
            .expect(200)
            .expect('Content-Type', /application\/json/)
        
        const newBlog = {
            title: 'Music of the Roman Empire',
            author: 'Titus Aurelius',
            url: '/music-roman-empire.html'
        }
    
        const createdBlog = await api
            .post('/api/blogs')
            .set('Authorization', `bearer ${loginRequest.body.token}`)
            .send(newBlog)
            .expect(200)
            .expect('Content-Type', /application\/json/)
    
        expect(createdBlog.body.likes).toBe(0)
    })
    
    test('A new blog without title or url throws an error', async() => {
        const user = (await helper.usersInDb())[0]
        const loginRequest = await api
            .post('/api/login')
            .send({ username: user.username, password: 'secret' })
            .expect(200)
            .expect('Content-Type', /application\/json/)
        
        const newBlogNoTitle = {
            author: 'Unknown',
            url: '/unkown-entry-1.html',
            likes: 42
        }
        await api
            .post('/api/blogs')
            .set('Authorization', `bearer ${loginRequest.body.token}`)
            .send(newBlogNoTitle)
            .expect(400)
        
        const newBlogNoUrl = {
            title: 'Mystery blog',
            author: 'Mulder',
            likes: 20
        }
        await api
            .post('/api/blogs')
            .set('Authorization', `bearer ${loginRequest.body.token}`)
            .send(newBlogNoUrl)
            .expect(400)
    
        const blogsAtEnd = await helper.blogsInDb()
        expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)
    })

    test('A blog without authorization is not added', async() => {
        const newBlog = {
            title: 'DIY for dummies',
            author: 'Mark Szczecin',
            url: '/diy-for-dummies.html',
            likes: 45
        }
    
        await api
            .post('/api/blogs')
            .send(newBlog)
            .expect(401)
            .expect('Content-Type', /application\/json/)
        
        const blogsAtEnd = await helper.blogsInDb()
        expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)
    })
    
    test('Deleting an existing blog', async () => {
        const user = (await helper.usersInDb())[0]
        const loginRequest = await api
            .post('/api/login')
            .send({ username: user.username, password: 'secret' })
            .expect(200)
            .expect('Content-Type', /application\/json/)

        const blogsAtStart = await helper.blogsInDb()

        const blogToDelete = blogsAtStart[1]

        await api
            .delete(`/api/blogs/${blogToDelete.id}`)
            .set('Authorization', `bearer ${loginRequest.body.token}`)
            .expect(204)
        
        const blogsAtEnd = await helper.blogsInDb()
        expect(blogsAtEnd).toHaveLength(blogsAtStart.length - 1)
    
        const titles = blogsAtEnd.map(r => r.title)
        expect(titles).not.toContain(blogToDelete.title)
    })
    
    test('Updating the amount of likes in a blog', async () => {
        const blogsAtStart = await helper.blogsInDb()
        const blogToUpdate = blogsAtStart[0]
        const newLikes = { likes: 106 }
    
        const updatedBlog = await api
            .put(`/api/blogs/${blogToUpdate.id}`)
            .send(newLikes)
            .expect(200)
        
        expect(updatedBlog.body.likes).toBe(newLikes.likes)
    })
})

describe('When there is a single user in db', () => {
    beforeEach(async () => {
        await User.deleteMany({})

        const passwordHash = await bcrypt.hash('secret', 10)
        const user = new User({ username: 'root', password: passwordHash })

        await user.save()
    })

    test('When a new user is created', async () => {
        const usersAtStart = await helper.usersInDb()

        const newUser = {
            username: "sbrok90",
            name: "Sandra Brock",
            password: "svcxi4543kl"
        }

        await api
            .post('/api/users')
            .send(newUser)
            .expect(200)
            .expect('Content-Type', /application\/json/)
        
        const usersAtEnd = await helper.usersInDb()
        expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)

        const usernames = usersAtEnd.map(user => user.username)
        expect(usernames).toContain(newUser.username)
    })

    describe('User validation tests', () => {
        test('User without username or password is not added', async () => {
            const usersAtStart = await helper.usersInDb()

            const withoutUsername = {
                name: 'John Doe',
                password: 'abckdsgt'
            }
            // Status code
            let response = await api
                .post('/api/users')
                .send(withoutUsername)
                .expect(400)
                .expect('Content-Type', /application\/json/)
            // Error message
            expect(response.body.error).toContain('`username` is required')

            const withoutPassword = {
                name: 'John Doe', 
                username: 'johndoe423'
            }
            // Status code
            response = await api
                .post('/api/users')
                .send(withoutPassword)
                .expect(400)
                .expect('Content-Type', /application\/json/)
            // Error message
            expect(response.body.error).toContain('`password` is required')
            
            const usersAtEnd = await helper.usersInDb()
            expect(usersAtEnd).toHaveLength(usersAtStart.length)
        })

        test('User with username or password without the minimum length is not added', async () => {
            const usersAtStart = await helper.usersInDb()

            const noLengthUsername = {
                name: 'Test User',
                username: 'aa', 
                password: 'asfkj35'
            }
            // Status code
            let response = await api
                .post('/api/users')
                .send(noLengthUsername)
                .expect(400)
                .expect('Content-Type', /application\/json/)
            // Error message
            expect(response.body.error).toContain('`username` is shorter than')

            const noLengthPassword = {
                name: 'Test User',
                username: 'testuser634',
                password: '42'
            }
            // Status code
            response = await api
                .post('/api/users')
                .send(noLengthPassword)
                .expect(400)
                .expect('Content-Type', /application\/json/)
            // Error message
            expect(response.body.error).toContain('`password` is shorter than')

            const usersAtEnd = await helper.usersInDb()
            expect(usersAtEnd).toHaveLength(usersAtStart.length)
        })

        test('User with existing username is not added', async () => {
            const usersAtStart = await helper.usersInDb()
    
            const userExistingUsername = {
                name: 'MyUser',
                username: 'root',
                password: '12643dgsd'
            }
            // Status code
            let response = await api
                .post('/api/users')
                .send(userExistingUsername)
                .expect(400)
                .expect('Content-Type', /application\/json/)
            // Error message
            expect(response.body.error).toContain('`username` to be unique')

            const usersAtEnd = await helper.usersInDb()
            expect(usersAtEnd).toHaveLength(usersAtStart.length)
        })
    })   
})


afterAll(() => {
    mongoose.connection.close()
})