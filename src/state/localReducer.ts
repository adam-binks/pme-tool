import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { useAppSelector } from "../app/hooks"
import { Property } from "../map/editor/exposeProperties"

// This is for computed, shared state (not persisted to Firebase)

export type LocalMapState = {
    mapId: string,
    classes: LocalClass[],
    elements: LocalElement[],
}
export type LocalClass = {
    id: string,
    properties: Property[],
}
const getBlankClassPartial = (): Partial<LocalClass> => ({ properties: [] })
export type LocalElement = LocalNode | LocalArrow
export type LocalNode = {
    id: string,
    classId: string,
    properties: Property[],
    height: number,
    width: number,
}
export type LocalArrow = {
    id: string,
    classId: string,
    properties: Property[],
}

export type LocalState = LocalMapState[]

const initialState: LocalState = []

const getOrCreateLocalMap = (state: LocalState, mapId: string): LocalMapState => {
    const localMap = state.find(localMap => localMap.mapId === mapId)
    if (localMap) {
        return localMap
    } else {
        const newLocalMap = { mapId, classes: [], elements: [] }
        state.push(newLocalMap)
        return newLocalMap
    }
}

export const localSlice = createSlice({
    name: 'local',
    initialState: initialState,
    reducers: {
        setLocalClass(state, action: PayloadAction<{ mapId: string, class: Partial<LocalClass> }>) {
            const map = getOrCreateLocalMap(state, action.payload.mapId)
            const existingClass = map.classes.find(c => c.id === action.payload.class.id)
            if (existingClass) {
                Object.assign(existingClass, action.payload.class)
            } else {
                map.classes.push({ ...getBlankClassPartial(), ...action.payload.class } as LocalClass)
            }
        }
    }
})
export const { setLocalClass } = localSlice.actions


export const useLocalClass = (mapId: string, classId: string): LocalClass | undefined =>
    useAppSelector(state =>
        state.local.find((map: LocalMapState) => map.mapId === mapId)?.classes.find((c: LocalClass) => c.id === classId)
    )

export const useClassProperties = (mapId: string, classId: string | null): Property[] =>
    useAppSelector(state =>
        classId ? (
            state.local.find((map: LocalMapState) => map.mapId === mapId)?.classes.find((c: LocalClass) => c.id === classId)?.properties || []
        ) : []
    )

export default localSlice.reducer