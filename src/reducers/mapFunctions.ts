import { ExtendedFirestoreInstance } from "react-redux-firebase";
import { generateId } from "../etc/helpers";

export function createMap(firestore: ExtendedFirestoreInstance) {
    const id = generateId()
    firestore.set({collection: 'maps', doc: id}, {
        id: id,
        name: "New map",
        createdAt: new Date(),
    })
    return id
}

export function renameMap(firestore: ExtendedFirestoreInstance, mapId: string, newName: string) {
    firestore.update(`maps/${mapId}`, { name: newName })
}

export function addNode(firestore: ExtendedFirestoreInstance) {

}