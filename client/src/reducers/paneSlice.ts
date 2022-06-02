import { Action } from "@logux/core"
import { openPane, closePane } from "../common/mapActions"

export type PanesState = { id: string }[]

export function panesReducer(state: PanesState = [{id: "74ab7f102ea0c3d6427145b8"}, {id: "1a0db562763379afc7b4e6cc"}], action: Action): PanesState {
    if (openPane.match(action)) {
        return [...state, action.pane]
    }

    if (closePane.match(action)) {
        return state.filter((_, index) => index !== action.paneIndex)
    }

    return state
}