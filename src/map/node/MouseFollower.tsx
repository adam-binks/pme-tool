import { useContext, useEffect, useState } from "react"
import Xarrow, { useXarrow } from "react-xarrows"
import { useAppSelector } from "../../app/hooks"
import { Pane } from "../../reducers/paneReducer"
import { MapContext } from "../Map"

interface MouseFollowerProps {
    strokeWidthScaler: number
    correctForMapOffset: (screenX: number, screenY: number, useHeightInstead: boolean) => { x: number, y: number }
}
export function MouseFollower({ strokeWidthScaler, correctForMapOffset }: MouseFollowerProps) {
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
    const mapId = useContext(MapContext)
    const addingArrowFrom = useAppSelector(state => state.panes.find(
        (pane: Pane) => pane.id === mapId)?.addingArrowFrom
    )

    useEffect(() => {
        const onMouseMove = (e: MouseEvent) => {
            setMousePos(correctForMapOffset(e.clientX, e.clientY, true))
        }
        window.addEventListener("mousemove", onMouseMove)
        return () => {
            window.removeEventListener("mousemove", onMouseMove)
        }
    }, [])

    return (
        <>
            {addingArrowFrom && <>
                <div id="mouseFollower" style={{ position: "absolute", left: mousePos.x, top: mousePos.y }} />
                <Xarrow
                    start={`node.${addingArrowFrom}`}
                    end={"mouseFollower"}
                    strokeWidth={5 * strokeWidthScaler}
                    curveness={0}
                />
            </>}
        </>
    )
}