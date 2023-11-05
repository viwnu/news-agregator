import { TypedUseSelectorHook, useSelector } from 'react-redux'
// import type { RootState, AppDispatch } from './store'
import type { RootState } from '../store/rootReducer'

// Use throughout your app instead of plain `useDispatch` and `useSelector`
// type DispatchFunc = () => AppDispatch
// export const useAppDispatch: DispatchFunc = useDispatch
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector