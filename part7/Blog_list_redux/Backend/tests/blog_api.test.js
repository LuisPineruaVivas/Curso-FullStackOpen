const { test, after, describe, beforeEach } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_helper')
const app = require('../app')
const Blog = require('../models/blog')
const api = supertest(app)


beforeEach(async () => {
  await Blog.deleteMany({})

   for (let blog of helper.initialBlogs) {
    let blogObject = new Blog(blog)
    await blogObject.save()
  }
})

describe('Blog_api', () => { 
    test('Blogs are returned as json and all blogs are returned ', async () => {
        await api
            .get('/api/blogs')
            .expect(200)
            .expect('Content-Type', /application\/json/)
        
        const blogs = await api.get('/api/blogs')
        assert.strictEqual(blogs.body.length, helper.initialBlogs.length)

    })

    test('a specific blog is within the returned blogs', async () => {
      const response = await api.get('/api/blogs')

      const titles = response.body.map(r => r.title)

      assert(titles.includes('Fitness and Health'))
    })

    test('a valid blog can be added', async () => {
      const newBlog = {
        title: 'Async/Await in Node.js',
        author: 'John Doe',
        url: 'https://blog.example.com/async-await-in-nodejs',
        likes: 0,
      }

      const token = await api
        .post('/api/login')
        .send({ username: 'root', password: 'sekret' })
        .then(response => response.body.token)

      await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      const blogsAtEnd = await helper.blogsInDb()
      assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1)

      const titles = blogsAtEnd.map(n => n.title)
      assert(titles.includes('Async/Await in Node.js'))
    })

     test('Verify that the blog posts unique identifier property is called id', async () => {
        const blog = new Blog({
            title: 'Unique Identifier Test',
            author: 'John Doe',
            url: 'https://blog.example.com/unique-identifier-test',
            likes: 0,
        })

        await blog.save()
        const blogJSON = blog.toJSON()
        assert.ok(blogJSON.id, 'La propiedad id no existe')
        assert.strictEqual(typeof blogJSON.id, 'string')
        assert.strictEqual(blogJSON._id, undefined)
    })

    test('Verify if the likes property is missing from the request, it defaults to 0', async () => {
        const blog = new Blog({
            title: 'Likes Test',
            author: 'John Doe',
            url: 'https://blog.example.com/likes-test',
        })

        await blog.save()
        const blogJSON = blog.toJSON()
        assert.strictEqual(blogJSON.likes, 0)
    })

    test ('Verify if the title and url properties are missing from the request, the request is rejected with status code 400', async () => {
        const newBlog ={
            author: 'John Doe',
            likes: 5,
        }

        const response = await api.post('/api/blogs').send(newBlog)
        assert.strictEqual(response.status, 401)
    })

    describe('deletion of a note', () => {
        test('succeeds with status code 204 if id is valid', async () => {
          const blogAtStart = await helper.blogsInDb()
          const blogToDelete = blogAtStart[0]

          const token = await api
            .post('/api/login')
            .send({ username: 'root', password: 'sekret' })
            .then(response => response.body.token)

    
          await api
            .delete(`/api/blogs/${blogToDelete.id}`)
            .set('Authorization', `Bearer ${token}`)
            .expect(204)
    
          const blogsAtEnd = await helper.blogsInDb()
    
          assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length - 1)
    
          const contents = blogsAtEnd.map(r => r.title)
          assert(!contents.includes(blogToDelete.content))
        })
      })

      describe('update of a note', () => {
        test('succeeds with status code 200 if likes where updated', async () => {
          const blogAtStart = await helper.blogsInDb()
          const blogToUpdate = blogAtStart[0]

          const updatedBlog = {
            ...blogToUpdate,
            likes: blogToUpdate.likes + 1
          }

          await api
            .put(`/api/blogs/${blogToUpdate.id}`)
            .send(updatedBlog)
            .expect(200)
    
          const blogsAtEnd = await helper.blogsInDb()
          const likes = blogsAtEnd.map(blog => blog.likes)

          assert.notStrictEqual(likes[0], blogToUpdate.likes)
        })
      })
    

    after(async () => {
    await mongoose.connection.close()
    })
})
