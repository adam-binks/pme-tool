import { Card, clsx } from "@mantine/core";
import { MouseEvent, useEffect, useState } from "react";
import { useDrag } from "react-dnd";
import { useFirestore } from "react-redux-firebase";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { Node as NodeType } from "../../app/schema";
import { generateId } from "../../etc/helpers";
import { useSelectable } from "../../etc/useSelectable";
import { ItemTypes } from "../../ItemTypes";
import { setLocalElement } from "../../state/localReducer";
import { addArrow } from "../../state/mapFunctions";
import { Pane, setAddingArrowFrom } from "../../state/paneReducer";
import { DEFAULT_ARROW_WIDTH } from "../arrow/Arrow";
import { ArrowDot } from "../element/ArrowDot";
import { ElementHeader } from "../element/ElementHeader";
import { ResizeElement } from "../element/ResizeElement";
import { TextElement } from "../element/TextElement";
import { useMapId, useZoomedOutMode } from "../Map";
import { AddClassSelect } from "../properties/AddClassSelect";
import { ElementContext } from "../properties/useElementId";
import styles from "./Node.module.css";
import { NodeOverFlowMenu } from "./NodeOverflowMenu";

export const DEFAULT_NODE_WIDTH = 200 // px

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

    useEffect(() => {
        const arrowDotOffset = 12
        dispatch(setLocalElement({
            mapId,
            elementId: node.id,
            element: {
                elementType: "node",
                arrowDot: { x: node.x + arrowDotOffset, y: node.y + arrowDotOffset }
            }
        }))
    }, [node.x, node.y])

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
                className={clsx("group/element absolute element-container",
                    isSelected && styles.isSelected,
                    isHovered && styles.isHovered,
                )}
                id={`node.${node.id}`}
                style={{ left: node.x, top: node.y, width: node.width }}
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
                        doNotPan group-hover/element:bg-gray-100 overflow-visible`
                    }
                    ref={drag}
                    onClick={(e: MouseEvent) => {
                        if (addingArrowFrom) {
                            addArrow(firestore, dispatch, mapId, {
                                id: generateId(),
                                source: addingArrowFrom,
                                dest: { elementId: node.id, elementType: "node", property: null },
                                content: "",
                                classId: null,
                                width: DEFAULT_ARROW_WIDTH,
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
                    <ElementHeader element={node} showClassSelectIfEmpty={isSelected} />
 
                    <TextElement element={node} elementType={"node"} />

                    <ResizeElement element={{ id: node.id, width: node.width }} elementType={"node"} />
                </Card>
            </div>
        </ElementContext.Provider >
    )
}
