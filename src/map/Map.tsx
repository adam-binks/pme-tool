import { useDrop, XYCoord } from "react-dnd";
import { ItemTypes } from "../ItemTypes";
import Node from "./Node";
import styles from './Map.module.css';
import { useAppDispatch, useAppSelector } from "../app/hooks";
// import { addNodeToMap, closePane, createNode, moveNodeOnMap, renameMap } from "../common/mapActions";
import { TransformComponent, TransformWrapper } from "@kokarn/react-zoom-pan-pinch";
import { generateId } from "../etc/helpers";
import MapHeader from "./MapHeader";
import { useEffect, useState } from "react";
import { useFirestore, useFirestoreConnect } from "react-redux-firebase";
import { addNode, getBlankNode } from "../reducers/mapFunctions";

export interface DragItem {
    type: string
    id: string
    x: number
    y: number
}

interface MapProps {
    mapId: string,
    paneIndex: number,
}
export default function Map({ mapId: mapId, paneIndex }: MapProps) {
    const dispatch = useAppDispatch()
    const firestore = useFirestore()
    const map = useAppSelector(state => state.firestore.data?.maps && state.firestore.data.maps[mapId])
    const nodes = useAppSelector(state => state.firestore.data[`nodes.${mapId}`])

    const createNodeAtLocation = (e: React.MouseEvent) => {
        const blankNode = getBlankNode()
        addNode(firestore, mapId, blankNode)
    }

    const [zoomLevel, setZoomLevel] = useState(1)

    const [, drop] = useDrop(
        () => ({
            accept: ItemTypes.NODE,
            drop(item: DragItem, monitor) {
                const delta = monitor.getDifferenceFromInitialOffset() as XYCoord
                const x = Math.round(item.x + (delta.x / zoomLevel))
                const y = Math.round(item.y + (delta.y / zoomLevel))
                console.log({ zoomLevel, delta, x, y })
                // dispatch.sync(moveNodeOnMap({
                //     mapId: mapId,
                //     nodeOnMapId: item.id,
                //     x: x,
                //     y: y
                // }))
                return undefined
            },
        }),
        [dispatch, zoomLevel],
    )

    if (!map) {
        return <div className={styles.Map}>
            <p>Error: could not load map (ID: {mapId})</p>
        </div>
    }
    return (
        <div
            className={styles.Map}
            onDoubleClick={(e) => createNodeAtLocation(e)}
            ref={drop}
        >
            <TransformWrapper
                minPositionX={0}
                minScale={0.1}
                doubleClick={{ disabled: true }}
                panning={{
                    excluded: ["doNotPan"],
                    velocityDisabled: true
                }}
                limitToBounds={false}
                onZoomStop={(ref, event) => { setZoomLevel(ref.state.scale); console.log("zoom to ", ref.state.scale) }}
            >
                <MapHeader map={map} paneIndex={paneIndex} />
                <TransformComponent
                    wrapperStyle={{ height: "100%", width: "100%", backgroundColor: "#eee" }}
                >
                    {nodes && Object.values(nodes).map((node: any) =>
                        <Node
                            node={node}
                            key={node.id}
                        />
                    )}
                </TransformComponent>
            </TransformWrapper>
        </div>
    )
}