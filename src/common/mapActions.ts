export interface Map {
    _id: string
    name: string
    nodes: NodeOnMap[]
    mapSchema: MapSchema // todo
}

export interface MapSchema {
    _id: string
    properties: AbstractProperty[]
}

export interface NodeOnMap {
    _id: string
    node: Node
    x: number
    y: number
}

export interface Node {
    _id: string
    name: string
    properties: Property[]
}

export interface Property {
    _id: string
    abstractProperty: AbstractProperty
    value: any
}

export interface AbstractProperty {
    _id: string
    name: string
    type: "text" | "checkbox"
}


/* template to copy: 

export const X = defineAction<{
    type: 'TYPE'
    id: string
}>('TYPE')

*/

// map

// export const loadMap = defineAction<{
//     type: 'map/load'
//     // id: string
//     map: Map
// }>('map/load')

// export const createMap = defineAction<{
//     type: 'map/create'
//     id: string
// }>('map/create')

// export const renameMap = defineAction<{
//     type: 'map/rename'
//     id: string
//     name: string
// }>('map/rename')

// export const addNodeToMap = defineAction<{
//     type: 'map/addNode'
//     mapId: string
//     nodeId: string
//     nodeOnMapId: string
//     x: number
//     y: number
// }>('map/addNode')

// export const moveNodeOnMap = defineAction<{
//     type: 'map/moveNode'
//     mapId: string
//     nodeOnMapId: string
//     x: number
//     y: number
// }>('map/moveNode')

// // node

// export const createNode = defineAction<{
//     type: 'node/create'
//     id: string
//     name: string
//     properties: Property[]
//     // todo - type, properties
// }>('node/create')


// // panes

// export const openPane = defineAction<{
//     type: 'panes/add'
//     pane: {id: string}
// }>('panes/add')

// export const closePane = defineAction<{
//     type: 'panes/close'
//     paneIndex: number
// }>('panes/close')