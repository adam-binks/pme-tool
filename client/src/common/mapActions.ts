import { defineAction } from '@logux/actions'

type RenameMapAction = {
    type: 'renameMap'
    id: string
    name: string
}
export const renameMap = defineAction<RenameMapAction>("renameMap")


export default {
    renameMap
}