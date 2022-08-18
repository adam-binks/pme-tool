import Xarrow from "react-xarrows"
import { Arrow } from "../app/schema"
import styles from "./Arrow.module.css"

interface ArrowProps {
    arrow: Arrow
}
export default function ArrowComponent({ arrow }: ArrowProps) {
    return (
        <Xarrow 
            start={`node.${arrow.source}`}
            end={`node.${arrow.dest}`}
        />
    )
}