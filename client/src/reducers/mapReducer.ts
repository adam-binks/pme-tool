import { createReducer, Draft } from "@reduxjs/toolkit"
import { toast } from "react-toastify"
import { addNodeToMap, createNode, loadMap, Map, moveNodeOnMap, Node, renameMap } from "../common/mapActions"

export type MapsState = { maps: Map[], nodes: Node[] }

const getMap = ( state: Draft<MapsState>, id: string) => state.maps.find(map => map._id === id)
const getNode = ( state: Draft<MapsState>, id: string) => state.nodes.find(node => node._id === id)

const initialState: MapsState = {
    maps: [],
    nodes: [],
}

export default createReducer(initialState, (builder) => {
    builder
        .addCase(renameMap, (state, action) => {
            const map = getMap(state, action.id)
            if (map) map.name = action.name
        })

        .addCase(loadMap, (state, action) => {
            // TODO - we ignore updates to the map, seems bad..
            const mapExists = getMap(state, action.map._id)
            if (!mapExists) {
                state.maps.push(action.map)
            }
        })

        .addCase(createNode, (state, action) => {
            const nodeExists = getNode(state, action.id)
            if (nodeExists) {
                toast.error(`Node ${action.id} already exists!`)
            }
            state.nodes.push({_id: action.id, ...action})
        })

        .addCase(addNodeToMap, (state, action) => {
            const map = getMap(state, action.mapId)
            const node = getNode(state, action.nodeId)
            if (map && node) {
                map?.nodes.push({_id: action.nodeOnMapId, node: node, ...action})
            } else {
                map ? toast.error(`Could not missing node ${action.nodeId}`) : toast.error(`Could not missing map ${action.mapId}`)
            }
        })

        .addCase(moveNodeOnMap, (state, action) => {
            const map = getMap(state, action.mapId)
            const node = map?.nodes.find(node => node._id === action.nodeOnMapId)
            if (node) {
                node.x = action.x
                node.y = action.y
            }
        })
})