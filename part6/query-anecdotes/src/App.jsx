import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query"
import { getAnecdotes, voteAnecdote } from "./requests"
import AnecdoteForm from './components/AnecdoteForm'
import Notification from './components/Notification'
import { useNotificationDispatch } from "./notificationContext"

const App = () => {
  const queryClient = useQueryClient()
  const dispatch = useNotificationDispatch()

  const  { isPending, isError, data, error } = useQuery({
    queryKey: ['anecdotes'],
    queryFn: getAnecdotes,
    retry: 1
  })

  const voteAnecdoteMutation = useMutation({
    mutationFn: voteAnecdote,
    onSuccess: (votedAnecdote) => {
      const anecdotes = queryClient.getQueryData(['anecdotes'])
      queryClient.setQueryData(['anecdotes'], anecdotes.map(anecdote => anecdote.id !== votedAnecdote.id ? anecdote : votedAnecdote))
      dispatch({ type: 'SET', payload: `you voted "${votedAnecdote.content}"` })
      setTimeout(() => {
        dispatch({ type: 'CLEAR' })
      }, 5000)
    }
  })

  if (isPending) {
    return <div>loading data...</div>
  }

  if (isError) {
    return <div> Anecdote service not available due to problems in server {error.message}</div>
  }

  const handleVote = (anecdote) => {
    voteAnecdoteMutation.mutate({ ...anecdote, votes: anecdote.votes + 1 })
  }

  return (
    <div>
      <h3>Anecdote app</h3>
    
      <Notification />
      <AnecdoteForm />
    
      {data.map(anecdote =>
        <div key={anecdote.id}>
          <div>
            {anecdote.content}
          </div>
          <div>
            has {anecdote.votes}
            <button onClick={() => handleVote(anecdote)}>vote</button>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
