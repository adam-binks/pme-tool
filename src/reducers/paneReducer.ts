import { createReducer, createSlice, PayloadAction } from "@reduxjs/toolkit"

export type Pane = { id: string }
export type PanesState = Pane[]

const initialState: PanesState = [{ id: "ZDb8e2RwfWLnoJtgn9VI" }]//, { id: "1a0db562763379afc7b4e6cc" }]

export const paneSlice = createSlice({
    name: 'panes',
    initialState: initialState,
    reducers: {
        openPane: (state, action: PayloadAction<Pane>) => {
            state.push(action.payload)
        }
    }
})

export const { openPane } = paneSlice.actions

export default paneSlice.reducer