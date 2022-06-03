import { useDrop, XYCoord } from "react-dnd";
import { ItemTypes } from "../ItemTypes";
import Node from "./Node";
import styles from './Map.module.css';
import { useSubscription } from '@logux/redux';
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { addNodeToMap, closePane, createNode, moveNodeOnMap, renameMap } from "../common/mapActions";
import { TransformComponent, TransformWrapper } from "@kokarn/react-zoom-pan-pinch";
import { generateId } from "../etc/helpers";
import MapHeader from "./MapHeader";
import { useState } from "react";

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
    const map = useAppSelector(state => state.maps.maps.find(map => map._id === mapId))
    const dispatch = useAppDispatch()

    const addNode = (e: React.MouseEvent) => {
        const nodeId = generateId();
        dispatch.sync(createNode({ id: nodeId, name: "New node", properties: [] }))
        dispatch.sync(addNodeToMap({
            mapId,
            nodeId,
            nodeOnMapId: generateId(),
            x: 0,
            y: 0,
        }))
    }

    const [zoomLevel, setZoomLevel] = useState(1)

    const [, drop] = useDrop(
        () => ({
            accept: ItemTypes.NODE,
            drop(item: DragItem, monitor) {
                const delta = monitor.getDifferenceFromInitialOffset() as XYCoord
                const x = Math.round(item.x + (delta.x / zoomLevel))
                const y = Math.round(item.y + (delta.y / zoomLevel))
                console.log({zoomLevel, delta, x, y})
                dispatch.sync(moveNodeOnMap({
                    mapId: mapId,
                    nodeOnMapId: item.id,
                    x: x,
                    y: y
                }))
                return undefined
            },
        }),
        [dispatch, zoomLevel],
    )

    const isSubscribing = useSubscription([`map/${mapId}`])
    if (isSubscribing) {
        return <div className={styles.Map}>
            <p>Loading... {mapId}</p>
        </div>
    }
    if (!map) {
        return <div className={styles.Map}>
            <p>Error: could not load map (ID: {mapId})</p>
        </div>
    }
    return (
        <div
            className={styles.Map}
            onDoubleClick={(e) => addNode(e)}
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
                onZoomStop={(ref, event) => {setZoomLevel(ref.state.scale); console.log("zoom to ", ref.state.scale)}}
            >
                <MapHeader map={map} paneIndex={paneIndex} />
                <TransformComponent
                    wrapperStyle={{ height: "100%", width: "100%", backgroundColor: "#eee" }}
                >
                    {map.nodes.map(nodeOnMap =>
                        <Node
                            nodeOnMap={nodeOnMap}
                            key={nodeOnMap._id}
                        />
                    )}
                </TransformComponent>
            </TransformWrapper>
        </div>
    )
}