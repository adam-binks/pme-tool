import { clsx } from "@mantine/core"
import { IconPencil } from "@tabler/icons"
import { Arrow, ArrowEnd } from "../../app/schema"
import { useSelectable } from "../../etc/useSelectable"
import { LocalElement, useLocalElement } from "../../state/localReducer"
import { ArrowDot } from "../element/ArrowDot"
import { ElementHeader } from "../element/ElementHeader"
import { ResizeElement } from "../element/ResizeElement"
import { TextElement } from "../element/TextElement"
import { useMapId } from "../Map"
import { AddClassSelect } from "../properties/AddClassSelect"
import { ElementContext } from "../properties/useElementId"
import { ArrowOverFlowMenu } from "./ArrowOverflowMenu"
import { SvgArrow } from "./SvgArrow"

export const DEFAULT_ARROW_WIDTH = 112 // px

interface ArrowProps {
    arrow: Arrow
    strokeWidthScaler: number
}
export default function ArrowComponent({ arrow, strokeWidthScaler }: ArrowProps) {
    const { isSelected, onMousedownSelectable } = useSelectable(arrow.id, "arrow")
    const mapId = useMapId()
    
    function getCoords(arrowEnd: ArrowEnd, localElement: LocalElement): { x: number, y: number } | undefined {
        if (localElement) {
            if (arrowEnd.property) {
                const yOffset = localElement?.propertyArrowDotHeights?.[arrowEnd.property.name] || 0
                return {
                    x: localElement.arrowDot.x + 20,
                    y: localElement.arrowDot.y + yOffset
                }
            } else {
                return localElement.arrowDot
            }
        }
    }
    const sourceLocalElement = useLocalElement(mapId, arrow.source.elementId, (localElement) => localElement)
    const source = sourceLocalElement && getCoords(arrow.source, sourceLocalElement)
    
    const destLocalElement = useLocalElement(mapId, arrow.dest.elementId, (localElement) => localElement)
    const dest = destLocalElement && getCoords(arrow.dest, destLocalElement)

    if (!source || !dest) {
        return <></>
    }

    const emptyMode = !arrow.content && !arrow.classId && !isSelected
    const colour = isSelected ? "indigo" : arrow.colour
    return (
        <ElementContext.Provider value={{ elementType: "node", elementId: arrow.id }}>
            <SvgArrow
                arrowId={arrow.id}
                source={source}
                dest={dest}
                colour={colour}
            >
                <div
                    className={clsx(`z-100 bg-white border-4 rounded-xl hover:border-opacity-100 element-container`,
                        emptyMode && "w-8 opacity-80 hover:opacity-100",
                        isSelected ? "border-opacity-100" : "border-opacity-50",
                        colour === "indigo" && "border-indigo-500",
                        colour === "purple" && "border-purple-500",
                    )}
                    style={!emptyMode ? { width: arrow.width } : {}}
                    onMouseDown={onMousedownSelectable}
                    onDoubleClick={e => e.stopPropagation()}
                >
                    {/* {(!emptyMode || arrow.classId) && <AddClassSelect
                        element={arrow}
                        elementType={"arrow"}
                        zoomedOutMode={false}
                    />} */}
                    <div>
                        {/* <div className="absolute -translate-x-1/2 -translate-y-1/2 ">
                            <ArrowDot element={arrow} property={undefined} />
                        </div> */}
                        {emptyMode ?
                            <IconPencil className={`stroke-${colour}-500 opacity-70 hover:opacity-100`} />
                            :
                            <>
                                {/* <div className="absolute z-10 right-2">
                                    <ArrowOverFlowMenu arrow={arrow} />
                                </div> */}
                                <ElementHeader element={arrow} showClassSelectIfEmpty={isSelected} />
                                {(arrow.content || isSelected) && <TextElement
                                    element={arrow}
                                    elementType="arrow"
                                    codemirrorProps={(isSelected && !arrow.content) ? { placeholder: "Content..." } : {}}
                                />}
                                <ResizeElement element={{ id: arrow.id, width: arrow.width }} elementType={"arrow"} />
                            </>
                        }
                    </div>
                </div>
            </SvgArrow>
        </ElementContext.Provider >
    )
}