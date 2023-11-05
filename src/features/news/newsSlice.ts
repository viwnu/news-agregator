import {
    createSlice,
    createAsyncThunk,
    createEntityAdapter,
} from '@reduxjs/toolkit'

import newsAPI, { Article } from './newsAPI'
import { Agregation } from '../../app/types/redux'
import { RootState } from '../../app/store/rootReducer'
   
export const fetchNews = createAsyncThunk('news/fetchAll', async (agregation: Agregation) => {
  const response = await newsAPI.fetchAll(agregation)
  return response
})
  
export const newsAdapter = createEntityAdapter<Article>()
  
const initialState = newsAdapter.getInitialState({ entities: [], loading: false, rejected: false})
  
export const slice = createSlice({
  name: 'news',
  initialState,
    reducers: {},
    extraReducers: builder => {
    builder
      .addCase(fetchNews.pending, (state) => {
        state.loading = true
        state.rejected = false
      })
      .addCase(fetchNews.fulfilled, (state, action) => {
        const articles = action.payload
        console.log('in createSlice articles: ', articles)
        newsAdapter.setAll(state, articles)
        state.loading = false
        state.rejected = false
      })
      .addCase(fetchNews.rejected, (state, action) => {
        const err = action
        console.log('create slice error: ', err)
        state.loading = false
        state.rejected = true
        
      })
  }
})
  
const reducer = slice.reducer
export default reducer
  
export const {
  selectEntities: selectNewsEntities,
  selectAll: selectAllNews,
  selectTotal: selectTotalNews
} = newsAdapter.getSelectors((state: RootState) => state.news)
  