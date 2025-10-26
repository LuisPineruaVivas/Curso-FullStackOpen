import { useQuery } from '@apollo/client/react';
import { useState, useEffect } from 'react';
import { ALL_AUTHORS } from '../queries'
import SetBirthyear from './SetBirthyear';

const Authors = (props) => {
  const [authors, setAuthors] = useState([])

  const result = useQuery(ALL_AUTHORS)
  useEffect(() => {
    if (result.data) {
      setAuthors(result.data.allAuthors)
    }
  }, [result.data])

  
  if (!props.show) {
    return null
  }
  

  return (
    <div>
      <h2>authors</h2>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>born</th>
            <th>books</th>
          </tr>
          {authors.map((a) => (
            <tr key={a.name}>
              <td>{a.name}</td>
              <td>{a.born}</td>
              <td>{a.books.length}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {props.token ? <SetBirthyear authors={authors} /> : null}
    </div>
  )
}

export default Authors
