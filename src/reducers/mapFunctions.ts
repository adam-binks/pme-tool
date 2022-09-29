import { ExtendedFirestoreInstance } from "react-redux-firebase"
import { AbstractProperty, Arrow, Class, defaultPropertyValueByType, Element, elementType, getElementType, Map, Node, Property, PropertyType, Schema } from "../app/schema"
import { add, CommandDebounce, deleteDoc, enact, enactAll, update } from "../etc/firestoreHistory"
import { generateId } from "../etc/helpers"
import { globalProperties, textUntitled } from "../map/properties/globalProperties"

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

export function deleteNode(firestore: fs, dispatch: any, mapId: string, node: Node, arrows: { [key: string]: Arrow }) {
    const arrowsList = Object.values(arrows ? arrows : {})
    enactAll(dispatch, mapId, [
        deleteDoc(firestore, `maps/${mapId}/nodes/${node.id}`, node),
        ...arrowsList.filter(arrow => arrow && (arrow.source === node.id || arrow.dest === node.id))
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

export function updateElementPropertiesCommand(firestore: fs, mapId: string, elementId: string,
    elementType: elementType, currentProperties: Property[], newProperties: Property[]) {
    return update(firestore,
        `maps/${mapId}/${elementType}s/${elementId}`,
        { properties: currentProperties },
        { properties: newProperties }
    )
}

export function updateElementProperties(firestore: fs, dispatch: any, mapId: string, elementId: string,
    elementType: elementType, currentProperties: Property[], newProperties: Property[]) {
    enact(dispatch, mapId, updateElementPropertiesCommand(firestore, mapId, elementId,
        elementType, currentProperties, newProperties))
}

export function updateSchemaCommand(firestore: fs, mapId: string, pathFromSchemaRoot: string, current: unknown, value: unknown) {
    return update(firestore, `maps/${mapId}`, { [`schema.${pathFromSchemaRoot}`]: current }, { [`schema.${pathFromSchemaRoot}`]: value })
}

export function updateSchema(firestore: fs, dispatch: any, mapId: string, pathFromSchemaRoot: string, current: unknown, value: unknown) {
    enact(dispatch, mapId, updateSchemaCommand(firestore, mapId, pathFromSchemaRoot, current, value))
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

export function updateClassCommand(firestore: fs, mapId: string, classes: Class[], id: string, changes: Partial<Class>) {
    return updateSchemaCommand(firestore, mapId, "classes", classes, classes.map(
        (cls) => cls.id === id ?
            { ...cls, ...changes }
            : cls
    ))
}

export function updateClass(firestore: fs, dispatch: any, mapId: string, classes: Class[], id: string, changes: Partial<Class>) {
    enact(dispatch, mapId, updateClassCommand(firestore, mapId, classes, id, changes))
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

export function addPropertyToClassCommands(firestore: fs, mapId: string, property: AbstractProperty, classes: Class[], theClass: Class,
    elementsOfClass: Element[]) {
    const classCommand = updateClassCommand(firestore, mapId, classes, theClass.id, {
        propertyIds: [...theClass.propertyIds, property.id],
    })
    const addPropertyCommands = elementsOfClass
        .filter(element => !element.properties.some(prop => prop.abstractPropertyId === property.id))
        .map(element => addPropertyToElementCommand(firestore, mapId, element, property))

    return [classCommand, ...addPropertyCommands]
}

export function createAbstractPropertyCommand(firestore: fs, mapId: string, schema: Schema, newProperty: AbstractProperty) {
    return updateSchemaCommand(firestore, mapId, "properties", schema?.properties ? schema.properties : [],
        [...(schema?.properties ? schema.properties : []), newProperty]
    )
}

export function createNewPropertyAndAddToElementCommands(firestore: fs, mapId: string, schema: Schema, name: string, type: PropertyType,
    element: Element) {
    const abstractProperty = {
        id: generateId(),
        name,
        type
    }
    return [
        createAbstractPropertyCommand(firestore, mapId, schema, abstractProperty),
        addPropertyToElementCommand(firestore, mapId, element, abstractProperty)
    ]
}

export function addPropertyToElementCommand(firestore: fs, mapId: string, element: Element, abstractProperty: AbstractProperty) {
    const newProperty: Property = {
        id: generateId(),
        abstractPropertyId: abstractProperty.id,
        value: defaultPropertyValueByType[abstractProperty.type]
    }

    return updateElementPropertiesCommand(firestore, mapId, element.id, getElementType(element), element.properties,
        // make the title the first property
        abstractProperty.type === "title" ? [newProperty, ...element.properties]
            : [...element.properties, newProperty]
    )
}