import { useDrag } from "react-dnd";
import { useFirestore } from "react-redux-firebase";
import { useAppSelector } from "../app/hooks";
import { Node as NodeType, Property } from "../app/schema";
import { generateId } from "../etc/helpers";
import { ItemTypes } from "../ItemTypes";
import styles from "./Node.module.css";
import PropertyComponent from "./properties/Property";

interface NodeProps {
    node: NodeType,
    mapId: string,
}
export default function Node({ node, mapId }: NodeProps) {
    const [{ isDragging }, drag] = useDrag(
        () => ({
            type: ItemTypes.NODE,
            item: {
                id: node.id,
                x: node.x,
                y: node.y
            },
            collect: (monitor) => ({
                isDragging: monitor.isDragging(),
            }),
        }),
        [node],
    )

    const firestore = useFirestore()
    const addProperty = () => {
        const id = generateId()
        const property : Property = {
            id,
            abstractProperty: {
                id: "temp",
                name: "Title",
                type: "text"
            },
            value: "",
        }
        firestore.set(`maps/${mapId}/nodes/${node.id}/properties/${id}`, property)
    }

    if (isDragging) {
        return <div ref={drag} /> // hide the element while dragging
    }
    return (
        <div
            className={`${styles.Node} doNotPan`}
            style={{ left: node.x, top: node.y }}
            ref={drag}
        >
            {node.properties.map(property => 
                <PropertyComponent
                    property={property}
                    abstractProperty={property.abstractProperty}
                />
            )}
            <p className="doNotPan">{node.name} {node.id}</p>
            <button onClick={addProperty}>Add property</button>
        </div>
    )
}