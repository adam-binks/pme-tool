import styles from "./Arrow.module.css";

const MARGIN = 10
const NODE_WIDTH = 200

interface SvgArrowProps {
    source: { x: number, y: number }
    dest: { x: number, y: number }
}
export function SvgArrow({ source, dest }: SvgArrowProps) {


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
                    className={styles.svgArrow}
                    d={`M ${sX} ${sY} L ${dX} ${dY}`}
                    stroke="blue"
                    strokeWidth={5}
                />
            </svg>
            <div style={{
                position: "absolute",
                left: w / 2,
                top: h / 2,
                transform: "translate(-50%, -50%)"
            }}>
            </div>
        </div>
    )
}