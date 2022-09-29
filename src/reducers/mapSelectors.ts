import { useAppSelector } from "../app/hooks"
import { AbstractProperty, Element, elementType, Node, Property } from "../app/schema"
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

export function useArrows(selector: (arrows: any) => any) {
    return useElements("arrow", selector)
}

export function useNodesWithClass(classId: string, selector: (nodesOfClass: any) => any) {
    return useNodes((nodes) => selector((Object.values(nodes) as any).filter((node: Node) => node?.classId === classId)))
}

export function useMap(selector: (map: any) => any) {
    const mapId = useMapId()
    return useFirestoreData(state => state?.maps[mapId] && selector(state.maps[mapId]))
}

export function useSchema(selector: (schema: any) => any) {
    return useMap(map => map.schema && selector(map.schema))
}

export function useAbstractProperties(selector: (abstractProperties: any) => any) {
    return useSchema(schema => schema.properties && selector(schema.properties))
}

export function elementHasTitle(element: Element, properties: AbstractProperty[]) {
    const firstProp = element?.properties && element.properties[0]
    if (!firstProp) { return false }
    const abstractProp = properties.find(p => p.id === firstProp.abstractPropertyId)
    return abstractProp?.type === "title"
}

function useGetElement(elementId: string, elementType: elementType) {
    const mapId = useMapId()
    return useElements(elementType, (elements) => elements[elementId]) as Element | undefined
}

export function useElement() {
    const { elementId, elementType } = useElementId()
    return { element: useGetElement(elementId, elementType), elementType }
}

export function useAllAbstractProperties() {
    const mapId = useMapId()
    return useAppSelector(state => state.firestore?.data?.maps &&
        state.firestore?.data?.maps[mapId]?.schema?.properties)
}

export function getAbstractProperty(property: Property, abstractProperties: AbstractProperty[]) {
    return abstractProperties.find((abstractProp) => abstractProp.id === property.abstractPropertyId)
}