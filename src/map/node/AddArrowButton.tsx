import { ActionIcon } from "@mantine/core"
import { IconArrowNarrowRight, IconArrowRight } from "@tabler/icons"
import { MouseEvent, useContext, useRef, useState } from "react"
import { useAppDispatch, useAppSelector } from "../../app/hooks"
import { Node } from "../../app/schema"
import { Pane, setAddingArrowFrom } from "../../reducers/paneReducer"
import { MapContext } from "../Map"

interface AddArrowButtonProps {
    node: Node
}
export function AddArrowButton({ node }: AddArrowButtonProps) {
    const dispatch = useAppDispatch()
    const mapId = useContext(MapContext)
    const addingArrowFrom = useAppSelector(state => state.panes.find(
        (pane: Pane) => pane.id === mapId)?.addingArrowFrom
    )

    const addingFromThis = addingArrowFrom === node.id

    return (
        <ActionIcon
            style={{
                position: "absolute",
                right: -18,
                bottom: 10,
            }}
            onClick={(e: MouseEvent) => {
                dispatch(setAddingArrowFrom({
                    mapId,
                    addingArrowFrom: addingFromThis ? undefined : node.id
                }))
                addingFromThis && e.stopPropagation()
            }}
            variant={addingFromThis ? "filled" : "outline"}
            radius="xl"
            size="lg"
            color="yellow"
            id={addingFromThis ? "addingArrowFromButton" : ""}
            title="Add arrow"
        >
            <IconArrowNarrowRight />
        </ActionIcon>
    )
}