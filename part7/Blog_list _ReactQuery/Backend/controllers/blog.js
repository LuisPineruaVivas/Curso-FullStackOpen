const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const { userExtractor } = require('../utils/middleware')

blogsRouter.get('/', userExtractor, async (request, response) => {
  const blogs = await Blog.find({}). populate('user', { username: 1, name: 1 })
  response.json(blogs.sort((a, b) => b.likes - a.likes))
})

blogsRouter.get('/:id', userExtractor, async (request, response) => {
  const blog = await Blog.findById(request.params.id).populate('user', { username: 1, name: 1 })
  if (!blog) {
    return response.status(404).json({ error: 'blog not found' })
  }
  response.json(blog)
})

blogsRouter.post('/', userExtractor, async (request, response) => {
  const body = request.body
  const user = request.user

  if (!body.title || !body.url) {
    return response.status(400).json({
      error: 'title and url are required',
    })
  }

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
    user: user._id
  })

  const savedBlog = await blog.save()
  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()
  const populatedBlog = await Blog.findById(savedBlog._id).populate('user', { username: 1, name: 1 })
  response.status(201).json(populatedBlog)
})

blogsRouter.delete('/:id', userExtractor, async (request, response) => {
  const user = request.user
  const blog = await Blog.findById(request.params.id)

  if (!blog) {
    return response.status(404).json({ error: 'blog not found' })
  }
  
  if (blog.user.toString() === user.id.toString()) {
    await Blog.findByIdAndDelete(request.params.id)
    user.blogs = user.blogs.filter(b => b.toString() !== blog.id.toString())
    await user.save()
    response.status(204).end()
  } else {
    return response.status(401).json({ error: 'only the creator can delete the blog' })
  }
})

blogsRouter.put('/:id', userExtractor, async (request, response) => {
  const body = request.body

  const blog = {
    user: body.user.id,
    likes: body.likes,
    author: body.author,
    title: body.title,
    url: body.url,
  }

  const updatedBlog = 
    await Blog.findByIdAndUpdate(request.params.id, blog, { new: true }).populate('user', { username: 1, name: 1 })
  response.status(200).json(updatedBlog)
    
})

blogsRouter.post('/:id/comments', userExtractor, async (request, response) => {
  const body = request.body
  const blog = await Blog.findById(request.params.id)
  blog.comments = blog.comments.concat(body.comment)
  const savedBlog = await blog.save()
  response.json(savedBlog)
})

module.exports = blogsRouter