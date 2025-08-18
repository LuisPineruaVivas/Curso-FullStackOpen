import { useDispatch, useSelector } from 'react-redux'
import { vote } from '../reducers/anecdoteReducer'
import { setNotification } from '../reducers/notificationReducer'

const Anecdote = (anecdote, handleVote) => {
    return (
        <div key={anecdote.id}>
            <div>
                {anecdote.content}
            </div>
            <div>
                has {anecdote.votes}
            <button onClick={handleVote}>vote</button>
            </div>     
        </div>
    )
}


const AnecdoteList = () => {
    const dispatch = useDispatch()
    const anecdotes = useSelector(state => state.anecdotes);
    const filter = useSelector(state => state.filter);
    const sortedAnecdotes = [...anecdotes].sort((a, b) => b.votes - a.votes);

    if (filter === '') {
        return (
            <div>
                {sortedAnecdotes.map(anecdote => 
                    Anecdote(anecdote, async () => {
                        dispatch(vote(anecdote.id, anecdote))
                        dispatch(setNotification(`you voted "${anecdote.content}"`, 5))
                    })
                )}
            </div>
        )
    } else {
        return (
            <div>
                {sortedAnecdotes.filter(anecdote => anecdote.content.toLowerCase().includes(filter.toLowerCase())).map(anecdote => 
                    Anecdote(anecdote, async () => {
                        dispatch(vote(anecdote.id, anecdote))
                        dispatch(setNotification(`you voted "${anecdote.content}"`, 5))
                    })
                )}
            </div>
        )
    }
}

export default AnecdoteList