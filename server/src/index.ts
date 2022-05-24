import { Server } from '@logux/server'

const server = new Server(
    Server.loadOptions(process, {
        subprotocol: '1.0.0',
        supports: '1.x',
        fileUrl: import.meta.url
    })
)

server.auth(({ userId, token }) => {
    // Allow only local users until we will have a proper authentication
    return true // process.env.NODE_ENV === 'development'
})

server.listen()