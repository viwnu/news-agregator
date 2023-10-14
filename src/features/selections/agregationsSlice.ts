// Part 1
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

// Part 2

export type Agregation = {
    title: string;
    url: string;
    keywords: string[];
}

// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
export interface AgregationsState  {
    agregations: Agregation[];
}
const initialState: AgregationsState = {
    agregations: []
}

// Part 3
export const agregationsSlice = createSlice({
    name: 'agregations',
    initialState,
    reducers: {
        addAgregations: (state, action: PayloadAction<Agregation>) => {
            return {
                agregations: [...state.agregations, action.payload]
            }
        }
    }
})

// Part 4
export const { addAgregations } = agregationsSlice.actions
export default agregationsSlice.reducer
