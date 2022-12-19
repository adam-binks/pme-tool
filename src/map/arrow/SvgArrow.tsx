import { clsx } from "@mantine/core"
import { useEffect } from "react"
import { useAppDispatch } from "../../app/hooks"
import { setLocalElement } from "../../state/localReducer"
import { useMapId } from "../Map"

const SVG_MARGIN = 10 // leave some gap around the edge of the svg canvas to account for stroke width
const NODE_WIDTH = 200

interface SvgArrowProps {
    children: React.ReactNode,
    arrowId: string,
    source: { x: number, y: number }
    dest: { x: number, y: number }
    colour: string,
}
export function SvgArrow({ children, arrowId, source, dest, colour }: SvgArrowProps) {
    const dispatch = useAppDispatch()
    const mapId = useMapId()

    const sourceX = source.x// + NODE_WIDTH / 2
    const destX = dest.x// + NODE_WIDTH / 2

    const x = Math.min(sourceX, destX) - SVG_MARGIN
    const y = Math.min(source.y, dest.y) - SVG_MARGIN

    const w = Math.abs(sourceX - destX) + SVG_MARGIN * 2
    const h = Math.abs(source.y - dest.y) + SVG_MARGIN * 2

    const sX = sourceX - x
    const sY = source.y - y

    const dX = destX - x
    const dY = dest.y - y

    const localMidpointX = w / 2
    const localMidpointY = h / 2

    useEffect(() => {
        const arrowDotOffset = 0
        dispatch(setLocalElement({
            mapId,
            elementId: arrowId,
            element: {
                elementType: "arrow",
                arrowDot: {
                    x: x + localMidpointX + arrowDotOffset,
                    y: y + localMidpointY + arrowDotOffset
                }
            }
        }))
    }, [arrowId, localMidpointX, localMidpointY])

    return (
        <div className="absolute -z-10" style={{ left: x, top: y }}>
            <svg width={w} height={h} pointerEvents="stroke">
                <path
                    className={clsx(
                        "opacity-50 hover:opacity-100",
                    )}
                    style={{stroke: colour}}
                    d={`M ${sX} ${sY} L ${dX} ${dY}`}
                    strokeWidth={5}
                />
            </svg>
            <div
                onClick={(e) => e.stopPropagation()}
                className={"absolute z-10 -translate-x-1/2 -translate-y-1/2"}
                style={{
                    left: localMidpointX,
                    top: localMidpointY,
                }}
            >
                {children}
            </div>
        </div>
    )
}