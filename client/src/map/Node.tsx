import { useDrag } from "react-dnd";
import { useAppSelector } from "../app/hooks";
import { NodeOnMap } from "../common/mapActions";
import { ItemTypes } from "../ItemTypes";
import styles from "./Node.module.css";

interface NodeProps {
    nodeOnMap: NodeOnMap,
}
export default function Node({ nodeOnMap }: NodeProps) {
    const [{ isDragging }, drag] = useDrag(
        () => ({
            type: ItemTypes.NODE,
            item: {
                id: nodeOnMap._id,
                x: nodeOnMap.x,
                y: nodeOnMap.y
            },
            collect: (monitor) => ({
                isDragging: monitor.isDragging(),
            }),
        }),
        [nodeOnMap],
    )

    if (isDragging) {
        return <div ref={drag} /> // hide the element while dragging
    }
    return (
        <div
            className={`${styles.Node} doNotPan`}
            style={{ left: nodeOnMap.x, top: nodeOnMap.y }}
            ref={drag}
        >
            <p className="doNotPan">{nodeOnMap.node.name} {nodeOnMap._id}</p>
        </div>
    )
}