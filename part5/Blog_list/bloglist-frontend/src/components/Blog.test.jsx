import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

test('renders Title and Author but not URL or likes', () => {
  const blog = {
    title: 'Component testing is done with react-testing-library',
    author: 'Luis Ale',
    url: 'https://testing-library.com/docs/react-testing-library/intro',
    likes: 10
  }


  render(<Blog blog={blog} />)

  const title = screen.getByText('Component testing is done with react-testing-library', { exact: false })
  const author = screen.getByText('Luis Ale', { exact: false })
  expect(title).toBeDefined()
  expect(author).toBeDefined()

  const url = screen.queryByText('https://testing-library.com/docs/react-testing-library/intro')
  expect(url).toBeNull()

  const likes = screen.queryByText('10')
  expect(likes).toBeNull()
  
})

test('clicking the button shows the url and likes', async () => {
  const blog = {
    title: 'Component testing is done with react-testing-library',
    author: 'Luis Ale',
    url: 'https://testing-library.com/docs/react-testing-library/intro',
    likes: 10,
    user: {
      id: "2",
      username: 'Luisale',
      name: 'Luis Ale'
    }
  }

  const userBlog = {
    id: 2,
    username: "Luisale",
    name: "Luis"
  }

  render(<Blog blog={blog}  user={userBlog}/>)

  const user = userEvent.setup()
  const button = screen.getByText('View Details')
  await user.click(button)

  const url = screen.getByText('https://testing-library.com/docs/react-testing-library/intro', { exact: false })
  expect(url).toBeDefined()

  const likes = screen.getByText('10', { exact: false })
  expect(likes).toBeDefined()   

})

test('clicking the like button twice calls event handler twice', async () => {
  const blog = {
    title: 'Component testing is done with react-testing-library',
    author: 'Luis Ale',
    url: 'https://testing-library.com/docs/react-testing-library/intro',
    likes: 10,
    user: {
      id: 2,
      username: 'Luisale',
      name: 'Luis Ale'
    }
  }

  const userBlog = {
    id: 2,
    username: "Luisale",
    name: "Luis"
  }

  const mockHandler = vi.fn()

  render(<Blog blog={blog} onLike={mockHandler} user={userBlog}/>)

  const user = userEvent.setup()
  const button = screen.getByText('View Details')
  await user.click(button)

  const likeButton = screen.getByText('like')
  await user.click(likeButton)
  await user.click(likeButton)

  expect(mockHandler.mock.calls).toHaveLength(2)

})