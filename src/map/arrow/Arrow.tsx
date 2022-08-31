import { useContext } from "react"
import { useFirestore } from "react-redux-firebase"
import Xarrow, { useXarrow } from "react-xarrows"
import { Arrow, Node } from "../../app/schema"
import { deleteArrow } from "../../reducers/mapFunctions"
import styles from "./Arrow.module.css"
import { MapContext } from "../Map"
import { SvgArrow } from "./SvgArrow"

interface ArrowProps {
    arrow: Arrow
    source: {x: number, y: number}
    dest: {x: number, y: number}
    strokeWidthScaler: number
}
export default function ArrowComponent({ arrow, source, dest, strokeWidthScaler }: ArrowProps) {
    // const firestore = useFirestore()
    // const mapId = useContext(MapContext)

    // const sourceId = `node.${arrow.source}`
    // const destId = `node.${arrow.dest}`

    // const updateXArrow = useXarrow()

    // if (!document.getElementById(sourceId) || !document.getElementById(destId)) {
    //     setTimeout(updateXArrow, 200)
    //     console.log('no id ', {source: document.getElementById(sourceId), dest: document.getElementById(destId)})
    //     return (<p>No id</p>)
    // }

    // // console.log({source: `node.${arrow.source}`, dest: `node.${arrow.dest}`})

    // var selfLoopArrowProps = {}
    // if (arrow.source === arrow.dest) {
    //     selfLoopArrowProps = {
    //         _cpx1Offset: 50 * strokeWidthScaler,
    //         _cpy1Offset: -50 * strokeWidthScaler,
    //         _cpx2Offset: 50 * strokeWidthScaler,
    //         _cpy2Offset: 30 * strokeWidthScaler,
    //         startAnchor: "right",
    //         endAnchor: "right",
    //     }
    // }
    return (
        <SvgArrow
            source={source}
            dest={dest}
        />
    )

    // return (
    //     <Xarrow 
    //         start={`node.${arrow.source}`}
    //         end={`node.${arrow.dest}`}
    //         curveness={0.5}
    //         strokeWidth={3 * strokeWidthScaler}
    //         {...selfLoopArrowProps}
    //         labels={{middle: <button onClick={() => deleteArrow(firestore, mapId, arrow.id)}>Delete</button>}}
    //     />
    // )
}