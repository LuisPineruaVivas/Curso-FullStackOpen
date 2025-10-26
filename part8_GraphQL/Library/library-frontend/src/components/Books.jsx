import { useQuery } from '@apollo/client/react';
import { useState, useEffect } from 'react';
import { ALL_BOOKS } from '../queries'

const Books = (props) => {
    const [books, setBooks] = useState([]);
    const [genres, setGenres] = useState([]);
    const [genreFilter, setGenreFilter] = useState(null);
    const result = useQuery(ALL_BOOKS , {
          variables: { genre: genreFilter }
        });

    useEffect(() => {
      if (result.data && !genreFilter) {
        setBooks(result.data.allBooks)
        const uniqueGenres = Array.from(
          new Set(result.data.allBooks.flatMap(b => b.genres))
        );
        setGenres(uniqueGenres)  
      }
      if (result.data && genreFilter) {
        setBooks(result.data.allBooks)
      }

    }, [result.data, genreFilter])
    

    const filterByGenre = (event) => {
      const genre = event.target.textContent
      if (genre === 'all genres') {
        setGenreFilter(null)
        return
      }
      setGenreFilter(genre)
    }


  if (!props.show) {
    return null
  }

  return (
    <div>
      <h2>books</h2>

      {genreFilter ? <p>In genre <b>{genreFilter}</b></p> : null}

      <table>
        <tbody>
          <tr>
            <th>Book Title</th>
            <th>author</th>
            <th>published</th>
          </tr>
          {books.map((book) => (
            <tr key={book.id}>
              <td>{book.title}</td>
              <td>{book.author.name}</td>
              <td>{book.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div>
        <h3>Genres</h3>
        {genres.map((g) => (
          <button onClick={filterByGenre} key={g}>{g}</button>
        ))}
        <button onClick={filterByGenre} key='all genres'>all genres</button>
      </div>
    </div>
  )
}

export default Books
