import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import Notification from './components/Notification'
import LoginForm from './components/LoginForm'
import BlogForm from './components/BlogForm'
import Togglable from '../../../Notes/Frontend_notes/src/components/Togglable'

const App = () => {
  const blogFormRef = useRef()
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('') 
  const [password, setPassword] = useState('') 
  const [user, setUser] = useState(null)
  const [notificationMessage, setNotificationMessage] = useState(null)
  const [typeNotification, setTypeNotification] = useState('')

  useEffect(() => {
    if(user){
      blogService.getAll().then(blogs =>
      setBlogs( blogs )
    ) 
    } 
  }, [user])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogappUser')
    setUser(null)
    blogService.setToken(null)
  }

  const handleLogin = async (event) => {
      event.preventDefault()
       try {
        const user = await loginService.login({
          username, password,
        })
        window.localStorage.setItem('loggedBlogappUser', JSON.stringify(user))
        blogService.setToken(user.token)
        setUser(user)
        setUsername('')
        setPassword('')
      } catch (exception) {
        setNotificationMessage('Wrong credentials', exception)
        setTypeNotification('error')
        setTimeout(() => {
          setNotificationMessage(null)
          setTypeNotification(null)
        }, 5000)
      }
    }

  const AddBlog = (blogObject) => {
    blogFormRef.current.toggleVisibility()
    try {
      blogService
      .create(blogObject)
      .then(returnedBlog => {
        setBlogs(blogs.concat(returnedBlog))
        setNotificationMessage(`a new blog ${returnedBlog.title} by ${returnedBlog.author} added`)
        setTypeNotification('success')
        setTimeout(() => {
          setNotificationMessage(null)
          setTypeNotification(null)
        }, 5000)
      })
    } catch (exception) {
      console.log(exception)
    }
  }

  const updateLikes = async (id) => {
    const blogToUpdate = blogs.find(b => b.id === id)
    const updatedBlog = { ...blogToUpdate, likes: blogToUpdate.likes + 1 }
    const returnedBlog = await blogService.update(id, updatedBlog)
    setBlogs(blogs.map(b => b.id !== id ? b : returnedBlog))
  }

  const deleteBlog = async (id) => {
    try {
      await blogService.remove(id)
      setBlogs(blogs.filter(b => b.id !== id))
    } catch (exception) {
      console.log(exception)
    }
  }

  return (
    <div>
      <h1>BLOGS</h1>
      <Notification message={notificationMessage} type={typeNotification} />
      { user === null ?
         <LoginForm
            username={username}
            password={password}
            handleUsernameChange={({ target }) => setUsername(target.value)}
            handlePasswordChange={({ target }) => setPassword(target.value)}
            handleSubmit={handleLogin}
          />:
        <div>
          <p>Logged in as {user.name} | <button onClick={handleLogout}>logout</button></p>
          <Togglable buttonLabel="Create new blog" ref={blogFormRef}>
            <BlogForm createBlog={AddBlog} />
          </Togglable>
          <br />
          {blogs.map(blog =>
            <Blog key={blog.id} blog={blog} onLike={updateLikes} onRemove={deleteBlog} user={user}/>
          )}
        </div>
      }
    </div>
  )
  }

export default App