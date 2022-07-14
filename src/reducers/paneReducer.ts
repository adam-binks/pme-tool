import { createReducer, createSlice, PayloadAction } from "@reduxjs/toolkit"

export type Pane = { id: string }
export type PanesState = Pane[]

const initialState: PanesState = [{ id: "6715fc412f32e5438e18a691" }]//, { id: "1a0db562763379afc7b4e6cc" }]

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