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
    properties: Property[]
    x: number
    y: number
}

export interface Arrow {
    id: string
    properties: Property[]
    source: string
    dest: string
    classId: string | null
}

export type Element = Node | Arrow
export type elementType = "node" | "arrow" | "class"

export interface Schema {
    id: string
    properties: AbstractProperty[]
    classes: Class[]
}


export interface Class {
    id: string
    name: string
    propertyIds: string[]
    element: elementType
}

export interface Property {
    id: string
    abstractPropertyId: string
    value: any
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