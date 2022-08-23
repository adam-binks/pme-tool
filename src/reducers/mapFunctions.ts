import { ExtendedFirestoreInstance } from "react-redux-firebase";
import { AbstractProperty, Arrow, Map, Node, Property, Schema } from "../app/schema";
import { generateId } from "../etc/helpers";

export function createMap(firestore: ExtendedFirestoreInstance) {
    const id = generateId()
    const newMap: Map = {
        id: id,
        name: "New map",
        createdAt: new Date(),
        nodes: [],
        arrows: [],
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

export function getBlankNode(x: number, y: number): Node {
    const id = generateId()
    return {
        id,
        name: "New node",
        properties: [],
        x,
        y,
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

export function updateSchema(firestore: ExtendedFirestoreInstance, mapId: string, changes: Partial<Schema>) {
    firestore.update(`maps/${mapId}`, {schema: changes})
}

export function updateAbstractProperty(firestore: ExtendedFirestoreInstance, mapId: string, abstractProperties: AbstractProperty[], id: string, changes: Partial<AbstractProperty>) {
    updateSchema(firestore, mapId, {
        properties: abstractProperties.map(
            (prop) => prop.id === id ?
                { ...prop, ...changes }
                : prop
        )
    });
}

export function addArrow(firestore: ExtendedFirestoreInstance, mapId: string, arrow: Arrow) {
    firestore.set(`maps/${mapId}/arrows/${arrow.id}`, arrow)
}

export function updateArrow(firestore: ExtendedFirestoreInstance, mapId: string, arrowId: string, changes: Partial<Arrow>) {
    firestore.set(`maps/${mapId}/arrows/${arrowId}`, changes)
}

export function deleteArrow(firestore: ExtendedFirestoreInstance, mapId: string, arrowId: string) {
    firestore.delete(`maps/${mapId}/arrows/${arrowId}`)
}