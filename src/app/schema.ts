export interface FirebaseSchema {
    maps: Map[],
}

export interface Map {
    id: string
    name: string
    createdAt: Date
    nodes: Node[]
    arrows: Arrow[]
    schema: Schema
}

export interface Node {
    id: string
    classId: string | null
    name: string
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

export interface Schema {
    id: string
    properties: AbstractProperty[]
    classes: Class[]
}

export interface Class {
    id: string
    name: string
    propertyIds: string[]
    element: "node" | "arrow"
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

export type PropertyType = "text" | "checkbox"

export const defaultPropertyValueByType = {
    text: "",
    checkbox: true,
}