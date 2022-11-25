export interface FirebaseSchema {
    maps: Map[],
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
    colour: string
    content: string
    width: number
    source: string
    dest: string
}

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
}