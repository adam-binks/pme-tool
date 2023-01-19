import { Card, clsx } from "@mantine/core";
import { MouseEvent, useEffect, useState } from "react";
import { useDrag } from "react-dnd";
import { useFirestore } from "react-redux-firebase";
import { useAppDispatch } from "../../app/hooks";
import { Node as NodeType } from "../../app/schema";
import { useSelectable } from "../../etc/useSelectable";
import { ItemTypes } from "../../ItemTypes";
import { setLocalElement } from "../../state/localReducer";
import { useClass } from "../../state/mapSelectors";
import { ElementHeader } from "../element/ElementHeader";
import { ResizeElement } from "../element/ResizeElement";
import { TextElement } from "../element/TextElement";
import { DragItem, useMapId, useZoomedOutMode } from "../Map";
import { ElementContext } from "../properties/useElementId";
import styles from "./Node.module.css";

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
        () => {
            const item: DragItem = {
                mapId,
                id: node.id,
                x: node.x,
                y: node.y,
                node,
            }
            return {
                type: ItemTypes.NODE,
                item,
                collect: (monitor) => ({
                    isDragging: monitor.isDragging(),
                }),
            }
        },
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

    const theClass = useClass(node.classId)

    const { isSelected, onMousedownSelectable } = useSelectable(node.id, "node")
    const [isHovered, setIsHovered] = useState(false)

    // const addingArrowFrom = useAppSelector(state => state.panes.find(
    //     (pane: Pane) => pane.id === mapId)?.addingArrowFrom
    // )

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
                style={{ left: node.x, top: node.y, width: node.width, borderColor: theClass?.colour }}
            >
                <Card
                    shadow={isSelected ? "xl" : "xs"}
                    radius="md"
                    p="xs"
                    withBorder={!isNaked}
                    className={clsx(
                        styles.nodeCard,
                        isDragging && styles.isDragging,
                        "doNotPan group-hover/element:bg-gray-50 overflow-visible border-inherit"
                    )}
                    ref={drag}
                    onClick={(e: MouseEvent) => {
                        // if (!addingArrowFrom) {
                        onMousedownSelectable(e)
                        // }
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
