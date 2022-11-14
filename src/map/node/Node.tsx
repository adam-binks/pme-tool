import { Card, Group } from "@mantine/core";
import { MouseEvent, useState } from "react";
import { useDrag } from "react-dnd";
import { useFirestore } from "react-redux-firebase";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { Class, getElementType, Node as NodeType } from "../../app/schema";
import { enact } from "../../etc/firestoreHistory";
import { generateId } from "../../etc/helpers";
import { useSelectable } from "../../etc/useSelectable";
import { ItemTypes } from "../../ItemTypes";
import { addArrow, updateElementCommand } from "../../state/mapFunctions";
import { Pane, setAddingArrowFrom } from "../../state/paneReducer";
import { Editor } from "../editor/Editor";
import { Property } from "../editor/expose_properties";
import { useMapId, useZoomedOutMode } from "../Map";
import { AddClassSelect } from "../properties/AddClassSelect";
import { ElementContext } from "../properties/useElementId";
import { PropertyStack } from "../schema/PropertyStack";
import { AddArrowButton } from "./AddArrowButton";
import styles from "./Node.module.css";
import { NodeOverFlowMenu } from "./NodeOverflowMenu";

interface NodeProps {
    node: NodeType
    theClass?: Class
    inSchema: boolean
}
export default function Node({ node, theClass = undefined, inSchema }: NodeProps) {
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

    const { isSelected, onMousedownSelectable } = useSelectable(id, inSchema ? "class" : "node")

    const [isHovered, setIsHovered] = useState(false)

    const addingArrowFrom = useAppSelector(state => state.panes.find(
        (pane: Pane) => pane.id === mapId)?.addingArrowFrom
    )

    const updateContent = (newValue: string) => enact(dispatch, mapId, updateElementCommand(
        firestore, mapId, node.id, getElementType(node),
        { content: node.content },
        { content: newValue }
    ))

    // naked nodes are styled differently
    const isNaked = node && !node.classId //&& node.properties?.length === 1
    const zoomedOutMode = useZoomedOutMode() && node !== undefined

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

                <Card
                    shadow={isSelected ? "xl" : "xs"}
                    radius="md"
                    p="xs"
                    withBorder={!isNaked}
                    className={
                        `${styles.nodeCard}
                        ${addingArrowFrom ? styles.nodeCanReceiveArrow : ""}
                        ${isDragging ? styles.isDragging : ""}
                        doNotPan`
                    }
                    ref={drag}
                    onClick={(e: MouseEvent) => {
                        if (addingArrowFrom) {
                            addArrow(firestore, dispatch, mapId, {
                                id: generateId(),
                                source: addingArrowFrom,
                                dest: id,
                                content: "",
                                classId: null,
                            })
                            dispatch(setAddingArrowFrom({ mapId, addingArrowFrom: undefined }))
                        } else {
                            onMousedownSelectable(e)
                        }
                        e.stopPropagation()
                    }}
                    onDoubleClick={(e: MouseEvent) => e.stopPropagation()} // prevent this bubbling to map
                    onMouseEnter={() => { setIsHovered(true) }}
                    onMouseLeave={() => { setIsHovered(false) }}
                    >
                    {node && (isSelected || node.classId) &&
                        <AddClassSelect element={node} elementType={nodeElementType} zoomedOutMode={zoomedOutMode} />}
                        
                    <Group className={styles.nodeControls} my={-8} position="right" spacing="xs">
                        {node && <AddArrowButton node={node} />}
                        <NodeOverFlowMenu node={node} theClass={theClass} />
                    </Group>

                    {node && <Editor 
                        element={node}
                        updateContent={updateContent}
                        onUpdateProperties={(properties: Property[]) => {}}
                    />}

                    {theClass && <PropertyStack theClass={theClass} />}

                </Card>
            </div>
        </ElementContext.Provider>
    )
}
