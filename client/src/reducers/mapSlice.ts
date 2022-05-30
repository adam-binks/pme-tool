import { Action } from "@logux/core"
import { loadMap, renameMap } from "../common/mapActions"

export interface Map {
    _id: string,
    name: string,
    nodes: Node[],
    mapSchema: undefined // todo
}

export interface Node {
    name: string,
    // todo more
}

export type MapsState = Map[]

export function mapReducer (state: MapsState = [], action: Action) : MapsState {
    if (renameMap.match(action)) {
        return state.map(map => {
            if (map._id === action.id) {
                return {...map, name: action.name}
            } else {
                return map
            }})
    }

    if (loadMap.match(action)) {
        if (!state.find(map => map._id === action.map._id)) {
            return [action.map, ...state]
        }

        return state.map(existingMap => {
            if (existingMap._id === action.map._id) {
                return action.map
            } else {
                return existingMap
            }
        })
    }

    return state
}