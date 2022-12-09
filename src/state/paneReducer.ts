import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { ArrowEnd } from "../app/schema"

export type Pane = {
    id: string,
    addingArrowFrom: ArrowEnd | undefined,
    libraryOpen?: boolean
}

export type PanesState = Pane[]

const initialState: PanesState = [
    // { id: "e318638c98b3b958eae4590d", addingArrowFrom: undefined },
    { id: "d7a4be7d9d9d2733513a24f9", addingArrowFrom: undefined, libraryOpen: true },
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
        setAddingArrowFrom: (state, action: PayloadAction<{ mapId: string, addingArrowFrom: ArrowEnd | undefined }>) => {
            return state.map(pane => pane.id === action.payload.mapId ?
                { ...pane, addingArrowFrom: action.payload.addingArrowFrom }
                : pane)
        },
        toggleLibrary: (state, action: PayloadAction<string>) => {
            return state.map(pane => pane.id === action.payload ?
                { ...pane, libraryOpen: !pane.libraryOpen }
                : pane)
        }
    }
})

export const { openPane, closePane, setAddingArrowFrom, toggleLibrary } = paneSlice.actions

export default paneSlice.reducer