import { useQuery } from '@apollo/client/react';
import { useState, useEffect } from 'react';
import { ALL_BOOKS, ME } from '../queries'

const Recommend = (props) => {
    const [books, setBooks] = useState([]);
    const [favoriteGenre, setFavoriteGenre] = useState();
    const result = useQuery(ALL_BOOKS);
    const userResult = useQuery(ME);

    useEffect(() => {
        if (result.data && userResult.data) {
          const favoriteGenre = userResult.data.me.favoriteGenre
          setFavoriteGenre(favoriteGenre)
          setBooks(result.data.allBooks.filter(b => b.genres.includes(favoriteGenre)))
        }
        }, [result.data])
    
  if (!props.show) {
    return null
  }

  return (
    <div>
      <h2>Recommendations</h2>

      <p>Books in your favorite genre <b>{favoriteGenre}</b></p>

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
    </div>
  )
}

export default Recommend;
