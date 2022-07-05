import { Action } from "@logux/core"
import { createReducer } from "@reduxjs/toolkit"
import { openPane, closePane } from "../common/mapActions"

export type PanesState = { id: string }[]

const initialState: PanesState = [{id: "74ab7f102ea0c3d6427145b8"}, {id: "1a0db562763379afc7b4e6cc"}]

export default createReducer(initialState, (builder) => {
    builder
        .addCase(openPane, (state, action) => {
            state.push(action.pane)
        })

        .addCase(closePane, (state, action) => {
            return state.filter((_, index) => index !== action.paneIndex)
        })
})