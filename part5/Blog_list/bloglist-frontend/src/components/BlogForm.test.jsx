import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import BlogForm from './BlogForm'

test('<BlogForm /> updates parent state and calls onSubmit', async () => {
    const createBlog = vi.fn()
    const user = userEvent.setup()

    render(<BlogForm createBlog={createBlog} />)

    const titleInput = screen.getByPlaceholderText('Title')
    const authorInput = screen.getByPlaceholderText('Author')
    const urlInput = screen.getByPlaceholderText('Url')
    const sendButton = screen.getByText('create')

    await user.type(titleInput, 'testing title...')
    await user.type(authorInput, 'testing author...')
    await user.type(urlInput, 'testing url...')
    await user.click(sendButton)

    expect(createBlog.mock.calls).toHaveLength(1)
    expect(createBlog.mock.calls[0][0].title).toBe('testing title...')
    expect(createBlog.mock.calls[0][0].author).toBe('testing author...')
    expect(createBlog.mock.calls[0][0].url).toBe('testing url...')
})