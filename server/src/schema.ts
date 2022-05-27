import mongoose from "mongoose";
const { model, Schema } = mongoose;

interface IMap extends Document {
    name: string;
    nodes: string[];
    mapSchema: {
        properties: IAbstractProperty[],
    }
    // todo node types, arrow types, group types
}
interface IAbstractProperty extends Document {
    name: string;
    // todo property type (e.g. slider)
}
const MapSchema = new Schema<IMap>({
    name: { type: String, required: true },
    nodes: [{ type: String, required: true }],
    mapSchema: {
        properties: [{
            name: { type: String, required: true }
        }]
    }
})
export const Map = model("Map", MapSchema)


// define a separate document for nodes because we may want ability to transclude a node in multiple maps
interface INode extends Document {
    name: string;
    properties: IProperty[];
}
interface IProperty extends Document {
    name: string;
}
const NodeSchema = new Schema<INode>({
    properties: [{
        abstractPropertyId: { type: String, required: true },
        // NB: because value is Mixed type, on value changed must call doc.markModified(path), passing the path to the Mixed type
        // https://mongoosejs.com/docs/schematypes.html#mixed
        value: { type: Schema.Types.Mixed }
    }]
})
export const Node = model("Node", NodeSchema)