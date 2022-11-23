import { Card, Group } from "@mantine/core";
import { MouseEvent, useState } from "react";
import { useDrag } from "react-dnd";
import { useFirestore } from "react-redux-firebase";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { Node as NodeType } from "../../app/schema";
import { generateId } from "../../etc/helpers";
import { useSelectable } from "../../etc/useSelectable";
import { ItemTypes } from "../../ItemTypes";
import { addArrow } from "../../state/mapFunctions";
import { Pane, setAddingArrowFrom } from "../../state/paneReducer";
import { TextElement } from "../editor/TextElement";
import { useMapId, useZoomedOutMode } from "../Map";
import { AddClassSelect } from "../properties/AddClassSelect";
import { ElementContext } from "../properties/useElementId";
import { AddArrowButton } from "./AddArrowButton";
import styles from "./Node.module.css";
import { NodeOverFlowMenu } from "./NodeOverflowMenu";

interface NodeProps {
    node: NodeType
}
export default function Node({ node }: NodeProps) {
    const mapId = useMapId()
    const dispatch = useAppDispatch()
    const firestore = useFirestore()

    if (node.id === "") {
        console.error("Missing node!")
    }

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

    const { isSelected, onMousedownSelectable } = useSelectable(node.id, "node")
    const [isHovered, setIsHovered] = useState(false)

    const addingArrowFrom = useAppSelector(state => state.panes.find(
        (pane: Pane) => pane.id === mapId)?.addingArrowFrom
    )

    // naked nodes are styled differently
    const isNaked = node && !node.classId
    const zoomedOutMode = useZoomedOutMode() && node !== undefined

    return (
        <ElementContext.Provider value={{ elementType: "node", elementId: node.id }}>
            <div
                className={`
                ${styles.nodeWrapper}
                ${isSelected ? styles.isSelected : ""}
                ${isNaked ? styles.isNaked : ""}
                ${isHovered ? styles.isHovered : ""}
            `}
                id={`node.${node.id}`}
                style={node && { left: node.x, top: node.y }}
            >
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
                                dest: node.id,
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
                        <AddClassSelect element={node} elementType={"node"} zoomedOutMode={zoomedOutMode} />}

                    <Group className={styles.nodeControls} my={-8} position="right" spacing="xs">
                        {node && <AddArrowButton node={node} />}
                        <NodeOverFlowMenu node={node} theClass={undefined} />
                    </Group>

                    <TextElement element={node} elementType={"node"} />
                </Card>
            </div>
        </ElementContext.Provider>
    )
}
