import mongoose from "mongoose";
import { MapModel, MapSchemaModel, NodeModel } from './schema.js';

export function objectId(id: string) {
    return new mongoose.Types.ObjectId(id)
}

export async function createBlankMap(id: string) {
    const schema = await MapSchemaModel.create({ properties: [] });
    return await MapModel.create({ _id: id, name: "New map", nodes: [], mapSchema: schema._id });
}

export function getMapById(id: string) {
    return MapModel.findById(objectId(id))
}

export function getNodeById(id: string) {
    return NodeModel.findById(objectId(id))
}