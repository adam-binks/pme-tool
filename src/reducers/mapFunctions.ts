import { ExtendedFirestoreInstance } from "react-redux-firebase";
import { useAppSelector } from "../app/hooks";
import { AbstractProperty, Arrow, Class, Element, elementType, Map, Node, Property } from "../app/schema";
import { generateId } from "../etc/helpers";
import { useMapId } from "../map/Map";
import { globalProperties, textUntitled } from "../map/properties/globalProperties";
import { useElementId } from "../map/properties/useElementId";

export function createMap(firestore: ExtendedFirestoreInstance) {
    const id = generateId()
    const newMap: Map = {
        id: id,
        name: "New map",
        createdAt: new Date(),
        schema: {
            id: generateId(),
            properties: [...globalProperties],
            classes: [],
        },
    }
    firestore.set({ collection: 'maps', doc: id }, newMap)
    return id
}

export function renameMap(firestore: ExtendedFirestoreInstance, mapId: string, newName: string) {
    firestore.update(`maps/${mapId}`, { name: newName })
}

export function getBlankNode(x: number, y: number): Node {
    const id = generateId()
    return {
        id,
        properties: [{
            id: generateId(),
            abstractPropertyId: textUntitled,
            value: "",
        }],
        x,
        y,
        classId: null,
    }
}

export function addNode(firestore: ExtendedFirestoreInstance, mapId: string, node: Node) {
    firestore.set(`maps/${mapId}/nodes/${node.id}`, node)
}

export function updateNode(firestore: ExtendedFirestoreInstance, mapId: string, nodeId: string, changes: Partial<Node>) {
    firestore.update(`maps/${mapId}/nodes/${nodeId}`, changes)
}

export function deleteNode(firestore: ExtendedFirestoreInstance, mapId: string, nodeId: string, arrows: Arrow[]) {
    firestore.delete(`maps/${mapId}/nodes/${nodeId}`)
    arrows.forEach(arrow => {
        if (arrow.source === nodeId || arrow.dest === nodeId) {
            deleteArrow(firestore, mapId, arrow.id)
        }
    })
}

export function addNodeProperty(firestore: ExtendedFirestoreInstance, mapId: string, nodeId: string, property: Property) {
    firestore.update(`maps/${mapId}/nodes/${nodeId}`, firestore.FieldValue.arrayUnion(property))
}

// NB: this is bad for multiplayer
// if two users change diff properties on the same node simultaneously, one might overwrite the others' changes
// I might fix this later (by moving to subcollections), but for now this is worth the save in dev time
// this function is redundant with updateNode but we use it to make that refactoring easier
export function updateNodeProperties(firestore: ExtendedFirestoreInstance, mapId: string, nodeId: string, properties: Property[]) {
    firestore.update(`maps/${mapId}/nodes/${nodeId}`, { properties })
}

export function updateElementProperties(firestore: ExtendedFirestoreInstance, mapId: string, elementId: string,
    elementType: elementType, properties: Property[]) {
    firestore.update(`maps/${mapId}/${elementType}s/${elementId}`, { properties })
}

export function removeNodeProperty(firestore: ExtendedFirestoreInstance, mapId: string, nodeId: string, property: Property) {
    console.log(firestore.FieldValue.arrayRemove(property))
    firestore.update(`maps/${mapId}/nodes/${nodeId}`, firestore.FieldValue.arrayRemove([property]))
}

export function updateSchema(firestore: ExtendedFirestoreInstance, mapId: string, pathFromSchemaRoot: string, value: unknown) {
    firestore.update(`maps/${mapId}`, { [`schema.${pathFromSchemaRoot}`]: value })
}

export function updateAbstractProperties(firestore: ExtendedFirestoreInstance, mapId: string, newAbstractProperties: AbstractProperty[]) {
    updateSchema(firestore, mapId, "properties", newAbstractProperties)
}

export function updateAbstractProperty(firestore: ExtendedFirestoreInstance, mapId: string, abstractProperties: AbstractProperty[], id: string, changes: Partial<AbstractProperty>) {
    updateSchema(firestore, mapId, "properties", abstractProperties.map(
        (prop) => prop.id === id ?
            { ...prop, ...changes }
            : prop
    ))
}

export function updateClass(firestore: ExtendedFirestoreInstance, mapId: string, classes: Class[], id: string, changes: Partial<Class>) {
    updateSchema(firestore, mapId, "classes", classes.map(
        (cls) => cls.id === id ?
            { ...cls, ...changes }
            : cls
    ))
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

export function elementHasTitle(element: Element, properties: AbstractProperty[]) {
    const firstProp = element?.properties && element.properties[0]
    if (!firstProp) { return false }
    const abstractProp = properties.find(p => p.id === firstProp.abstractPropertyId)
    return abstractProp?.type === "title"
}

function useGetElement(elementId: string, elementType: elementType) {
    const mapId = useMapId()
    return useAppSelector(state => state.firestore?.data &&
        state.firestore.data[`${elementType}s.${mapId}`]
        && state.firestore.data[`${elementType}s.${mapId}`][elementId]) as Element | undefined
}

export function useElement() {
    const { elementId, elementType } = useElementId()
    return { element: useGetElement(elementId, elementType), elementType }
}

export function useAbstractProperties() {
    const mapId = useMapId()
    return useAppSelector(state => state.firestore?.data?.maps &&
        state.firestore?.data?.maps[mapId]?.schema?.properties)
}

export function getAbstractProperty(property: Property, abstractProperties: AbstractProperty[]) {
    return abstractProperties.find((abstractProp) => abstractProp.id === property.abstractPropertyId)
}