import { ExtendedFirestoreInstance } from "react-redux-firebase"
import { useAppSelector } from "../app/hooks"
import { AbstractProperty, Arrow, Class, Element, elementType, Map, Node, Property } from "../app/schema"
import { add, CommandDebounce, deleteDoc, enact, enactAll, update } from "../etc/firestoreHistory"
import { generateId } from "../etc/helpers"
import { useMapId } from "../map/Map"
import { globalProperties, textUntitled } from "../map/properties/globalProperties"
import { useElementId } from "../map/properties/useElementId"

type fs = ExtendedFirestoreInstance

export function createMap(firestore: fs) {
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

export function renameMap(firestore: fs, dispatch: any, mapId: string, currentName: string, newName: string) {
    enact(dispatch, mapId, update(firestore, `maps/${mapId}`, { name: currentName }, { name: newName }))
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

export function addNode(firestore: fs, dispatch: any, mapId: string, node: Node) {
    enact(dispatch, mapId, add(firestore, `maps/${mapId}/nodes/${node.id}`, node))
}

export function updateNode(firestore: fs, dispatch: any, mapId: string, nodeId: string, current: Partial<Node>, changes: Partial<Node>) {
    enact(dispatch, mapId, update(firestore, `maps/${mapId}/nodes/${nodeId}`, current, changes))
}

export function deleteNode(firestore: fs, dispatch: any, mapId: string, node: Node, arrows: Arrow[]) {
    enactAll(dispatch, mapId, [
        deleteDoc(firestore, `maps/${mapId}/nodes/${node.id}`, node),
        ...arrows.filter(arrow => arrow.source === node.id || arrow.dest === node.id)
            .map(arrow => deleteArrowCommand(firestore, mapId, arrow))
    ])
}

// NB: this is bad for multiplayer
// if two users change diff properties on the same node simultaneously, one might overwrite the others' changes
// I might fix this later (by moving to subcollections), but for now this is worth the save in dev time
// this function is redundant with updateNode but we use it to make that refactoring easier
export function updateNodeProperties(firestore: fs, dispatch: any, mapId: string, nodeId: string,
    currentProperties: Property[], newProperties: Property[], debounce?: CommandDebounce) {
    enact(dispatch, mapId, update(firestore,
        `maps/${mapId}/nodes/${nodeId}`,
        { properties: currentProperties },
        { properties: newProperties }
    ), debounce)
}

export function updateElementProperties(firestore: fs, dispatch: any, mapId: string, elementId: string,
    elementType: elementType, currentProperties: Property[], newProperties: Property[]) {
    enact(dispatch, mapId, update(firestore,
        `maps/${mapId}/${elementType}s/${elementId}`,
        { properties: currentProperties },
        { properties: newProperties }
    ))
}

export function updateSchema(firestore: fs, dispatch: any, mapId: string, pathFromSchemaRoot: string, current: unknown, value: unknown) {
    enact(dispatch, mapId, update(firestore, `maps/${mapId}`, { [`schema.${pathFromSchemaRoot}`]: current }, { [`schema.${pathFromSchemaRoot}`]: value }))
}

export function updateAbstractProperties(firestore: fs, dispatch: any, mapId: string, currrentAbstractProperties: AbstractProperty[], newAbstractProperties: AbstractProperty[]) {
    updateSchema(firestore, dispatch, mapId, "properties", currrentAbstractProperties, newAbstractProperties)
}

export function updateAbstractProperty(firestore: fs, dispatch: any, mapId: string, abstractProperties: AbstractProperty[], id: string, changes: Partial<AbstractProperty>) {
    updateSchema(firestore, dispatch, mapId, "properties", abstractProperties, abstractProperties.map(
        (prop) => prop.id === id ?
            { ...prop, ...changes }
            : prop
    ))
}

export function updateClass(firestore: fs, dispatch: any, mapId: string, classes: Class[], id: string, changes: Partial<Class>) {
    updateSchema(firestore, dispatch, mapId, "classes", classes, classes.map(
        (cls) => cls.id === id ?
            { ...cls, ...changes }
            : cls
    ))
}

export function addArrow(firestore: fs, dispatch: any, mapId: string, arrow: Arrow) {
    enact(dispatch, mapId, add(firestore, `maps/${mapId}/arrows/${arrow.id}`, arrow))
}

export function updateArrow(firestore: fs, dispatch: any, mapId: string, arrowId: string, current: Partial<Arrow>, changes: Partial<Arrow>) {
    enact(dispatch, mapId, update(firestore, `maps/${mapId}/arrows/${arrowId}`, current, changes))
}

export function deleteArrowCommand(firestore: fs, mapId: string, arrow: Arrow) {
    return deleteDoc(firestore, `maps/${mapId}/arrows/${arrow.id}`, arrow)
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