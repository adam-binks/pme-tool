import { Server } from "@logux/server";
import { getNodeById } from "../helpers.js";
import { NodeModel } from "../schema.js";
import { createNode } from "../tmp/mapActionsCopy.js";

export default (server: Server) => {
    server.type(createNode, {
        access() {
            return true
        },
        async process(ctx, action) {
            const nodeExists = await getNodeById(action.id)
            if (!nodeExists) {
                const node = await NodeModel.create({
                    _id: action.id,
                    ...action
                })
                await node.save()
            } else {
                console.error("node exists " + action.id)
            }
        }
    })
}