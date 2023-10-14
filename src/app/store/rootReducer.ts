import { combineReducers } from '@reduxjs/toolkit'


import { rootAPISlice } from './api'

export const rootReducer = combineReducers({
  [rootAPISlice.reducerPath]: rootAPISlice.reducer
})