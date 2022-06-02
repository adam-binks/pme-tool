import typegoose from "@typegoose/typegoose";
const { getModelForClass, prop } = typegoose
import { Schema } from "mongoose";

class AbstractProperty {
    @prop({ required: true })
    public name!: String
}
export const AbstractPropertyModel = getModelForClass(AbstractProperty)

class MapSchema {
    @prop({ required: true, ref: () => AbstractProperty })
    properties!: typegoose.Ref<AbstractProperty>[]
}
export const MapSchemaModel = getModelForClass(MapSchema)

class Property {
    @prop({ required: true, ref: () => AbstractProperty })
    public abstractProperty!: typegoose.Ref<AbstractProperty>

    // NB: because value is Mixed type, on value changed must call doc.markModified(path), passing the path to the Mixed type
    // https://mongoosejs.com/docs/schematypes.html#mixed
    @prop()
    public value?: { type: Schema.Types.Mixed }
}
export const PropertyModel = getModelForClass(Property)

class Node {
    @prop({ required: true })
    public name!: String

    @prop({ required: true, ref: () => Property })
    public properties!: typegoose.Ref<Property>[]
}
export const NodeModel = getModelForClass(Node)

class NodeOnMap {
    @prop({ required: true, ref: () => Node })
    public node!: typegoose.Ref<Node>

    @prop({ required: true })
    public x!: number

    @prop({ required: true })
    public y!: number
}
export const NodeOnMapModel = getModelForClass(NodeOnMap)

class Map {
    @prop({ required: true })
    public name!: String

    @prop({ required: true, ref: () => NodeOnMap })
    public nodes!: typegoose.Ref<NodeOnMap>[]

    @prop({ required: true, ref: () => MapSchema })
    public mapSchema!: typegoose.Ref<MapSchema>

    // todo node types, arrow types, group types
}
export const MapModel = getModelForClass(Map)