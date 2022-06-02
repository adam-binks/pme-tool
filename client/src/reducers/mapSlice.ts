import { Action } from "@logux/core"
import { createReducer, createSlice } from "@reduxjs/toolkit"
import { createMap, loadMap, renameMap } from "../common/mapActions"



export type MapsState = { maps: Map[], nodes: Node[] }

const getMap = (state: MapsState, id: string) => state.maps.find(map => map._id === id)

export const mapReducer = createReducer({ maps: [], nodes: [] }, (builder) => {
    builder
        .addCase(renameMap, (state, action) => {
            const map = getMap(state, action.id)
            if (map) map.name = action.name
        })

        .addCase(loadMap, (state, action) => {
            const mapExists = getMap(state, action.map._id)
            if (!mapExists) {
                state.maps.push(action.map)
            }
        })
})
export function mapReducer(state: MapsState = { maps: [], nodes: [] }, action: Action): MapsState {
    if (renameMap.match(action)) {
        return state.map(map => {
            if (map._id === action.id) {
                return { ...map, name: action.name }
            } else {
                return map
            }
        })
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