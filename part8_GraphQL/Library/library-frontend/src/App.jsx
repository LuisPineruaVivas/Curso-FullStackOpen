import { useState } from "react";
import { useQuery, useMutation, useSubscription, useApolloClient } from '@apollo/client/react';
import Authors from "./components/Authors";
import Books from "./components/Books";
import NewBook from "./components/NewBook";
import LoginForm from "./components/LoginForm";
import Recommend from "./components/recommend";
import { BOOK_ADDED, ALL_BOOKS } from "./queries";

const App = () => {
  const [token, setToken] = useState(window.localStorage.getItem('library-user-token'))
  const [page, setPage] = useState("authors");
  const [errorMessage, setErrorMessage] = useState(null)
  const [favoriteGenre, setFavoriteGenre] = useState(null)
  const client = useApolloClient()

  const updateCacheWith = (addedBook) => {
    const includedIn = (set, object) => 
      set.map(p => p.id).includes(object.id)  

    const dataInStore = client.readQuery({ query: ALL_BOOKS, variables: { genre: null } })
    if (!includedIn(dataInStore.allBooks, addedBook)) {
      client.writeQuery({
        query: ALL_BOOKS,
        variables: { genre: null },
        data: { allBooks : dataInStore.allBooks.concat(addedBook) }
      })
      try { 
        const data = client.readQuery({ query: ALL_BOOKS, variables: { genre: null } }); 
      } catch (e) { console.error('readQuery failed', e); }
    }
  }

  useSubscription(BOOK_ADDED, {
    onData: ({ data }) => {
      const addedBook = data.data.bookAdded
      notify(`${addedBook.title} added`)
      updateCacheWith(addedBook)
    }
  })

  const notify = (message) => {
    setErrorMessage(message)
    setTimeout(() => {
      setErrorMessage(null)
    }, 10000)
  }

    const logout = () => {
      setToken(null)
      localStorage.clear()
      client.resetStore()
      setPage('books')
    }

  return (
    <div>
      <div>
        <button onClick={() => setPage("authors")}>authors</button>
        <button onClick={() => setPage("books")}>books</button>
        { token ? (
          <>
          <button onClick={() => setPage("add")}>add book</button>
          <button onClick={() => setPage("recommended")}> recommend</button>
          <button onClick={() => {logout()}}>logout</button>
          </>
        ) : <button onClick={() => setPage("login")}>Login</button>  }
      </div>

      <Notify errorMessage={errorMessage} />

      <Authors show={page === "authors"} token={token} />

      <Books show={page === "books"} />

      <NewBook show={page === "add"}  notify={notify} updateCacheWith={updateCacheWith} />

      {token && <Recommend show={page === "recommended"} favoriteGenre={favoriteGenre} />}

      <LoginForm setError={notify} setToken={setToken} setFavoriteGenre={setFavoriteGenre} show={page === "login"} setPage={setPage} />
    </div>
  );
};

const Notify = ({errorMessage}) => {
  if ( !errorMessage ) {
    return null
  }
  return (
    <div style={{color: 'red'}}>
    {errorMessage}
    </div>
  )
}

export default App;
