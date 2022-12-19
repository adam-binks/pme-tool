import { ActionIcon, clsx } from "@mantine/core"
import { IconArrowLeft, IconArrowRight, TablerIconProps } from "@tabler/icons"
import React from "react"
import { useFirestore } from "react-redux-firebase"
import { useAppDispatch } from "../../app/hooks"
import { Arrow } from "../../app/schema"
import { enact } from "../../etc/firestoreHistory"
import { updateElementCommand } from "../../state/mapFunctions"
import { useMapId } from "../Map"

export function AddArrowheadButton({
    arrow,
    colour,
    isLeft,
    isSource,
}: {
    arrow: Arrow
    colour: string
    isLeft: boolean
    isSource: boolean
}) {
    const mapId = useMapId()
    const dispatch = useAppDispatch()
    const firestore = useFirestore()

    const end = isSource ? "source" : "dest"
    const currentVal = arrow[end].arrowHead

    const iconProps: TablerIconProps = {
        className: "doNotPan"
    }

    return (
        <ActionIcon
            className={clsx("absolute -z-10 bg-white doNotPan",
                isLeft && "left-0 -mx-5 rounded-l-full",
                !isLeft && "right-0 -mx-5 rounded-r-full",
            )}
            style={currentVal === "arrow" ? {backgroundColor: colour} : {}}
            onClick={(e: React.MouseEvent) => {
                enact(dispatch, mapId, updateElementCommand(firestore, mapId, arrow.id, "arrow",
                    { [end]: arrow[end] },
                    { [end]: { ...arrow[end], arrowHead: (currentVal === "arrow" ? null : "arrow") } },
                ))
                e.stopPropagation()
            }}
            onMouseDown={(e: React.MouseEvent) => {e.stopPropagation()}} // prevent selection
            size="sm"
        >
            {isLeft && <IconArrowLeft {...iconProps} />}
            {!isLeft && <IconArrowRight {...iconProps} />}
        </ActionIcon>
    )
}