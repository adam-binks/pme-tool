import { ExtendedFirestoreInstance } from "react-redux-firebase";
import { addToUndoAndClearRedo } from "../state/historyReducer";

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
    dispatch(addToUndoAndClearRedo({ mapId, commands }))
    commands.forEach(command => command.act())
}

type fs = ExtendedFirestoreInstance

export function set(firestore: fs, path: string, current: any, changes: any): Command {
    return {
        act: () => firestore.set(path, changes),
        opposite: () => firestore.set(path, current),
    }
}

export function add(firestore: fs, pathWithId: string, newItem: any): Command {
    return {
        act: () => firestore.set(pathWithId, newItem),
        opposite: () => firestore.delete(pathWithId),
    }
}

export function deleteDoc(firestore: fs, pathWithId: string, itemToDelete: any): Command {
    return {
        act: () => firestore.delete(pathWithId),
        opposite: () => firestore.set(pathWithId, itemToDelete),
    }
}

export function update(firestore: fs, path: string, current: any, changes: any): Command {
    return {
        act: () => firestore.update(path, changes),
        opposite: () => firestore.update(path, current),
    }
}