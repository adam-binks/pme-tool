import { clsx } from "@mantine/core";
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

    const zoomedOutMode = useZoomedOutMode() && node !== undefined

    return (
        <ElementContext.Provider value={{ elementType: "node", elementId: node.id }}>
            <div
                className={clsx("group/element absolute element-container",
                    isSelected && styles.isSelected,
                    isHovered && styles.isHovered
                )}
                id={`node.${node.id}`}
                style={{
                    left: node.x, top: node.y, width: node.width, borderColor: theClass?.colour, "--element-colour": theClass?.colour
                } as React.CSSProperties}
            >
                <div
                    className={clsx(
                        "doNotPan bg-seashell border group-hover/element:bg-mistyrose overflow-visible border-inherit transition-opacity rounded-lg",
                        styles.nodeCard,
                        isSelected ? "border-2 p-[7px] shadow-xl" : "p-[8px] shadow-md",
                        isDragging && "opacity-20",
                    )}
                    ref={drag}
                    onClick={(e: MouseEvent) => {
                        onMousedownSelectable(e)
                        e.stopPropagation()
                    }}
                    onDoubleClick={(e: MouseEvent) => e.stopPropagation()} // prevent this bubbling to map
                    onMouseEnter={() => { setIsHovered(true) }}
                    onMouseLeave={() => { setIsHovered(false) }}
                >
                    <ElementHeader element={node} showClassSelectIfEmpty={isSelected} />

                    <TextElement element={node} elementType={"node"} />

                    <ResizeElement element={{ id: node.id, width: node.width }} elementType={"node"} />
                </div>
            </div>
        </ElementContext.Provider >
    )
}
