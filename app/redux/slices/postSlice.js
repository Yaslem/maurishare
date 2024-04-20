import {createSlice} from '@reduxjs/toolkit';

export const postSlice = createSlice({
    name: 'post',
    initialState: {
        title: "",
        action: "create",
        img: "",
        content: "",
        des: "",
        tags: [],

    },
    reducers: {
        setTitle: (state, action) => {
            state.title = action.payload;
        },
        setAction: (state, action) => {
            state.action = action.payload;
        },
        setImg: (state, action) => {
            state.img = action.payload;
        },
        setContent: (state, action) => {
            state.content = action.payload;
        },
        setDes: (state, action) => {
            state.des = action.payload;
        },
        setTags: (state, action) => {
            state.tags = action.payload;
        },
    },
})

export const postActions = postSlice.actions

export default postSlice.reducer