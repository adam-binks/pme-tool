import { Server } from '@logux/server'
import mongoose from 'mongoose'
import { Map } from './schema.js'

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

// async function dbtest() {
//     await mongoose.connect('mongodb://127.0.0.1:27017')

//     const testMap = new Map({ name: "test", nodes: [], schema: { properties: [] } })
//     console.log(testMap.name)
//     await testMap.save()
// }

// dbtest().catch(err => console.error(err))

mongoose.connect('mongodb://127.0.0.1:27017')
    .then(() => server.listen())