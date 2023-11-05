import { combineReducers } from '@reduxjs/toolkit'


import { rootAPISlice } from './api'
import newsReducer from '../../features/news/newsSlice'

export const rootReducer = combineReducers({
  [rootAPISlice.reducerPath]: rootAPISlice.reducer,
  news: newsReducer
})

export type RootState = ReturnType<typeof rootReducer>;