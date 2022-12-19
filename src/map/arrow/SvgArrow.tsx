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
    source: { x: number, y: number, arrowHead: ArrowHead }
    dest: { x: number, y: number, arrowHead: ArrowHead }
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

    const pathStyles: React.SVGProps<SVGPathElement> | React.SVGProps<SVGPolylineElement> = {
        className: clsx(
            "hover:opacity-100",
        ),
        style: { stroke: colour },
        strokeWidth: 5,
    }

    function getPath(arrowHead: ArrowHead, start: { x: number, y: number }, end: { x: number, y: number }) {
        var arrowheads = undefined
        if (arrowHead === "arrow") {
            const ARROW_SPACING = 15
            const distance = Math.sqrt((end.x - start.x) ** 2 + (end.y - start.y) ** 2)
            const numArrows = distance / ARROW_SPACING

            const points = range(0, numArrows).map((i) => {
                const x = start.x + (end.x - start.x) * i / numArrows
                const y = start.y + (end.y - start.y) * i / numArrows
                return `${x},${y}`
            }).join(" ")
            arrowheads = <polyline
                points={points}
                markerMid={`url(#arrowhead-${colour})`}
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
            <svg width={w} height={h} pointerEvents="stroke" className="opacity-50">
                <defs>
                    <marker id={`arrowhead-${colour}`} markerWidth="4" markerHeight="4"
                        orient="auto" refY="2">
                        <path d="M0,0 L4,2 0,4" fill={colour} />
                    </marker>
                </defs>
                {getPath(source.arrowHead, { x: localMidpointX, y: localMidpointY }, { x: sX, y: sY })}
                {getPath(dest.arrowHead, { x: localMidpointX, y: localMidpointY }, { x: dX, y: dY })}
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