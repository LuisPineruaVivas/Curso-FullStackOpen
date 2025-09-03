const Blog = require('../models/blog')
const User = require('../models/user')

const initialBlogs = [
  {
    title: 'Fitness and Health',
    author: 'Luis',
    url: 'https://fitnessandhealth.com',
    likes: 10,
    user: '687c1fe108917f0477a07f82'
  },
 {
    title: 'Tech Innovations',
    author: 'John Doe',
    url: 'https://techinnovations.com',
    likes: 5,
    user: '687c1fe108917f0477a07f82'
 }
]

const nonExistingId = async () => {
  const blog = new Blog({ content: 'willremovethissoon' })
  await blog.save()
  await blog.deleteOne()

  return blog._id.toString()
}

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map(blog => blog.toJSON())
}

const usersInDb = async () => {
  const users = await User.find({})
  return users.map(user => user.toJSON())
}

module.exports = {
  initialBlogs, nonExistingId, blogsInDb, usersInDb
}