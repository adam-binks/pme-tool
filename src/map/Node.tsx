import { useContext } from "react";
import { useDrag } from "react-dnd";
import { useFirestore } from "react-redux-firebase";
import { useAppSelector } from "../app/hooks";
import { Node as NodeType, Property } from "../app/schema";
import { ItemTypes } from "../ItemTypes";
import { updateAbstractProperty, updateNodeProperties } from "../reducers/mapFunctions";
import { MapContext } from "./Map";
import styles from "./Node.module.css";
import { AddPropertySelect } from "./properties/AddPropertySelect";
import PropertyComponent from "./properties/Property";

interface NodeProps {
    node: NodeType,
}
export default function Node({ node }: NodeProps) {
    const mapId = useContext(MapContext)
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

    const abstractProperties = useAppSelector(state => state.firestore.data.maps[mapId].schema.properties)

    const firestore = useFirestore()

    const updatePropertyValue = (property: Property, newValue: any) => {
        updateNodeProperties(firestore, mapId, node.id, 
            node.properties.map(existingProp => existingProp === property ? 
                {...existingProp, value: newValue} : existingProp
            )
        )
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
            <p className={`${styles.debugNodeText} doNotPan`}>{node.name} {node.id}</p>
            {node.properties.map(property => 
                <PropertyComponent
                    key={property.id}
                    property={property}
                    abstractProperty={
                        abstractProperties.find((prop: Property) => prop.id === property.abstractPropertyId)
                    }
                    updatePropertyValue={updatePropertyValue}
                    updateAbstractProperty={(id, changes) => 
                        updateAbstractProperty(firestore, mapId, abstractProperties, id, changes)
                    }
                />
            )}
            <AddPropertySelect node={node} />
        </div>
    )
}
