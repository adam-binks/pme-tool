import { createReducer, createSlice, PayloadAction } from "@reduxjs/toolkit"

export type Pane = { id: string }
export type PanesState = Pane[]

const initialState: PanesState = [
    { id: "0dacc12a159551af625cb467" },
    // { id: "1747e2874c3914a0f269734d" },
    // { id: '6a3b3ea554b9c433a4f98c0b' }
]

export const paneSlice = createSlice({
    name: 'panes',
    initialState: initialState,
    reducers: {
        openPane: (state, action: PayloadAction<Pane>) => {
            state.push(action.payload)
        },
        closePane: (state, action: PayloadAction<number>) => {
            state.splice(action.payload, 1) // remove element at index
        },
    }
})

export const { openPane, closePane } = paneSlice.actions

export default paneSlice.reducer