import { ActionIcon, Card, Group, Menu, Stack } from "@mantine/core";
import { IconDots, IconTrash } from "@tabler/icons";
import { MouseEvent, useContext, useState } from "react";
import { useDrag } from "react-dnd";
import { useFirestore } from "react-redux-firebase";
import { useXarrow } from "react-xarrows";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { Arrow, Node as NodeType, Property } from "../../app/schema";
import { generateId } from "../../etc/helpers";
import { ItemTypes } from "../../ItemTypes";
import { addArrow, deleteNode, updateAbstractProperty, updateNodeProperties } from "../../reducers/mapFunctions";
import { Pane, setAddingArrowFrom } from "../../reducers/paneReducer";
import { MapContext } from "../Map";
import { AddPropertySelect } from "../properties/AddPropertySelect";
import { AddClassSelect } from "../properties/AddClassSelect";
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
    const arrows = useAppSelector(state => state.firestore.data[`arrows.${mapId}`])
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

    // return (
    //     <div className={`${styles.nodeWrapper}`} id={`node.${node.id}`} style={{ left: node.x, top: node.y,
    //     width: 5, height: 5, backgroundColor: "red" }}>

    //     </div>
    // )

    return (
        <div className={`${styles.nodeWrapper}`} id={`node.${node.id}`} style={{ left: node.x, top: node.y }}>
            <Card
                shadow="sm"
                radius="md"
                p="xs"
                // id={`node.${node.id}`}
                className={
                    `${styles.nodeCard}
                ${addingArrowFrom ? styles.nodeCanReceiveArrow : ""}
                ${isDragging ? styles.isDragging : ""}
                doNotPan`}
                ref={drag}
                onClick={(e: MouseEvent) => {
                    if (addingArrowFrom) {
                        addArrow(firestore, mapId, {
                            id: generateId(),
                            source: addingArrowFrom,
                            dest: node.id,
                            properties: [],
                            classId: null,
                        })
                        dispatch(setAddingArrowFrom({ mapId, addingArrowFrom: undefined }))
                    }
                    e.stopPropagation()
                }}
                onDoubleClick={(e: MouseEvent) => e.stopPropagation()} // prevent this bubbling to map
                onMouseEnter={() => { setIsHovered(true); updateXArrow() }}
                onMouseLeave={() => { setIsHovered(false); !isDragging && updateXArrow() }}
            >
                <AddClassSelect element={node} elementType={"node"} />
                <p className={`${styles.debugNodeText} doNotPan`}>{node.name} {node.id}</p>
                <Group my={-8} position="right" spacing="xs">
                    {(true || isHovered || addingArrowFrom === node.id) && <AddArrowButton node={node} />}
                    <Menu shadow="md" width={200} position="left-start">
                        <Menu.Target>
                            <ActionIcon radius="xl" style={{}} size="md">
                                <IconDots />
                            </ActionIcon>
                        </Menu.Target>
                        <Menu.Dropdown>
                            <Menu.Item
                                onClick={() => 
                                    deleteNode(firestore, mapId, node.id, arrows ? Object.values(arrows) : [])
                                }
                                icon={<IconTrash size={14}
                            />}>
                                Delete
                            </Menu.Item>
                        </Menu.Dropdown>
                    </Menu>
                </Group>
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
                {(isHovered || true) && <AddPropertySelect node={node} />}
            </Card>
        </div>
    )
}
