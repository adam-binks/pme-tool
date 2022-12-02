import { useAppSelector } from "../app/hooks"
import { Arrow, ArrowEndProperty, Element, elementType } from "../app/schema"
import { useMapId } from "../map/Map"
import { useElementId } from "../map/properties/useElementId"


export function useFirestoreData(selector: (state: any) => any) {
    return useAppSelector(state => selector(state?.firestore?.data))
}

export function useElements(elementType: elementType, selector: (elements: any) => any) {
    const mapId = useMapId()
    const index = `${elementType}s.${mapId}`
    return useFirestoreData(
        (firestoreData) => firestoreData[index] && selector(firestoreData[index])
    )
}

export function useNodes(selector: (nodes: any) => any) {
    return useElements("node", selector)
}

export function useArrows(selector: (arrows: {[key: string]: Arrow}) => any) {
    return useElements("arrow", selector)
}

export function useConnectedArrows(elementId: string, elementType: elementType, property: ArrowEndProperty | undefined) {
    return useArrows((arrows) => Object.values(arrows).filter(
        (arrow) =>  [arrow.dest, arrow.source].some(
            (end) => end.elementId === elementId && end.elementType === elementType && end.property == property
        )
    ))
}

export function useElementsWithClass(elementType: elementType, classId: string, selector: (elementsOfClass: any) => any) {
    return useElements(elementType, (elements) => selector((Object.values(elements) as any)
        .filter((element: Element) => element?.classId === classId)))
}

export function useMap(selector: (map: any) => any) {
    const mapId = useMapId()
    return useFirestoreData(state => state?.maps && state.maps[mapId] && selector(state.maps[mapId]))
}

export function useSchema(selector: (schema: any) => any) {
    return useMap(map => map.schema && selector(map.schema))
}

export function useAbstractProperties(selector: (abstractProperties: any) => any) {
    return useSchema(schema => schema.properties && selector(schema.properties))
}

// export function elementHasTitle(element: Element, properties: AbstractProperty[]) {
//     const firstProp = element?.properties && element.properties[0]
//     if (!firstProp) { return false }
//     const abstractProp = properties.find(p => p.id === firstProp.abstractPropertyId)
//     return abstractProp?.type === "title"
// }

function useGetElement(elementId: string, elementType: elementType) {
    const mapId = useMapId()
    return useElements(elementType, (elements) => elements[elementId]) as Element | undefined
}

export function useElement() {
    const { elementId, elementType } = useElementId()
    return { element: useGetElement(elementId, elementType), elementType }
}

// export function useAllAbstractProperties() {
//     const mapId = useMapId()
//     return useAppSelector(state => state.firestore?.data?.maps &&
//         state.firestore?.data?.maps[mapId]?.schema?.properties)
// }

// export function getAbstractProperty(property: Property, abstractProperties: AbstractProperty[]) {
//     return abstractProperties.find((abstractProp) => abstractProp.id === property.abstractPropertyId)
// }