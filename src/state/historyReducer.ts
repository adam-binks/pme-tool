import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { Command } from "../etc/firestoreHistory"
import { last } from "../etc/helpers"

interface HistorySliceState {
    [mapId: string]: {
        undo: Command[][],
        redo: Command[][],
    }
}
const initialState: HistorySliceState = {}

function rollupDebouncedCommand(commands: Command[], prevCommands: Command[]) {
    const prev = prevCommands && prevCommands[0]
    const command = commands[0]
    if (command === undefined) {
        console.error("Undefined command")
    }

    if (command.debounce && prev?.debounce 
            && commands.length === 1 && prevCommands.length === 1
            && command.debounce.target === prev.debounce.target
            && command.debounce.timestamp.getTime() - prev.debounce.timestamp.getTime() < prev.debounce.intervalMs
    ) {
        // use the new command's action for redoing, but keep the old opposite so you can undo in one step
        prev.act = command.act
        return true
    } else {
        return false
    }
}

export const historySlice = createSlice({
    name: 'history',
    initialState: initialState,
    reducers: {
        addToUndoAndClearRedo: (state, action: PayloadAction<{ mapId: string, commands: Command[] }>) => {
            const { mapId, commands } = action.payload

            if (!state[mapId]) {
                state[mapId] = {
                    undo: [],
                    redo: [],
                }
            }

            const history = state[mapId]

            if (!rollupDebouncedCommand(commands, last(history.undo))) {
                history.undo.push(action.payload.commands)
            }

            history.redo = []
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