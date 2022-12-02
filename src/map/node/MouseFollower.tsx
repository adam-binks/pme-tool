import { useAppSelector } from "../../app/hooks"
import { Pane } from "../../state/paneReducer"
import { useMapId } from "../Map"

interface MouseFollowerProps {
    mouseX: number
    mouseY: number
    strokeWidthScaler: number
}
export function MouseFollower({ strokeWidthScaler, mouseX, mouseY }: MouseFollowerProps) {
    const mapId = useMapId()
    const addingArrowFrom = useAppSelector(state => state.panes.find(
        (pane: Pane) => pane.id === mapId)?.addingArrowFrom
    )

    return (
        <>
            {addingArrowFrom && <>
                <div id="mouseFollower" style={{
                    position: "absolute",
                    left: mouseX, 
                    top: mouseY, 
                    pointerEvents: "none"
                }} />
                {/* <Xarrow
                    start={`addingArrowFromButton`}
                    end={"mouseFollower"}
                    strokeWidth={3 * strokeWidthScaler}
                    curveness={0}
                    divContainerStyle={{ pointerEvents: "none" }}
                    SVGcanvasStyle={{ pointerEvents: "none" }}
                /> */}
            </>}
        </>
    )
}