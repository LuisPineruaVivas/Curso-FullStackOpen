import { createSlice } from '@reduxjs/toolkit'


const notificationSlice = createSlice({
    name: 'notification',
    initialState: '',
    reducers: {
        appendNotification(state, action) {
            return action.payload
        },
        clearNotification() {
            return ''
        }
    }
})

export const { appendNotification, clearNotification } = notificationSlice.actions

export const setNotification = (content, time) => {
    return async dispatch => {
        dispatch(appendNotification(content))
        setTimeout(() => {
            dispatch(clearNotification())
        }, time*1000)
    }
}

export default notificationSlice.reducer