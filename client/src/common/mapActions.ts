import { defineAction } from '@logux/actions'


/* template to copy: 

export const X = defineAction<{
    type: 'TYPE'
    id: string
}>('TYPE')

*/

// map

export const loadMap = defineAction<{
    type: 'map/load'
    // id: string
    map: any
}>('map/load')

export const createMap = defineAction<{
    type: 'map/create'
    id: string
}>('map/create')

export const renameMap = defineAction<{
    type: 'map/rename'
    id: string
    name: string
}>('map/rename')

export const addNodeToMap = defineAction<{
    type: 'map/addNode'
    mapId: string
    nodeId: string
    x: number
    y: number
}>('map/addNode')


// node

export const createNode = defineAction<{
    type: 'node/create'
    id: string
    name: string
    // todo - type, properties
}>('node/create')


// panes

export const openPane = defineAction<{
    type: 'panes/add'
    pane: {id: string}
}>('panes/add')

export const closePane = defineAction<{
    type: 'panes/close'
    paneIndex: number
}>('panes/close')