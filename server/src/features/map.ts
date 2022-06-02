import { MapModel } from '../schema.js'
import { objectId, createBlankMap, getMapById } from '../helpers.js'
import { createMap, loadMap, renameMap } from '../tmp/mapActionsCopy.js'
import { Server } from '@logux/server'

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
                .lean() // lean to make JS objects rather than Mongoose objects
                ?.populate('nodes')?.populate('mapSchema')
    
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
            let map = await MapModel.findById(objectId(action.id))
            if (!map) {
                map = await createBlankMap(action.id)
            }
            map.name = action.name ? action.name : " "
            await map.save()
        }
    })
}