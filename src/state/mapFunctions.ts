import { ExtendedFirestoreInstance } from "react-redux-firebase"
import { Arrow, Class, Element, elementType, getElementType, Map, Node } from "../app/schema"
import { add, Command, deleteDoc, enact, enactAll, update } from "../etc/firestoreHistory"
import { generateId } from "../etc/helpers"
import { getProperties, Property } from "../map/editor/exposeProperties"
import { parser } from "../map/editor/parser"
import { DEFAULT_NODE_WIDTH } from "../map/node/Node"

export type fs = ExtendedFirestoreInstance

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

export function getBlankNodeOfClass(theClass: Class): Element {
    const schemaProperties = getPropertiesFromContent(theClass.content)
    const content = addSchemaPropertiesNotAlreadyInContent("", schemaProperties, [])
    return {
        id: generateId(),
        content: content,
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
        ...arrowsList.filter(arrow => arrow && arrowTouchesElement(arrow, node))
            .map(arrow => deleteArrowCommand(firestore, mapId, arrow))
    ])
}

export function arrowTouchesElement(arrow: Arrow, element: Element) {
    const elementType = getElementType(element)
    return (arrow.source.elementType === elementType && arrow.source.elementId === element.id)
        || (arrow.dest.elementType === elementType && arrow.dest.elementId === element.id)
}

export function updateSchemaCommand(firestore: fs, mapId: string, pathFromSchemaRoot: string, current: unknown, value: unknown) {
    return update(firestore, `maps/${mapId}`, { [`schema.${pathFromSchemaRoot}`]: current }, { [`schema.${pathFromSchemaRoot}`]: value })
}

export function updateSchema(firestore: fs, dispatch: any, mapId: string, pathFromSchemaRoot: string, current: unknown, value: unknown) {
    enact(dispatch, mapId, updateSchemaCommand(firestore, mapId, pathFromSchemaRoot, current, value))
}

export function createClassCommand(firestore: fs, mapId: string, newClass: Class, classes: Class[]) {
    return updateSchemaCommand(firestore, mapId, "classes", classes, [...classes, newClass])
}

export function deleteClassCommands(firestore: fs, mapId: string, theClass: Class, classes: Class[], elementsOfClass: Element[]) {
    console.log(elementsOfClass)
    return [
        ...elementsOfClass.map(element => addClassToElementCommand(firestore, mapId, element, theClass, undefined)),
        updateSchemaCommand(firestore, mapId, "classes", classes, classes.filter(c => c.id !== theClass.id)),
    ]
}

export function addClassToElementCommand(firestore: fs, mapId: string, element: Element, oldClass: Class | undefined, newClass: Class | undefined) {
    const currentProperties = getPropertiesFromContent(element.content)
    const newClassProperties = newClass ? getPropertiesFromContent(newClass.content) : []
    const oldClassProperties = oldClass ? getPropertiesFromContent(oldClass.content) : []

    let content = element.content
    content = removeValuelessOldPropertiesNotInSchemaProperties(oldClassProperties, newClassProperties, currentProperties, content)
    content = addSchemaPropertiesNotAlreadyInContent(content, newClassProperties, currentProperties)

    return updateElementCommand(firestore, mapId, element.id, getElementType(element),
        { classId: element.classId, content: element.content },
        { classId: newClass ? newClass.id : null, content }
    )
}

export function createNewClassAndAddToElementCommands(firestore: fs, mapId: string, element: Element, elementType: elementType,
    className: string, classes: Class[]) {
    const newClass: Class = {
        id: generateId(),
        name: className,
        element: elementType,
        content: "",
    }
    return [
        createClassCommand(firestore, mapId, newClass, classes),
        updateElementCommand(firestore, mapId, element.id, elementType,
            { classId: element.classId },
            { classId: newClass.id }
        )
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
            const propString = ((insertAtEnd && content.trim() !== "") ? "\n" : "")
                + blankPropertyString(newProp)
                + (!insertAtEnd ? "\n" : "")
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