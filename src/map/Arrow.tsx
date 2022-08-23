import Xarrow from "react-xarrows"
import { Arrow } from "../app/schema"
import styles from "./Arrow.module.css"

interface ArrowProps {
    arrow: Arrow
    strokeWidthScaler: number
}
export default function ArrowComponent({ arrow, strokeWidthScaler }: ArrowProps) {
    var selfLoopArrowProps = {}
    if (arrow.source === arrow.dest) {
        selfLoopArrowProps = {
            _cpx1Offset: 50 * strokeWidthScaler,
            _cpy1Offset: -50 * strokeWidthScaler,
            _cpx2Offset: 50 * strokeWidthScaler,
            _cpy2Offset: 30 * strokeWidthScaler,
            startAnchor: "right",
            endAnchor: "right",
        }
    }
    return (
        <Xarrow 
            start={`node.${arrow.source}`}
            end={`node.${arrow.dest}`}
            curveness={0.5}
            strokeWidth={3 * strokeWidthScaler}
            {...selfLoopArrowProps}
        />
    )
}