import { clsx } from "@mantine/core"
import { IconPencil } from "@tabler/icons"
import { Arrow, ArrowEnd } from "../../app/schema"
import { useSelectable } from "../../etc/useSelectable"
import { LocalElement, useLocalElement } from "../../state/localReducer"
import { useClass } from "../../state/mapSelectors"
import { ElementHeader } from "../element/ElementHeader"
import { ResizeElement } from "../element/ResizeElement"
import { TextElement } from "../element/TextElement"
import { useMapId } from "../Map"
import { ElementContext } from "../properties/useElementId"
import { AddArrowheadButton } from "./AddArrowheadButton"
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

    const theClass = useClass(arrow?.classId)

    if (!source || !dest) {
        return <></>
    }

    const emptyMode = !arrow.content && !arrow.classId && !isSelected
    const colour = isSelected ? "indigo" : (theClass ? theClass.colour : "#BE90D4")
    return (
        <ElementContext.Provider value={{ elementType: "node", elementId: arrow.id }}>
            <SvgArrow
                arrowId={arrow.id}
                source={{ ...source, arrowHead: arrow.source.arrowHead, type: arrow.source.property ? "property" : "element" }}
                dest={{ ...dest, arrowHead: arrow.dest.arrowHead, type: arrow.source.property ? "property" : "element" }}
                colour={colour}
            >
                <div
                    className={clsx(`z-100 bg-white border-4 rounded-2xl hover:border-opacity-100 element-container p-0.5`,
                        emptyMode && "w-8 h-8 rounded-full opacity-80 hover:opacity-100",
                        isSelected ? "border-opacity-100" : "border-opacity-50",
                    )}
                    style={{
                        borderColor: colour,
                        ...(!emptyMode ? { width: arrow.width } : {})
                    }}
                    onMouseDown={onMousedownSelectable}
                    onDoubleClick={e => e.stopPropagation()}
                >
                    {isSelected && <>
                        <AddArrowheadButton
                            arrow={arrow}
                            colour={colour}
                            isLeft={true}
                            isSource={source.x < dest.x} />
                        <AddArrowheadButton
                            arrow={arrow}
                            colour={colour}
                            isLeft={false}
                            isSource={source.x >= dest.x} />
                    </>}
                    <div>
                        {emptyMode ?
                            <IconPencil size={20} className={`m-auto stroke-${colour}-500 opacity-70 hover:opacity-100`} />
                            :
                            <>
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