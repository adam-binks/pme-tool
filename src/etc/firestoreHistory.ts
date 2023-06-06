import { ExtendedFirestoreInstance } from "react-redux-firebase";
import { addToUndoAndClearRedo } from "../state/historyReducer";
import { logAction } from "./actionLogging";

export interface Command {
    act: () => {}
    opposite: () => {} | void
    debounce?: CommandDebounce
}
export interface CommandDebounce {
    target: string
    intervalMs: number
    timestamp: Date
}

export function enact(dispatch: any, mapId: string, command: Command, debounce?: CommandDebounce) {
    if (debounce) {
        command.debounce = debounce
    }
    enactAll(dispatch, mapId, [command])
}

export function enactAll(dispatch: any, mapId: string, commands: Command[]) {
    if (commands && commands.length === 0) return

    if (commands === undefined || commands[0] === undefined) {
        console.error("Error: can't enact undefined commands: ", commands)
        return
    }

    dispatch(addToUndoAndClearRedo({ mapId, commands }))
    commands.forEach(command => command.act())
}

type fs = ExtendedFirestoreInstance

export function set(firestore: fs, path: string, current: any, changes: any): Command {
    return {
        act: () => {
            logAction(firestore, "set", path, changes)
            return firestore.set(path, changes)
        },
        opposite: () => {
            logAction(firestore, "set", path, current)
            return firestore.set(path, current)
        },
    }
}

export function add(firestore: fs, pathWithId: string, newItem: any): Command {
    return {
        act: () => {
            logAction(firestore, "set", pathWithId, newItem)
            return firestore.set(pathWithId, newItem)
        },
        opposite: () => {
            logAction(firestore, "delete", pathWithId)
            return firestore.delete(pathWithId)
        },
    }
}

export function deleteDoc(firestore: fs, pathWithId: string, itemToDelete: any): Command {
    return {
        act: () => {
            logAction(firestore, "delete", pathWithId)
            return firestore.delete(pathWithId)
        },
        opposite: () => {
            logAction(firestore, "set", pathWithId, itemToDelete)
            return firestore.set(pathWithId, itemToDelete)
        },
    }
}

export function update(firestore: fs, path: string, current: any, changes: any): Command {
    return {
        act: () => {
            logAction(firestore, "update", path, changes)
            return firestore.update(path, changes)
        },
        opposite: () => {
            logAction(firestore, "update", path, current)
            return firestore.update(path, current)
        },
    }
}