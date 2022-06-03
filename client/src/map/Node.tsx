import { useAppSelector } from "../app/hooks";
import { NodeOnMap } from "../common/mapActions";
import styles from "./Node.module.css";

interface NodeProps {
    nodeOnMap: NodeOnMap,
}
export default function Node({ nodeOnMap }: NodeProps) {
    return (
        <div 
            className={styles.Node}
            style={{left: nodeOnMap.x, top: nodeOnMap.y}}
        >
            <p>Node {nodeOnMap.node.name} {nodeOnMap._id}</p>
        </div>
    )
}