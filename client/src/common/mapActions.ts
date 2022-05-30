import { defineAction } from '@logux/actions'

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

export const openPane = defineAction<{
    type: 'panes/add'
    pane: {id: string}
}>('panes/add')

export const closePane = defineAction<{
    type: 'panes/close'
    paneIndex: number
}>('panes/close')

/* template to copy: 

export const X = defineAction<{
    type: 'TYPE'
    id: string
}>('TYPE')

*/