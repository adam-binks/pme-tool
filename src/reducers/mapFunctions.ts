import { ExtendedFirestoreInstance } from "react-redux-firebase";
import { Map, Node } from "../app/schema";
import { generateId } from "../etc/helpers";

export function createMap(firestore: ExtendedFirestoreInstance) {
    const id = generateId()
    const newMap: Map = {
        id: id,
        name: "New map",
        createdAt: new Date(),
        nodes: [],
        schema: {
            id: generateId(),
            properties: [],
        },
    }
    firestore.set({collection: 'maps', doc: id}, newMap)
    return id
}

export function renameMap(firestore: ExtendedFirestoreInstance, mapId: string, newName: string) {
    firestore.update(`maps/${mapId}`, { name: newName })
}

export function getBlankNode(): Node {
    const id = generateId()
    return {
        id,
        name: "New node",
        properties: [],
        x: 0,
        y: 0,
    }
}

export function addNode(firestore: ExtendedFirestoreInstance, mapId: string, node: Node) {
    firestore.set(`maps/${mapId}/nodes/${node.id}`, node)
    console.log('add node')
}