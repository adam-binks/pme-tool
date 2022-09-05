import { createReducer, createSlice, PayloadAction } from "@reduxjs/toolkit"

export type Pane = { id: string, addingArrowFrom: string | undefined }
export type PanesState = Pane[]

const initialState: PanesState = [
    // { id: "e318638c98b3b958eae4590d", addingArrowFrom: undefined },
    { id: "43f0946773c49be3a9081fcb", addingArrowFrom: undefined },
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
        setAddingArrowFrom: (state, action: PayloadAction<{ mapId: string, addingArrowFrom: string | undefined }>) => {
            return state.map(pane => pane.id === action.payload.mapId ?
                { ...pane, addingArrowFrom: action.payload.addingArrowFrom }
                : pane)
        },
    }
})

export const { openPane, closePane, setAddingArrowFrom } = paneSlice.actions

export default paneSlice.reducer