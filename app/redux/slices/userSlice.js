import {createSlice} from '@reduxjs/toolkit';

export const userSlice = createSlice({
    name: 'user',
    initialState: {
        data: {},
    },
    reducers: {
        setUser: (state, action) => {
            state.data = action.payload;
        },
    },
})

export const userActions = userSlice.actions

export default userSlice.reducer