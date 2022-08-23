import { useContext } from "react";
import { useDrag } from "react-dnd";
import { useFirestore } from "react-redux-firebase";
import { useXarrow } from "react-xarrows";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { Node as NodeType, Property } from "../../app/schema";
import { generateId } from "../../etc/helpers";
import { ItemTypes } from "../../ItemTypes";
import { addArrow, updateAbstractProperty, updateNodeProperties } from "../../reducers/mapFunctions";
import { Pane, setAddingArrowFrom } from "../../reducers/paneReducer";
import { MapContext } from "../Map";
import { AddPropertySelect } from "../properties/AddPropertySelect";
import PropertyComponent from "../properties/Property";
import { AddArrowButton } from "./AddArrowButton";
import styles from "./Node.module.css";

interface NodeProps {
    node: NodeType,
}
export default function Node({ node }: NodeProps) {
    const mapId = useContext(MapContext)
    const dispatch = useAppDispatch()
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

    const addingArrowFrom = useAppSelector(state => state.panes.find(
        (pane: Pane) => pane.id === mapId)?.addingArrowFrom
    )

    const abstractProperties = useAppSelector(state => state.firestore.data.maps[mapId].schema.properties)

    const firestore = useFirestore()

    const updatePropertyValue = (property: Property, newValue: any) => {
        updateNodeProperties(firestore, mapId, node.id,
            node.properties.map(existingProp => existingProp === property ?
                { ...existingProp, value: newValue } : existingProp
            )
        )
    }

    if (isDragging) {
        return <div ref={drag} /> // hide the element while dragging
    }
    return (
        <div
            id={`node.${node.id}`}
            className={`${styles.Node} ${addingArrowFrom ? styles.nodeCanReceiveArrow : ""} doNotPan`}
            style={{ left: node.x, top: node.y }}
            ref={drag}
            onClick={(e) => {
                console.log(addingArrowFrom)
                if (addingArrowFrom) {
                    addArrow(firestore, mapId, {
                        id: generateId(),
                        source: addingArrowFrom,
                        dest: node.id,
                        properties: []
                    })
                    dispatch(setAddingArrowFrom({mapId, addingArrowFrom: undefined}))
                }
                e.stopPropagation()
            }}
            onDoubleClick={(e) => e.stopPropagation()} // prevent this bubbling to map
        >
            <p className={`${styles.debugNodeText} doNotPan`}>{node.name} {node.id}</p>
            <AddArrowButton node={node} />
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
