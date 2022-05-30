import { Server } from '@logux/server'
import mongoose from 'mongoose'
import { MapModel, MapSchemaModel } from './schema.js'
import { objectId } from './helpers.js'
import { loadMap, renameMap } from './tmp/mapActionsCopy.js'

const server = new Server(
    Server.loadOptions(process, {
        subprotocol: '1.0.0',
        supports: '1.x',
        fileUrl: import.meta.url
    })
)

server.auth(({ userId, token }) => {
    // allow anyone until we will have proper authentication
    return true // process.env.NODE_ENV === 'development'
})

interface MapParams {
    id: string
}
server.channel<MapParams>('map/:id', {
    access(ctx) {
        return true // todo - restrict access
    },
    async load(ctx) {
        const map = await MapModel.findById(objectId(ctx.params.id))
            .lean()//?.populate('nodes')?.populate('schema')

        console.log(`map: ${map}`)
        ctx.sendBack(loadMap({map: {_id: map?._id, name: map?.name, nodes: map?.nodes, mapSchema: map?.mapSchema}}))
    }
})

server.type(renameMap, {
    access(ctx, action, meta) {
        return true
    },
    async process(ctx, action, meta) {
        let map = await MapModel.findById(objectId(action.id))
        if (!map) {
            const schema = await MapSchemaModel.create({properties: []})
            map = await MapModel.create({_id: action.id, name: "New map", nodes: [], mapSchema: schema._id})
        }
        map.name = action.name
        await map.save()
    }
})

mongoose.connect('mongodb://127.0.0.1:27017')
    .then(() => server.listen())