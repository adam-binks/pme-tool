import { ExtendedFirestoreInstance } from "react-redux-firebase"
import { AbstractProperty, Arrow, Class, Element, elementType, getElementType, Map, Node, Schema } from "../app/schema"
import { add, Command, deleteDoc, enact, enactAll, update } from "../etc/firestoreHistory"
import { generateId } from "../etc/helpers"
import { getProperties, Property } from "../map/editor/exposeProperties"
import { parser } from "../map/editor/parser"
import { DEFAULT_NODE_WIDTH } from "../map/node/Node"

type fs = ExtendedFirestoreInstance

export function createMap(firestore: fs) {
    const id = generateId()
    const newMap: Map = {
        id: id,
        name: "New map",
        createdAt: new Date(),
        schema: {
            id: generateId(),
            classes: [],
        },
    }
    firestore.set({ collection: 'maps', doc: id }, newMap)
    return id
}

export function renameMap(firestore: fs, dispatch: any, mapId: string, currentName: string, newName: string) {
    enact(dispatch, mapId, update(firestore, `maps/${mapId}`, { name: currentName }, { name: newName }))
}

export function getBlankNode(x: number = 0, y: number = 0): Node {
    const id = generateId()
    return {
        id,
        content: "",
        x,
        y,
        classId: null,
        width: DEFAULT_NODE_WIDTH,
    }
}

export function getBlankNodeOfClass(theClass: Class, abstractProperties: AbstractProperty[]): Element {
    return {
        id: generateId(),
        content: "",
        // properties: theClass.propertyIds.map(propId => {
        //     const prop = abstractProperties.find(p => p.id === propId)
        //     if (!prop) console.error(`Missing property with id ${propId}`)
        //     return {
        //         id: generateId(),
        //         abstractPropertyId: propId,
        //         type: prop ? prop.type : "text",
        //         value: prop ? defaultPropertyValueByType[prop.type] : undefined,
        //     }
        // }),
        classId: theClass.id,
        x: 0,
        y: 0,
        width: DEFAULT_NODE_WIDTH,
    }
}

export function addNode(firestore: fs, dispatch: any, mapId: string, node: Node) {
    enact(dispatch, mapId, add(firestore, `maps/${mapId}/nodes/${node.id}`, node))
}

export function updateNode(firestore: fs, dispatch: any, mapId: string, nodeId: string, current: Partial<Node>, changes: Partial<Node>) {
    enact(dispatch, mapId, update(firestore, `maps/${mapId}/nodes/${nodeId}`, current, changes))
}

