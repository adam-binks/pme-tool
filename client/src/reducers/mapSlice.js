// import { createSlice } from "@reduxjs/toolkit";

export default function mapReducer(state = {}, action) {
    if (action.type === 'map/rename') {
        state[action.mapId] = {name: action.name, ...state[action.mapId]}
    }
}