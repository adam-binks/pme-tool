import { IconChevronDownRight } from "@tabler/icons"
import { useState } from "react"
import { useFirestore } from "react-redux-firebase"
import { useThrottle } from "use-lodash-debounce-throttle"
import { useAppDispatch } from "../../app/hooks"
import { elementType } from "../../app/schema"
import { enact } from "../../etc/firestoreHistory"
import { updateElementCommand } from "../../state/mapFunctions"
import { useMapId } from "../Map"

export function ResizeElement({
    element,
    elementType,
}: {
    element: {id: string, width: number},
    elementType: elementType,
}) {
    const dispatch = useAppDispatch()
    const firestore = useFirestore()
    const mapId = useMapId()

    const [dragStart, setDragStart] = useState<{ x: number, width: number } | undefined>(undefined)

    const setWidth = useThrottle((newWidth: number) => {
        return enact(dispatch, mapId,
            updateElementCommand(firestore, mapId, element.id, elementType, { width: element.width }, { width: newWidth })
        )
    }, 100)

    return (
        <div
            className="absolute opacity-0 bottom-0.5 right-0.5 group-hover/element:opacity-100 doNotPan cursor-ew-resize"
            onDragStart={(e) => {
                setDragStart({ x: e.clientX, width: element.width })
                e.stopPropagation()
            }}
            draggable
            onDragEnd={(e) => {
                if (!dragStart) {
                    console.error("Error: dragStart not set")
                    return
                }
                const dx = e.clientX - dragStart.x
                setWidth(dragStart.width + dx)
                e.stopPropagation()
            }}
        >
            <IconChevronDownRight className="pointer-events-none" size={16} color={"#bbb"} />
        </div>
    )
}