export function updateElementCommand(firestore: fs, mapId: string, elementId: string, elementType: string, current: Partial<Element>, changes: Partial<Element>) {
    return update(firestore, `maps/${mapId}/${elementType}s/${elementId}`, current, changes)
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
// export function updateNodeProperties(firestore: fs, dispatch: any, mapId: string, nodeId: string,
//     currentProperties: Property[], newProperties: Property[], debounce?: CommandDebounce) {
//     enact(dispatch, mapId, update(firestore,
//         `maps/${mapId}/nodes/${nodeId}`,
//         { properties: currentProperties },
//         { properties: newProperties }
//     ), debounce)
// }

// export function updateElementPropertiesCommand(firestore: fs, mapId: string, elementId: string,
//     elementType: elementType, currentProperties: Property[], newProperties: Property[]) {
//     return update(firestore,
//         `maps/${mapId}/${elementType}s/${elementId}`,
//         { properties: currentProperties },
//         { properties: newProperties }
//     )
// }

// export function updateElementProperties(firestore: fs, dispatch: any, mapId: string, elementId: string,
//     elementType: elementType, currentProperties: Property[], newProperties: Property[]) {
//     enact(dispatch, mapId, updateElementPropertiesCommand(firestore, mapId, elementId,
//         elementType, currentProperties, newProperties))
// }

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

export function createClassCommand(firestore: fs, mapId: string, newClass: Class, classes: Class[]) {
    return updateSchemaCommand(firestore, mapId, "classes", classes, [...classes, newClass])
}

export function addClassToElementCommands(firestore: fs, mapId: string, element: Element, newClass: Class, abstractProperties: AbstractProperty[]) {
    return [updateElementCommand(firestore, mapId, element.id, getElementType(element),
        { classId: element.classId },
        { classId: newClass.id }
    )]

    // const commands = []
    // let updatedProperties = deepcopy(element.properties)

    // // for each property on newClass, either add a new property to the node, or update an existing property
    // newClass.propertyIds.forEach(propId => {
    //     if (updatedProperties.some(p => p.id === propId)) {
    //         // this will rarely happen - probably just titles and text_untitled
    //         return
    //     }
    //     const prop = abstractProperties.find(prop => prop.id === propId)
    //     if (!prop) {
    //         console.error(`Missing abstract property with id ${propId}`)
    //         return
    //     }

    //     const matchingProp = updatedProperties.find(p => {
    //         const instanceProp = abstractProperties.find(a => a.id === p.abstractPropertyId)
    //         return instanceProp?.name === prop?.name && instanceProp?.type === prop?.type
    //     })
    //     if (matchingProp) {
    //         matchingProp.abstractPropertyId = propId
    //     } else {
    //         updatedProperties = insertPropertyToProperties(updatedProperties, makeNewProperty(prop), prop)
    //     }
    // })

    // return commands
}

export function createNewClassAndAddToElementCommands(firestore: fs, mapId: string, element: Element, elementType: elementType,
    className: string, classes: Class[], abstractProperties: AbstractProperty[]) {
    const newClass: Class = {
        id: generateId(),
        name: className,
        element: elementType,
        content: "",
    }
    return [
        createClassCommand(firestore, mapId, newClass, classes),
        ...addClassToElementCommands(firestore, mapId, element, newClass, abstractProperties)
    ]
}

export function updateClassCommand(firestore: fs, mapId: string, classes: Class[], id: string, changes: Partial<Class>) {
    return updateSchemaCommand(firestore, mapId, "classes", classes, classes.map(
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

export function createAbstractPropertyCommand(firestore: fs, mapId: string, schema: Schema, newProperty: AbstractProperty) {
    return []
    // return updateSchemaCommand(firestore, mapId, "properties", schema?.properties ? schema.properties : [],
    //     [...(schema?.properties ? schema.properties : []), newProperty]
    // )
}

export function getSyntaxTree(content: string) {
    return parser.parse(content)
}

export function getPropertiesFromContent(content: string) {
    const tree = getSyntaxTree(content)
    return getProperties(tree, (from, to) => content.substring(from, to))
}

export function updateSchemaPropertiesCommands(firestore: fs, mapId: string, elementsOfClass: Element[],
    oldProperties: Property[], newProperties: Property[]) {
    const commands: Command[] = []
    elementsOfClass.forEach(element => {
        const properties = getPropertiesFromContent(element.content)
        let content = element.content
        content = removeValuelessOldPropertiesNotInSchemaProperties(oldProperties, newProperties, properties, content)
        content = addSchemaPropertiesNotAlreadyInContent(content, newProperties, properties)

        commands.push(updateElementCommand(firestore, mapId, element.id, getElementType(element),
            { content: element.content },
            { content }
        ))
    })

    return commands
}

function addSchemaPropertiesNotAlreadyInContent(content: string, schemaProperties: Property[], currentProperties: Property[]) {
    let lastStart = content.length
    // iterate backwards to insert properties right before the one after them
    for (let i = schemaProperties.length - 1; i >= 0; i--) {
        const newProp = schemaProperties[i]
        if (!currentProperties.some(prop => prop.name === newProp.name)) {
            const insertAtEnd = lastStart === content.length
            const propString = (insertAtEnd ? "\n" : "") + blankPropertyString(newProp) + (!insertAtEnd ? "\n" : "")
            content = content.slice(0, lastStart) + propString + content.slice(lastStart)
        }
        lastStart = content.indexOf(newProp.content)
    }
    return content
}

function removeValuelessOldPropertiesNotInSchemaProperties(oldSchemaProperties: Property[], newSchemaProperties: Property[], properties: Property[], content: string) {
    oldSchemaProperties.forEach(oldProp => {
        if (newSchemaProperties.some(p => p.name === oldProp.name)) {
            return
        }

        const prop = properties.find(p => p.name === oldProp.name)
        if (prop && (!prop.value || !prop.value.trim() || prop.value.trim() === " ")) {
            // first try and remove a leading newline, if it exists
            content = content.replace("\n" + prop.content, "")
            // then try and remove a trailing newline, if it exists
            content = content.replace(prop.content + "\n", "")
            // otherwise this is the only content, so just remove it
            content = content.replace(prop.content, "")
        }
    })
    return content
}

function blankPropertyString(property: Property) {
    return `=${property.name}= `
}