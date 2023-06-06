import { nanoid } from "nanoid"
import { fs } from "../state/mapFunctions"

export function logAction(firestore: fs, firestoreAction: "set" | "update" | "delete", path: string, param?: any) {
    // if (localStorage.getItem("SKIP_LOGGING")) {
    //     console.log("skipping logging")
    //     return
    // }
    // console.log({firestoreAction, path, param})
    // const localMachineId = getLocalMachineId()
    // firestore.set({ collection: 'actionLog', doc: nanoid() }, { firestoreAction, path, param, localMachineId, timestamp: new Date() })
}

function getLocalMachineId() {
    const stored = localStorage.getItem("user")
    if (stored) {
        return stored
    } else {
        const uid = nanoid()
        localStorage.setItem("user", uid)
        return uid
    }
}

export function executeAndLogAction(firestore: fs, firestoreAction: "set" | "update" | "delete", path: string, param?: any) {
    logAction(firestore, firestoreAction, path, param)
    switch (firestoreAction) {
        case "set":
            return firestore.set(path, param)
        case "update":
            return firestore.update(path, param)
        case "delete":
            return firestore.delete(path)
    }
}

function replayAction(firestore: fs, replaySession: string, action: { firestoreAction: "set" | "update" | "delete", path: string, param?: any }) {
    console.log(action.path)
    const [firstPart, ...rest] = action.path.split("/")
    const newPath = firstPart + "_replay" + "/" + rest.join("/")
    switch (action.firestoreAction) {
        case "set":
            return firestore.set(newPath, action.param)
        case "update":
            return firestore.update(newPath, action.param)
        case "delete":
            return firestore.delete(newPath)
    }
}

export async function getActionsAndReplay(firestore: fs, mapId: string, localMachineId: string, start: Date, end: Date) {
    localStorage.setItem("SKIP_LOGGING", "true")

    console.log("waiting to start replay")
    await new Promise(resolve => setTimeout(resolve, 1000))
    console.log("waiting over")
    
    const replaySession = nanoid()
    console.log(`Starting replay session ${replaySession}`)
    localStorage.setItem("replaySession", replaySession)

    const snapshot = await firestore.get({ collection: 'actionLog', where: [['timestamp', '>=', start], ['timestamp', '<=', end], ['localMachineId', '==', localMachineId]] })
    const data = snapshot as any
    console.log({data})
    data.forEach((doc: any) => {
        const action = doc.data()
        console.log({action}    )
        replayAction(firestore, replaySession, action)
    })

    localStorage.removeItem("SKIP_LOGGING")
    localStorage.removeItem("replaySession")
}

export function getReplaySuffix() {
    const replaySession = localStorage.getItem("replaySession")
    if (replaySession) {
        console.log("replay suffix")
        return `_replay`
    } else {
        return ""
    }
}