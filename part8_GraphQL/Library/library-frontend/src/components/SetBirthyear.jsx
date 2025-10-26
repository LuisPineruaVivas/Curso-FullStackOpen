import { useState } from "react"
import { useMutation } from '@apollo/client/react'
import { ALL_AUTHORS } from '../queries'
import { EDIT_AUTHOR } from '../queries'


const SetBirthyear = ( { authors }) => {
    const [name, setName] = useState('')
    const [year, setYear] = useState('')

    const [ changeAuthor ] = useMutation(EDIT_AUTHOR, { refetchQueries: [ { query: ALL_AUTHORS } ] })

    const submit = (event) => {
        event.preventDefault()
        changeAuthor({ variables: { name, setBornTo: Number(year) } })

        setName('')
        setYear('')
    }

  return (
    <div>
      <h2>Set birthyear</h2>
      <form onSubmit={submit}>
        Author: <select
          value={name}
          onChange={({ target }) => setName(target.value)}
        >
          <option value="">Select author</option>
          {authors.map(a => <option key={a.name}>{a.name}</option>)}
        </select>
        <div>
          born: 
          <input
          type="number"
            value={year}
            onChange={({ target }) => setYear(target.value)}
          />
        </div>
        <button type="submit">Update Author</button>
      </form>
    </div>
  )
}

export default SetBirthyear