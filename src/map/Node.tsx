import { useDrag } from "react-dnd";
import { useAppSelector } from "../app/hooks";
import { Node as NodeType } from "../app/schema";
import { ItemTypes } from "../ItemTypes";
import styles from "./Node.module.css";

interface NodeProps {
    node: NodeType,
}
export default function Node({ node }: NodeProps) {
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

    if (isDragging) {
        return <div ref={drag} /> // hide the element while dragging
    }
    return (
        <div
            className={`${styles.Node} doNotPan`}
            style={{ left: node.x, top: node.y }}
            ref={drag}
        >
            <p className="doNotPan">{node.name} {node.id}</p>
        </div>
    )
}