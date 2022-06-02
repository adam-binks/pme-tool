import { createBlankMap, getMapById, getNodeById } from '../helpers.js'
import { addNodeToMap, createMap, loadMap, renameMap } from '../tmp/mapActionsCopy.js'
import { Server } from '@logux/server'
import { NodeOnMapModel } from '../schema.js'
import typegoose from '@typegoose/typegoose'
const { isDocumentArray } = typegoose

export default (server: Server) => {
    interface MapParams {
        id: string
    }
    server.channel<MapParams>('map/:id', {
        access() {
            return true // todo - restrict access
        },
        async load(ctx) {
            const map = await getMapById(ctx.params.id)
                //.lean() // lean to make JS objects rather than Mongoose objects
                .populate('nodes').populate('mapSchema').populate('nodeOnMap')

            // =======================================================================================================================================================================================
            //              ~~GOOD MORNING CLANCY~~
            // TODO fix these compile errors. need a typeguard for nodeonmap being populated. is there a better way to load mongoose obj -> JS obj (maybe with typegoose)?
            //  maybe just need to construct the whole object more manually
            // TODO then finish adding reducers for creating nodes. Try subscribing to nodes. If that is too many subscriptions, then could resend to subscribers of 
            //  maps that contain the node (seems more elegant maybe)
            ctx.sendBack(loadMap({ map: { _id: map?._id, name: map?.name, nodes: map?.nodes, mapSchema: map?.mapSchema } }))
        }
    })

    server.type(createMap, {
        access() {
            return true
        },
        async process(ctx, action) {
            const mapExists = await getMapById(action.id)
            if (!mapExists) {
                const map = await createBlankMap(action.id)
                await map.save()
            }
        }
    })

    server.type(renameMap, {
        access(ctx, action, meta) {
            return true
        },
        async process(ctx, action, meta) {
            let map = await getMapById(action.id)
            if (!map) {
                map = await createBlankMap(action.id)
            }
            map.name = action.name ? action.name : " "
            await map.save()
        }
    })

    server.type(addNodeToMap, {
        access() {
            return true
        },
        async process(ctx, action) {
            let map = await getMapById(action.mapId).populate('nodes')
            await getNodeById(action.nodeId) // check that the node exists

            const nodeAlreadyOnMap = isDocumentArray(map.nodes) && map.nodes.every(node => node._id !== action.nodeId)
            if (!nodeAlreadyOnMap) {
                const nodeOnMap = await NodeOnMapModel.create({
                    _id: action.nodeOnMapId,
                    node: action.nodeId,
                    x: action.x,
                    y: action.y,
                })
                map.nodes.push(nodeOnMap)
                map.save()
            }

            // todo - if schema not in map, add schema
        }
    })
}