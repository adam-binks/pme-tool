import { defineAction } from '@logux/actions'

export const loadMap = defineAction<{
    type: 'map/load'
    // id: string
    map: any
}>('map/load')

export const renameMap = defineAction<{
    type: 'map/rename'
    id: string
    name: string
}>('map/rename')
