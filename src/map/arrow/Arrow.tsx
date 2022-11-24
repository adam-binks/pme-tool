import { clsx } from "@mantine/core"
import { IconPencil } from "@tabler/icons"
import { Arrow } from "../../app/schema"
import { useSelectable } from "../../etc/useSelectable"
import { TextElement } from "../element/TextElement"
import { ElementContext } from "../properties/useElementId"
import { SvgArrow } from "./SvgArrow"

interface ArrowProps {
    arrow: Arrow
    source: { x: number, y: number }
    dest: { x: number, y: number }
    strokeWidthScaler: number
}
export default function ArrowComponent({ arrow, source, dest, strokeWidthScaler }: ArrowProps) {
    const { isSelected, onMousedownSelectable } = useSelectable(arrow.id, "arrow")

    const emptyMode = !arrow.content && !isSelected
    const colour = isSelected ? "indigo" : "purple"
    return (
        <ElementContext.Provider value={{ elementType: "node", elementId: arrow.id }}>
            <SvgArrow
                source={source}
                dest={dest}
                colour={colour}
            >
                <div className={clsx(`bg-white border-4 rounded-lg w-28 hover:border-opacity-100`,
                    emptyMode ? "w-8" : "w-28",
                    isSelected ? "border-opacity-100" : "border-opacity-50",
                    colour === "indigo" && "border-indigo-500",
                    colour === "purple" && "border-purple-500",
                )}
                    onMouseDown={onMousedownSelectable}
                >
                    {
                        emptyMode ?
                            <IconPencil color="grey" className="pointer-events-none" />
                            :
                            <TextElement
                                element={arrow}
                                elementType="arrow"
                                codemirrorProps={isSelected ? {autoFocus: true} : {}}
                            />
                    }
                </div>
            </SvgArrow>
        </ElementContext.Provider >
    )
}