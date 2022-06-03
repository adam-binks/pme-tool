import { createBlankMap, getMapById, getNodeById } from '../helpers.js'
import { addNodeToMap, createMap, loadMap, renameMap } from '../tmp/mapActionsCopy.js'
import { Server } from '@logux/server'
import { NodeOnMapModel } from '../schema.js'
import typegoose from '@typegoose/typegoose'
const { isDocumentArray, isDocument } = typegoose

export default (server: Server) => {
    server.channel<{ id: string }>('map/:id', {
        access() {
            return true // todo - restrict access
        },
        async load(ctx) {
            const map = await getMapById(ctx.params.id)
                .populate({
                    path: 'nodes',
                    populate: {
                        path: 'node',
                        populate: {
                            path: 'properties',
                            populate: {
                                path: 'abstractProperty'
                            }
                        }
                    }
                })
                .populate({
                    path: 'mapSchema',
                    populate: {
                        path: 'properties'
                    }
                })

            if (map && isDocumentArray(map.nodes) && isDocument(map.mapSchema)) {
                ctx.sendBack(loadMap({
                    map: {
                        _id: map._id,
                        name: map.name,
                        nodes: map.nodes.map(node => node.toObject()),
                        mapSchema: map.mapSchema.toObject()
                    }
                }))
            } else {
                console.log("Error - map/load typeguards failed")
            }
        },
        filter(ctx, action) {
            console.log('in filter')
            console.log(action)
            return (mapAction, mapMeta) => {
                console.log('in inner')
                console.log(mapAction)
                return true
            }
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

            const nodeAlreadyOnMap = isDocumentArray(map.nodes) && !map.nodes.every(node => node._id !== action.nodeId)
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