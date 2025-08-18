import { useEffect } from 'react'
import AnecdoteList from './components/AnecdoteList'
import VisibilityFilter from './components/visibilityFilter'
import Notification from './components/Notification'
import { useDispatch } from 'react-redux'
import { initializeAnecdotes } from './reducers/anecdoteReducer'
import AnecdoteForm from './components/AnecdoteForm'

const App = () => {
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(initializeAnecdotes()) 
  })

  return (
    <div>
      <h1>Anecdotes</h1>
      <Notification/>
      <VisibilityFilter/>
      <AnecdoteList/>
      <AnecdoteForm/>
    </div>
  )
}

export default App