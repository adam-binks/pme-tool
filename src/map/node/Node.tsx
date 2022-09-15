import { Card, Group, Stack } from "@mantine/core";
import { MouseEvent, useState } from "react";
import { useDrag } from "react-dnd";
import { useFirestore } from "react-redux-firebase";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { AbstractProperty, Class, Node as NodeType, Property } from "../../app/schema";
import { generateId } from "../../etc/helpers";
import { useSelectable } from "../../etc/useSelectable";
import { ItemTypes } from "../../ItemTypes";
import { addArrow, updateNodeProperties } from "../../reducers/mapFunctions";
import { Pane, setAddingArrowFrom } from "../../reducers/paneReducer";
import { useMapId } from "../Map";
import { AddClassSelect } from "../properties/AddClassSelect";
import { AddPropertySelect } from "../properties/AddPropertySelect";
import PropertyComponent from "../properties/Property";
import { ElementContext } from "../properties/useElementId";
import { AddArrowButton } from "./AddArrowButton";
import styles from "./Node.module.css";
import { NodeOverFlowMenu } from "./NodeOverflowMenu";

interface NodeProps {
    node?: NodeType
    theClass?: Class
    inSchema: boolean
}
export default function Node({ node = undefined, theClass = undefined, inSchema }: NodeProps) {
    const mapId = useMapId()
    const dispatch = useAppDispatch()
    const firestore = useFirestore()

    const nodeElementType = (node && "node") || "class"
    const id = (node && node.id) || (theClass && theClass.id) || ""
    if (id === "") {
        console.error("Missing node or class!")
    }

    const [{ isDragging }, drag] = useDrag(
        () => ({
            type: inSchema ? ItemTypes.SCHEMA_NODE : ItemTypes.NODE,
            item: node !== undefined ? {
                id: node.id,
                x: node.x,
                y: node.y
            } : {
                id: theClass?.id
            },
            collect: (monitor) => ({
                isDragging: monitor.isDragging(),
            }),
        }),
        [node],
    )

    const { isSelected, onClickSelectable } = useSelectable(id, inSchema ? "node" : "class")

    const [isHovered, setIsHovered] = useState(false)

    const addingArrowFrom = useAppSelector(state => state.panes.find(
        (pane: Pane) => pane.id === mapId)?.addingArrowFrom
    )

    const abstractProperties = useAppSelector(state => state.firestore.data.maps[mapId].schema.properties)


    const updatePropertyValue = (property: Property, newValue: any) => {
        node && updateNodeProperties(firestore, mapId, node.id,
            node.properties.map(existingProp => existingProp === property ?
                { ...existingProp, value: newValue } : existingProp
            )
        )
    }

    // naked nodes are styled differently
    const isNaked = node && !node.classId && node.properties?.length === 1

    return (
        <ElementContext.Provider value={{ elementType: nodeElementType, elementId: id }}>
            <div
                className={`
                ${styles.nodeWrapper}
                ${inSchema ? styles.inSchema : ""}
                ${isSelected ? styles.isSelected : ""}
                ${isNaked ? styles.isNaked : ""}
                ${isHovered ? styles.isHovered : ""}
            `}
                id={`node.${id}`}
                style={node && { left: node.x, top: node.y }}
            >
                {theClass && <AddClassSelect element={theClass} elementType={nodeElementType} />}
                {node && (isSelected || node.classId) && <AddClassSelect element={node} elementType={nodeElementType} />}
                <Card
                    shadow={isSelected ? "xl" : "sm"}
                    radius="md"
                    p="xs"
                    className={
                        `${styles.nodeCard}
                    ${addingArrowFrom ? styles.nodeCanReceiveArrow : ""}
                    ${isDragging ? styles.isDragging : ""}
                    doNotPan`
                    }
                    ref={drag}
                    onClick={(e: MouseEvent) => {
                        if (addingArrowFrom) {
                            addArrow(firestore, mapId, {
                                id: generateId(),
                                source: addingArrowFrom,
                                dest: id,
                                properties: [],
                                classId: null,
                            })
                            dispatch(setAddingArrowFrom({ mapId, addingArrowFrom: undefined }))
                        } else {
                            onClickSelectable(e)
                        }
                        e.stopPropagation()
                    }}
                    onDoubleClick={(e: MouseEvent) => e.stopPropagation()} // prevent this bubbling to map
                    onMouseEnter={() => { setIsHovered(true) }}
                    onMouseLeave={() => { setIsHovered(false) }}
                >
                    <p className={`${styles.debugNodeText} doNotPan`}>{id}</p>

                    <Group className={styles.nodeControls} my={-8} position="right" spacing="xs">
                        {node && <AddArrowButton node={node} />}
                        {node && <NodeOverFlowMenu node={node} />}
                    </Group>

                    <Stack spacing={5} className="doNotPan">
                        {node && node.properties.map(property =>
                            <PropertyComponent
                                key={property.id}
                                property={property}
                                abstractProperty={
                                    abstractProperties?.find((prop: AbstractProperty) => prop.id === property.abstractPropertyId)
                                }
                                updatePropertyValue={updatePropertyValue}
                            />
                        )}
                        {theClass && theClass.propertyIds.map(abstractPropertyId =>
                            <PropertyComponent
                                key={abstractPropertyId}
                                property={undefined}
                                abstractProperty={abstractProperties.find((prop: AbstractProperty) => prop.id === abstractPropertyId)}
                                updatePropertyValue={() => {}}
                            />
                        )}
                    </Stack>

                </Card>
                {node && isSelected && <AddPropertySelect node={node} />}
            </div>
        </ElementContext.Provider>
    )
}
