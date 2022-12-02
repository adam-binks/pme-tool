import { ActionIcon } from "@mantine/core"
import { IconArrowNarrowRight } from "@tabler/icons"
import { MouseEvent } from "react"
import { useAppDispatch, useAppSelector } from "../../app/hooks"
import { Node } from "../../app/schema"
import { Pane, setAddingArrowFrom } from "../../state/paneReducer"
import { useMapId } from "../Map"

interface AddArrowButtonProps {
    node: Node
}
export function AddArrowButton({ node }: AddArrowButtonProps) {
    const dispatch = useAppDispatch()
    const mapId = useMapId()
    const addingArrowFrom = useAppSelector(state => state.panes.find(
        (pane: Pane) => pane.id === mapId)?.addingArrowFrom
    )

    const addingFromThis = addingArrowFrom === node.id

    return (
        <ActionIcon
            onClick={(e: MouseEvent) => {
                dispatch(setAddingArrowFrom({
                    mapId,
                    addingArrowFrom: addingFromThis ?
                        undefined
                        :
                        { elementId: node.id, elementType: "node", property: null }
                }))
                addingFromThis && e.stopPropagation()
            }}
            variant={addingFromThis ? "filled" : "subtle"}
            radius="xl"
            size="sm"
            color={addingFromThis ? "yellow" : "gray"}
            id={addingFromThis ? "addingArrowFromButton" : ""}
            title="Add arrow"
        >
            <IconArrowNarrowRight />
        </ActionIcon>
    )
}