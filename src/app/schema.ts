export interface FirebaseSchema {
    projects: Project[],
    maps: Map[],
    libraryClasses: Class[],
    librarySchemas: LibrarySchema[],
}

export interface Map {
    id: string
    name: string
    createdAt: Date
    schema: Schema
}

export interface Node {
    id: string
    classId: string | null
    content:  string
    width: number
    x: number
    y: number
}

export interface Arrow {
    id: string
    classId: string | null
    content: string
    width: number
    source: ArrowEnd
    dest: ArrowEnd
}

export interface ArrowEnd {
    elementType: elementType
    elementId: string
    property: ArrowEndProperty | null
    arrowHead: ArrowHead
}

export interface ArrowEndProperty {
    name: string
    index: number
}

export type ArrowHead = null | "arrow"

export type Element = Node | Arrow
export type elementType = "node" | "arrow"
export type elementTypeInclClass = elementType | "class"
export function getElementType(element: Element): elementType {
    if ((element as Node).x && (element as Node).y) {
        return "node"
    } else {
        return "arrow"
    }
}

export interface Schema {
    id: string
    classes: Class[]
}

export interface Class {
    id: string
    name: string
    content: string
    element: elementType
    colour: string
}

export interface LibrarySchema {
    id: string,
    classIds: string[],
    name: string,
    description: string,
    createdAt: Date,
    creator: string,
    tags: string[],
    recipe: Recipe,
}

export interface Project {
    id: string,
    name: string,
    createdAt: Date,
    mapIds: string[],
    recipe: Recipe,
    anyoneCanEdit: boolean,
    editors: string[],
    anyoneCanView: boolean,
    viewers: string[],
}

export interface Recipe {
    id: string,
    content: string,
}