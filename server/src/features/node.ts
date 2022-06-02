import { Server } from "@logux/server";
import { createNode } from "../tmp/mapActionsCopy";

export default (server: Server) => {
    server.type(createNode, {
        access() {
            return true
        }
    })
}