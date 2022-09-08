import { Card, Group, Stack } from "@mantine/core";
import { MouseEvent, useContext, useState } from "react";
import { useDrag } from "react-dnd";
import { useFirestore } from "react-redux-firebase";
import { useXarrow } from "react-xarrows";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { Node as NodeType, Property } from "../../app/schema";
import { generateId } from "../../etc/helpers";
import { ItemTypes } from "../../ItemTypes";
import { addArrow, updateNodeProperties } from "../../reducers/mapFunctions";
import { Pane, setAddingArrowFrom } from "../../reducers/paneReducer";
import { useMapId, useSelection } from "../Map";
import { AddPropertySelect } from "../properties/AddPropertySelect";
import { AddClassSelect } from "../properties/AddClassSelect";
import PropertyComponent from "../properties/Property";
import { AddArrowButton } from "./AddArrowButton";
import styles from "./Node.module.css";
import { NodeOverFlowMenu } from "./NodeOverflowMenu";
import { ElementContext } from "../properties/useElementId";
import { toast } from "react-toastify";

interface NodeProps {
    node: NodeType,
}
export default function Node({ node }: NodeProps) {
    const mapId = useMapId()
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

    const [selection, setSelection] = useSelection()
    const isSelected = selection.nodeIds && selection.nodeIds.includes(node.id)

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

    // naked nodes are styled differently
    const isNaked = node.classId === undefined && node.properties?.length === 1

    return (
        <ElementContext.Provider value={{ elementType: "node", elementId: node.id }}>
            <div
                className={`
                ${styles.nodeWrapper}
                ${isSelected ? styles.isSelected : ""}
                ${isNaked ? styles.isNaked : ""}
            `}
                id={`node.${node.id}`}
                style={{ left: node.x, top: node.y }}
            >
                {(isSelected || node.classId) && <AddClassSelect element={node} elementType={"node"} />}
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
                        toast.info("ye")
                        if (addingArrowFrom) {
                            addArrow(firestore, mapId, {
                                id: generateId(),
                                source: addingArrowFrom,
                                dest: node.id,
                                properties: [],
                                classId: null,
                            })
                            dispatch(setAddingArrowFrom({ mapId, addingArrowFrom: undefined }))
                        } else {
                            if (e.shiftKey) {
                                // toggle inclusion in selection
                                if (isSelected) {
                                    setSelection({
                                        ...selection,
                                        nodeIds: selection.nodeIds.filter(id => id !== node.id)
                                    })
                                } else {
                                    setSelection({
                                        ...selection,
                                        nodeIds: [...selection.nodeIds, node.id]
                                    })
                                }
                            } else {
                                // replace selection
                                setSelection({ nodeIds: [node.id], arrowIds: [] })
                            }
                        }
                        e.stopPropagation()
                    }}
                    onDoubleClick={(e: MouseEvent) => e.stopPropagation()} // prevent this bubbling to map
                    onMouseEnter={() => { setIsHovered(true); updateXArrow() }}
                    onMouseLeave={() => { setIsHovered(false); !isDragging && updateXArrow() }}
                >
                    <p className={`${styles.debugNodeText} doNotPan`}>{node.id}</p>

                    <Group my={-8} position="right" spacing="xs">
                        {(true || isHovered || addingArrowFrom === node.id) && <AddArrowButton node={node} />}
                        <NodeOverFlowMenu node={node} />
                    </Group>

                    <Stack spacing={5}>
                        {node.properties.map(property =>
                            <PropertyComponent
                                key={property.id}
                                property={property}
                                abstractProperty={
                                    abstractProperties?.find((prop: Property) => prop.id === property.abstractPropertyId)
                                }
                                updatePropertyValue={updatePropertyValue}
                            />
                        )}
                    </Stack>

                </Card>
                {isSelected && <AddPropertySelect node={node} />}
            </div>
        </ElementContext.Provider>
    )
}
