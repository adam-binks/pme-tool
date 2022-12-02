import { clsx } from "@mantine/core"
import { useHover } from "@mantine/hooks"
import { useFirestore } from "react-redux-firebase"
import { useAppDispatch, useAppSelector } from "../../app/hooks"
import { ArrowEnd, ArrowEndProperty, Element, getElementType } from "../../app/schema"
import { generateId } from "../../etc/helpers"
import { addArrow } from "../../state/mapFunctions"
import { useConnectedArrows } from "../../state/mapSelectors"
import { Pane, setAddingArrowFrom } from "../../state/paneReducer"
import { DEFAULT_ARROW_WIDTH } from "../arrow/Arrow"
import { useMapId } from "../Map"

export function ArrowDot({
    element,
    property,
}: {
    element: Element
    property: ArrowEndProperty | undefined
}) {
    const dispatch = useAppDispatch()
    const firestore = useFirestore()
    const mapId = useMapId()
    const elementType = getElementType(element)

    const addingArrowFrom = useAppSelector(state => state.panes.find(
        (pane: Pane) => pane.id === mapId)?.addingArrowFrom
    ) as ArrowEnd | undefined
    const addingFromThis = addingArrowFrom?.elementId === element.id &&
        addingArrowFrom.elementType === elementType

    const connectedArrows = useConnectedArrows(element.id, elementType, property)

    // is it hovered, use mantine
    const {hovered, ref} = useHover()

    return (
        <div
            ref={ref}
            className={clsx(
                "absolute z-20 w-3 h-3 opacity-70 rounded-full -translate-x-1/2 -translate-y-1/2 group/dot",
                connectedArrows?.length > 0 ? "bg-pink-600" : "bg-pink-500",
                "flex items-center justify-center text-white",
                "hover:opacity-100 hover:scale-125",
                addingFromThis && "bg-yellow-600",
                addingArrowFrom && !addingFromThis && "scale-150 opacity-80",
            )}
            style={{ fontSize: "0.6rem" }}
            onClick={(e) => {
                if (addingArrowFrom && !addingFromThis) {
                    addArrow(firestore, dispatch, mapId, {
                        id: generateId(),
                        source: addingArrowFrom,
                        dest: { elementId: element.id, elementType, property: property ?? null },
                        content: "",
                        classId: null,
                        colour: "purple",
                        width: DEFAULT_ARROW_WIDTH,
                    })
                    dispatch(setAddingArrowFrom({ mapId, addingArrowFrom: undefined }))
                } else {
                    dispatch(setAddingArrowFrom({
                        mapId,
                        addingArrowFrom: addingFromThis ?
                            undefined
                            :
                            { elementId: element.id, elementType, property: property ?? null }
                    }))
                }
                e.stopPropagation()
            }}
        >
            {!hovered && connectedArrows?.length > 0 ? connectedArrows.length : "+" }
        </div>
    )
}