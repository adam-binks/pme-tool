import { Card, Stack } from "@mantine/core";
import { MouseEvent, useContext, useState } from "react";
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
    const updateXArrow = useXarrow()
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

    const [isHovered, setIsHovered] = useState(false)

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
        return <div ref={drag} style={{ position: "absolute", left: node.x, top: node.y }} /> // hide the element while dragging
    }
    return (
        <Card
            shadow="sm"
            radius="md"
            id={`node.${node.id}`}
            className={`${styles.Node} ${addingArrowFrom ? styles.nodeCanReceiveArrow : ""} doNotPan`}
            style={{ left: node.x, top: node.y, overflow: "visible" }}
            ref={drag}
            onClick={(e: MouseEvent) => {
                if (addingArrowFrom) {
                    addArrow(firestore, mapId, {
                        id: generateId(),
                        source: addingArrowFrom,
                        dest: node.id,
                        properties: []
                    })
                    dispatch(setAddingArrowFrom({ mapId, addingArrowFrom: undefined }))
                }
                e.stopPropagation()
            }}
            onDoubleClick={(e: MouseEvent) => e.stopPropagation()} // prevent this bubbling to map
            onMouseEnter={() => { setIsHovered(true); updateXArrow() }}
            onMouseLeave={() => { setIsHovered(false); !isDragging && updateXArrow() }}
        >
            <p className={`${styles.debugNodeText} doNotPan`}>{node.name} {node.id}</p>
            <Stack spacing={5}>
                {node.properties.map(property =>
                    <PropertyComponent
                        key={property.id}
                        property={property}
                        abstractProperty={
                            abstractProperties.find((prop: Property) => prop.id === property.abstractPropertyId)
                        }
                        updatePropertyValue={updatePropertyValue}
                    />
                )}
            </Stack>
            {/* <AddArrowButton node={node} /> */}
            {isHovered && <AddArrowButton node={node} />}
            {isHovered && <AddPropertySelect node={node} />}
        </Card>
    )
}
