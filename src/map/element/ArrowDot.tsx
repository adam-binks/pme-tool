import { clsx } from "@mantine/core"
import { useHover } from "@mantine/hooks"
import { useEffect } from "react"
import { useFirestore } from "react-redux-firebase"
import { useThrottle } from "use-lodash-debounce-throttle"
import { useAppDispatch, useAppSelector } from "../../app/hooks"
import { ArrowEnd, ArrowEndProperty, Element, getElementType } from "../../app/schema"
import { generateId } from "../../etc/helpers"
import { setPropertyArrowDotHeight, useLocalElement } from "../../state/localReducer"
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
    const localDotHeights : { [property: string]: number } | undefined = useLocalElement(
        mapId, element.id, (localElement) => localElement?.propertyArrowDotHeights
    )

    const addingArrowFrom = useAppSelector(state => state.panes.find(
        (pane: Pane) => pane.id === mapId)?.addingArrowFrom
    ) as ArrowEnd | undefined
    const addingFromThis = addingArrowFrom?.elementId === element.id
        && addingArrowFrom.elementType === elementType
        && addingArrowFrom.property?.name === property?.name

    const connectedArrows = useConnectedArrows(element.id, elementType, property)
    const { hovered, ref } = useHover()

    const throttledUpdateLocalElement = useThrottle((currentRef: HTMLDivElement, localDotHeights: { [property: string]: number }) => {
        const container = currentRef?.closest(".element-container")
        if (!property?.name || !container) return

        const globalY = currentRef?.getBoundingClientRect()?.y
        const localY = globalY - container.getBoundingClientRect().y

        const prevY = localDotHeights?.[property.name]
        if (prevY && Math.abs(localY - prevY) < 1) return // don't update for same value or floating point imprecision

        dispatch(setPropertyArrowDotHeight({
            mapId,
            elementId: element.id,
            property: property.name,
            height: localY,
        }))
    })
    useEffect(() => {
        throttledUpdateLocalElement(ref.current, localDotHeights)
    }, [ref.current, localDotHeights, element.content])

    return (
        <span
            ref={ref}
            title={addingFromThis ? "Cancel adding arrow" : "Add arrow"}
            className={clsx(
                "basis-3 flex-shrink-0 flex-grow-0 w-3 h-3 opacity-70 rounded-full doNotPan group/dot cursor-pointer",
                addingFromThis &&
                    "bg-yellow-600",
                    connectedArrows?.length > 0 ? 
                        "opacity-100" :
                        property ? "opacity-70" : "opacity-80",
                "inline-flex items-center justify-center text-darkplatinum",
                "hover:opacity-100 hover:scale-125",
                addingArrowFrom && !addingFromThis && "scale-150 opacity-80",
                property && "absolute left-0"
            )}
            style={{ fontSize: "0.6rem", backgroundColor: "#FEC89A" }}
            onClick={(e) => {
                if (addingArrowFrom && !(addingArrowFrom.elementId === element.id)) {
                    addArrow(firestore, dispatch, mapId, {
                        id: generateId(),
                        source: addingArrowFrom,
                        dest: { elementId: element.id, elementType, property: property ?? null, arrowHead: null },
                        content: "",
                        classId: null,
                        width: DEFAULT_ARROW_WIDTH,
                    })
                    dispatch(setAddingArrowFrom({ mapId, addingArrowFrom: undefined }))
                } else {
                    dispatch(setAddingArrowFrom({
                        mapId,
                        addingArrowFrom: addingFromThis ?
                            undefined
                            :
                            { elementId: element.id, elementType, property: property ?? null, arrowHead: null }
                    }))
                }
                e.stopPropagation()
            }}
        >
            {!hovered && connectedArrows?.length > 0 ? connectedArrows.length : "+"}
        </span>
    )
}