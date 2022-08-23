import { useContext, useRef, useState } from "react"
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

    return (
        <button
            style={addingArrowFrom === node.id ? {backgroundColor: "blue"} : undefined}
            onClick={() => dispatch(setAddingArrowFrom({
                mapId, 
                addingArrowFrom: addingArrowFrom === node.id ? undefined : node.id
            }))}
            onBlur={() => dispatch(setAddingArrowFrom({mapId, addingArrowFrom: undefined}))}
        >
            Add arrow
        </button>
    )
}