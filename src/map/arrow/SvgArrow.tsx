import { clsx } from "@mantine/core"
import { range } from "lodash"
import { useEffect } from "react"
import { useAppDispatch } from "../../app/hooks"
import { ArrowHead } from "../../app/schema"
import { setLocalElement } from "../../state/localReducer"
import { useMapId } from "../Map"

const SVG_MARGIN = 10 // leave some gap around the edge of the svg canvas to account for stroke width

interface SvgArrowProps {
    children: React.ReactNode,
    arrowId: string,
    source: { x: number, y: number, arrowHead: ArrowHead, type: "element" | "property" }
    dest: { x: number, y: number, arrowHead: ArrowHead, type: "element" | "property" }
    colour: string,
}
export function SvgArrow({ children, arrowId, source, dest, colour }: SvgArrowProps) {
    const dispatch = useAppDispatch()
    const mapId = useMapId()

    const sourceX = source.x
    const destX = dest.x

    const x = Math.min(sourceX, destX) - SVG_MARGIN
    const y = Math.min(source.y, dest.y) - SVG_MARGIN

    const w = Math.abs(sourceX - destX) + SVG_MARGIN * 2
    const h = Math.abs(source.y - dest.y) + SVG_MARGIN * 2

    const sX = sourceX - x
    const sY = source.y - y

    const dX = destX - x
    const dY = dest.y - y

    const leftmost = sourceX < destX ? source : dest
    const offset = 0 // TODO - fix for left-up nodes:  leftmost.type === "property" ? 0.15 : 0
    const localMidpointX = w * (0.5 + offset)
    const localMidpointY = h * (0.5 - offset)

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

    const pathStyles: React.SVGProps<SVGPathElement> | React.SVGProps<SVGPolylineElement> = {
        className: clsx(
            "hover:opacity-100",
        ),
        style: { stroke: colour },
        strokeWidth: 5,
    }

    function getPath(arrowHead: ArrowHead, otherArrowHead: ArrowHead, start: { x: number, y: number }, end: { x: number, y: number }) {
        var arrowheads = undefined
        if (arrowHead === "arrow" || otherArrowHead === "arrow") {
            const ARROW_SPACING = 15
            const distance = Math.sqrt((end.x - start.x) ** 2 + (end.y - start.y) ** 2)
            const numArrows = distance / ARROW_SPACING

            const points = range(0, numArrows).map((i) => {
                const x = start.x + (end.x - start.x) * i / numArrows
                const y = start.y + (end.y - start.y) * i / numArrows
                return `${x},${y}`
            }).join(" ")
            const reversed = (arrowHead !== "arrow") ? "-reversed" : "" 
            arrowheads = <polyline
                points={points}
                markerMid={`url(#arrowhead${reversed}-${colour})`}
                className={clsx(
                    "hover:opacity-100",
                )}
                strokeWidth={3}
                fill={colour}
            />
        }

        return <>
            <path
                d={`M ${start.x} ${start.y} L ${end.x} ${end.y}`}
                {...pathStyles}
            />
            {arrowheads && arrowheads}
        </>
    }

    return (
        <div className="absolute -z-10" style={{ left: x, top: y }}>
            <svg width={w} height={h} pointerEvents="stroke" className="opacity-90">
                <defs>
                    <marker id={`arrowhead-${colour}`} markerWidth="4" markerHeight="6"
                        orient="auto" refY="2">
                        <path d="M2,0 L4,2 2,4" stroke={colour} fill="none" />
                    </marker>
                    <marker id={`arrowhead-reversed-${colour}`} markerWidth="4" markerHeight="6"
                        orient="auto" refY="2">
                        <path d="M2,4 L0,2 2,0" stroke={colour} fill="none" />
                    </marker>
                </defs>
                {getPath(source.arrowHead, dest.arrowHead, { x: localMidpointX, y: localMidpointY }, { x: sX, y: sY })}
                {getPath(dest.arrowHead, source.arrowHead, { x: localMidpointX, y: localMidpointY }, { x: dX, y: dY })}
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