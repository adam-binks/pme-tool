import { useContext } from "react"
import Xarrow from "react-xarrows"
import { useAppSelector } from "../../app/hooks"
import { Pane } from "../../reducers/paneReducer"
import { MapContext } from "../Map"

interface MouseFollowerProps {
    mouseX: number
    mouseY: number
    strokeWidthScaler: number
    correctForMapOffset: (screenX: number, screenY: number, useHeightInstead: boolean) => { x: number, y: number }
}
export function MouseFollower({ strokeWidthScaler, mouseX, mouseY, correctForMapOffset }: MouseFollowerProps) {
    const mapId = useContext(MapContext)
    const addingArrowFrom = useAppSelector(state => state.panes.find(
        (pane: Pane) => pane.id === mapId)?.addingArrowFrom
    )

    return (
        <>
            {addingArrowFrom && <>
                <div id="mouseFollower" style={{ position: "absolute", left: mouseX, top: mouseY, pointerEvents: "none" }} />
                <Xarrow
                    start={`addingArrowFromButton`}
                    end={"mouseFollower"}
                    strokeWidth={3 * strokeWidthScaler}
                    curveness={0}
                    divContainerStyle={{ pointerEvents: "none" }}
                    SVGcanvasStyle={{ pointerEvents: "none" }}
                />
            </>}
        </>
    )
}