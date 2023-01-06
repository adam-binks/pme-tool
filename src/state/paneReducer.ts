import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { ArrowEnd } from "../app/schema"

export type Pane = {
    id: string,
    addingArrowFrom: ArrowEnd | undefined,
    libraryOpen?: boolean
}

export type PanesState = Pane[]

export const defaultPane = {
    addingArrowFrom: undefined,
    libraryOpen: true,
}

const initialState: PanesState = [
    // { id: "d7a4be7d9d9d2733513a24f9", addingArrowFrom: undefined, libraryOpen: true },
]

export const paneSlice = createSlice({
    name: 'panes',
    initialState: initialState,
    reducers: {
        openPane: (state, action: PayloadAction<Pane>) => {
            console.log("openPane", action.payload)
            state.push(action.payload)
        },
        closePane: (state, action: PayloadAction<number>) => {
            state.splice(action.payload, 1) // remove element at index
        },
        setPanes: (state, action: PayloadAction<PanesState>) => {
            return action.payload
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

export const { openPane, closePane, setAddingArrowFrom, toggleLibrary, setPanes } = paneSlice.actions

export default paneSlice.reducer