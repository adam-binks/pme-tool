export interface FirebaseSchema {
    maps: Map[],
}

export interface Map {
    id: string
    name: string
    createdAt: Date
    nodes: Node[]
    schema: Schema
}

export interface Node {
    id: string
    name: string
    properties: Property[]
    x: number
    y: number
}

export interface Schema {
    id: string
    properties: AbstractProperty[]
}

export interface Property {
    id: string
    abstractProperty: AbstractProperty
    value: any
}

export interface AbstractProperty {
    id: string
    name: string
    type: "text" | "checkbox"
}