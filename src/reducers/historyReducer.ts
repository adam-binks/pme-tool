import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { Command } from "../etc/firestoreHistory"

interface HistorySliceState {
    [mapId: string]: {
        undo: Command[][],
        redo: Command[][],
    }
}
const initialState: HistorySliceState = {}

export const historySlice = createSlice({
    name: 'history',
    initialState: initialState,
    reducers: {
        addToUndoAndClearRedo: (state, action: PayloadAction<{mapId: string, commands: Command[]}>) => {
            if (!state[action.payload.mapId]) {
                state[action.payload.mapId] = {
                    undo: [],
                    redo: [],
                }
            }

            state[action.payload.mapId].undo.push(action.payload.commands)
            state[action.payload.mapId].redo = []
        },

        undo: (state, action: PayloadAction<string>) => {
            const history = state[action.payload]
            if (history) {
                const undoCommands = history.undo.pop()
                if (undoCommands) {
                    // can't call directly in reducer, so call from setTimeout
                    const opposites = undoCommands.map(command => command.opposite)
                    setTimeout(() => opposites.forEach(opposite => opposite()))

                    history.redo.push(undoCommands)
                }
            }
        },

        redo: (state, action: PayloadAction<string>) => {
            const history = state[action.payload]
            if (history) {
                const redoCommands = history.redo.pop()
                if (redoCommands) {
                    // can't call directly in reducer, so call from setTimeout
                    const acts = redoCommands.map(command => command.act)
                    setTimeout(() => acts.forEach(act => act()))

                    history.undo.push(redoCommands)
                }
            }
        },
    }
})

export const { addToUndoAndClearRedo, undo, redo } = historySlice.actions

export default historySlice.reducer