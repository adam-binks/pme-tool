import { clsx } from "@mantine/core"
import { IconPencil } from "@tabler/icons"
import { Arrow } from "../../app/schema"
import { useSelectable } from "../../etc/useSelectable"
import { ArrowDot } from "../element/ArrowDot"
import { ResizeElement } from "../element/ResizeElement"
import { TextElement } from "../element/TextElement"
import { AddClassSelect } from "../properties/AddClassSelect"
import { ElementContext } from "../properties/useElementId"
import { ArrowOverFlowMenu } from "./ArrowOverflowMenu"
import { SvgArrow } from "./SvgArrow"

export const DEFAULT_ARROW_WIDTH = 112 // px

interface ArrowProps {
    arrow: Arrow
    source: { x: number, y: number }
    dest: { x: number, y: number }
    strokeWidthScaler: number
}
export default function ArrowComponent({ arrow, source, dest, strokeWidthScaler }: ArrowProps) {
    const { isSelected, onMousedownSelectable } = useSelectable(arrow.id, "arrow")

    const emptyMode = !arrow.content && !isSelected
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
                    className={clsx(`z-100 bg-white border-4 rounded-xl hover:border-opacity-100`,
                        emptyMode && "w-8 opacity-80 hover:opacity-100",
                        isSelected ? "border-opacity-100" : "border-opacity-50",
                        colour === "indigo" && "border-indigo-500",
                        colour === "purple" && "border-purple-500",
                    )}
                    style={!emptyMode ? { width: arrow.width } : {}}
                    onMouseDown={onMousedownSelectable}
                    onDoubleClick={e => e.stopPropagation()}
                >
                    {(!emptyMode || arrow.classId) && <AddClassSelect
                        element={arrow}
                        elementType={"arrow"}
                        zoomedOutMode={false}
                    />}
                    <div>
                        <ArrowDot element={arrow} property={undefined} />
                        {emptyMode ?
                            <IconPencil className={`stroke-${colour}-500 opacity-70 hover:opacity-100`} />
                            :
                            <>
                                <div className="absolute z-10 right-2">
                                    <ArrowOverFlowMenu arrow={arrow} theClass={undefined} />
                                </div>
                                <TextElement
                                    element={arrow}
                                    elementType="arrow"
                                    codemirrorProps={(isSelected && !arrow.content) ? { placeholder: "Content..." } : {}}
                                />
                                <ResizeElement element={{id: arrow.id, width: arrow.width}} elementType={"arrow"} />
                            </>
                        }
                    </div>
                </div>
            </SvgArrow>
        </ElementContext.Provider >
    )
}