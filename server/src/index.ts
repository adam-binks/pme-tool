import { Server } from '@logux/server'
import mongoose from 'mongoose'
import { MapModel, MapSchemaModel } from './schema.js'

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

async function dbtest() {
    await mongoose.connect('mongodb://127.0.0.1:27017')

    const testSchema = await MapSchemaModel.create({ properties: [] })
    const testMap = await MapModel.create({ name: "test", nodes: [], mapSchema: testSchema._id })
    console.log(testMap.name)
}

dbtest().catch(err => console.error(err))

// mongoose.connect('mongodb://127.0.0.1:27017')
//     .then(() => server.listen())