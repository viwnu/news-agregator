import { createSlice } from '@reduxjs/toolkit'
// import type { PayloadAction } from '@reduxjs/toolkit'

type Article = {
    url: string;
    source: string;
    title:string;
}

const initialState: Article[] = []

export const newsSlice = createSlice({
  name: 'counter',
  initialState,
  reducers: {
    
  },
})

// Action creators are generated for each case reducer function
export const {  } = newsSlice.actions

export default newsSlice.reducer