import { clsx } from "@mantine/core"

const MARGIN = 10
const NODE_WIDTH = 200

interface SvgArrowProps {
    children: React.ReactNode,
    source: { x: number, y: number }
    dest: { x: number, y: number }
    colour: string,
}
export function SvgArrow({ children, source, dest, colour }: SvgArrowProps) {
    const sourceX = source.x + NODE_WIDTH / 2
    const destX = dest.x + NODE_WIDTH / 2

    const x = Math.min(sourceX, destX) - MARGIN
    const y = Math.min(source.y, dest.y) - MARGIN

    const w = Math.abs(sourceX - destX) + MARGIN * 2
    const h = Math.abs(source.y - dest.y) + MARGIN * 2

    const sX = sourceX - x
    const sY = source.y - y

    const dX = destX - x
    const dY = dest.y - y

    return (
        <div style={{ position: "absolute", left: x, top: y, zIndex: -1 }}>
            <svg width={w} height={h} pointerEvents="stroke">
                <path
                    className={clsx(
                        "opacity-50 hover:opacity-100",
                        colour === "indigo" && "stroke-indigo-500",
                        colour === "purple" && "stroke-purple-500",
                    )}
                    d={`M ${sX} ${sY} L ${dX} ${dY}`}
                    strokeWidth={5}
                />
            </svg>
            <div
                onClick={(e) => e.stopPropagation()}
                style={{
                    position: "absolute",
                    left: w / 2,
                    top: h / 2,
                    transform: "translate(-50%, -50%)"
                }}
            >
                {children}
            </div>
        </div>
    )
}