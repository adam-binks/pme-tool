import { Server } from '@logux/server'
import mongoose from 'mongoose'
import map from './features/map'
import node from './features/node'

export const server = new Server(
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

// set up the action handlers for each of the features
const features = [
    map,
    node,
]
features.forEach(feature => feature(server))

mongoose.connect('mongodb://127.0.0.1:27017')
    .then(() => server.listen())