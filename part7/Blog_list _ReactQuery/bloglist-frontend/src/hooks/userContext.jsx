import { createContext, useReducer, useContext } from 'react'

const userReducer = (state = null, action) => {
  switch (action.type) {
    case 'SET':
      return action.payload
    case 'CLEAR':
      return null
    default:
      return state
  }
}

const UserContext = createContext()

export const useUserValue = () => {
    const userAndDispatch = useContext(UserContext)
    return userAndDispatch.user
}

export const useUserDispatch = () => {
    const userAndDispatch = useContext(UserContext)
    return userAndDispatch.userDispatch
}

export const UserProvider = (props) => {
  const [user, userDispatch] = useReducer(userReducer, null)

  return (
    <UserContext.Provider value={{ user, userDispatch }}>
      {props.children}
    </UserContext.Provider>
  )
}

export default UserContext
