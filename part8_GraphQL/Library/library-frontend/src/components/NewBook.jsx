import { useState } from 'react'
import { useMutation } from '@apollo/client/react'
import { ALL_BOOKS, ADD_BOOK, ALL_AUTHORS } from '../queries'

const NewBook = (props) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [published, setPublished] = useState('')
  const [genre, setGenre] = useState('')
  const [genres, setGenres] = useState([])

  const [ createBook ] = useMutation(ADD_BOOK, {
    refetchQueries: [ { query: ALL_BOOKS }, { query: ALL_AUTHORS } ],
    onCompleted: () => {
      setTitle('')
      setPublished('')
      setAuthor('')
      setGenres([])
      setGenre('')
      props.notify(`a new book "${title}" by ${author} added`)
    },
    onError: (error) => {
      console.log(error.errors[0].message)
      props.notify(error.errors[0].message)
    },
    update: (store, response) => {
      props.updateCacheWith(response.data.addBook)
    },
  })

  if (!props.show) {
    return null
  }

  const submit = async (event) => {
    event.preventDefault()

    if (!title || !author || !published || genres.length === 0) {
      console.log("Missing required fields");
      return;
    }

    createBook({ variables: { title, author, published: Number(published), genres } })
  }

  const addGenre = () => {
    setGenres(genres.concat(genre))
    setGenre('')
  }

  return (
    <div>
      <form onSubmit={submit}>
        <div>
          title
          <input
            value={title}
            onChange={({ target }) => setTitle(target.value)}
          />
        </div>
        <div>
          author
          <input
            value={author}
            onChange={({ target }) => setAuthor(target.value)}
          />
        </div>
        <div>
          published
          <input
            type="number"
            value={published}
            onChange={({ target }) => setPublished(target.value)}
          />
        </div>
        <div>
          <input
            value={genre}
            onChange={({ target }) => setGenre(target.value)}
          />
          <button onClick={addGenre} type="button">
            add genre
          </button>
        </div>
        <div>genres: {genres.join(' ')}</div>
        <button type="submit">create book</button>
      </form>
    </div>
  )
}

export default NewBook