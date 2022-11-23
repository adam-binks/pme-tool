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
    x: number
    y: number
}

export interface Arrow {
    id: string
    content: string
    source: string
    dest: string
    classId: string | null
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
    propertyIds: string[] // todo remove
    element: elementType
}

export interface AbstractProperty {
    id: string
    name: string
    type: PropertyType
}

export type PropertyType = "text" | "checkbox" | "title" | "text_untitled"

export const defaultPropertyValueByType = {
    text: "",
    title: "",
    text_untitled: "",
    checkbox: true,
}