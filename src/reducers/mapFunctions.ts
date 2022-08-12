import { ExtendedFirestoreInstance } from "react-redux-firebase";
import { Map, Node, Property } from "../app/schema";
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
}

export function updateNode(firestore: ExtendedFirestoreInstance, mapId: string, nodeId: string, changes: Partial<Node>) {
    firestore.update(`maps/${mapId}/nodes/${nodeId}`, changes)
}

export function addNodeProperty(firestore: ExtendedFirestoreInstance, mapId: string, nodeId: string, property: Property) {
    firestore.update(`maps/${mapId}/nodes/${nodeId}`, firestore.FieldValue.arrayUnion(property))
}

// NB: this is bad for multiplayer
// if two users change diff properties on the same node simultaneously, one might overwrite the others' changes
// I might fix this later (by moving to subcollections), but for now this is worth the save in dev time
// this function is redundant with updateNode but we use it to make that refactoring easier
export function updateNodeProperties(firestore: ExtendedFirestoreInstance, mapId: string, nodeId: string, properties: Property[]) {
    firestore.update(`maps/${mapId}/nodes/${nodeId}`, {properties})
}

export function removeNodeProperty(firestore: ExtendedFirestoreInstance, mapId: string, nodeId: string, property: Property) {
    firestore.update(`maps/${mapId}/nodes/${nodeId}`, firestore.FieldValue.arrayRemove(property))
}