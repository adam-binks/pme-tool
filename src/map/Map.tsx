import { useDrop, XYCoord } from "react-dnd";
import { ItemTypes } from "../ItemTypes";
import NodeComponent from "./node/Node";
import styles from './Map.module.css';
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { TransformComponent, TransformWrapper } from "@kokarn/react-zoom-pan-pinch";
import MapHeader from "./MapHeader";
import { useRef, useState } from "react";
import { useFirestore } from "react-redux-firebase";
import { addNode, getBlankNode, updateNode } from "../reducers/mapFunctions";
import { SchemaPane } from "./schema/SchemaPane";
import React from "react";
import ArrowComponent from "./Arrow";
import { MouseFollower } from "./node/MouseFollower";
import { useXarrow, Xwrapper } from "react-xarrows";
import { Arrow, Node } from "../app/schema";

export const MapContext = React.createContext<string>("")

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
    const arrows = useAppSelector(state => state.firestore.data[`arrows.${mapId}`])

    const updateXArrow = useXarrow()

    const mapHeaderDivRef = useRef<HTMLDivElement>(null)

    const [zoomLevel, setZoomLevel] = useState(1)
    const [panOffset, setPanOffset] = useState({ x: 0, y: 0 })

    const correctForMapOffset = (screenX: number, screenY: number, useHeightInstead = false) => {
        const mapHeaderRect = mapHeaderDivRef.current?.getBoundingClientRect()

        // correct for canvas element offset from topleft of screen
        const xFromCanvasTopleft = screenX - (mapHeaderRect?.left || 0)
        const yFromCanvasTopleft = screenY - ((useHeightInstead ? mapHeaderRect?.height : mapHeaderRect?.bottom) || 0)

        return { x: xFromCanvasTopleft, y: yFromCanvasTopleft }
    }

    const screenCoordsToMapCoords = (screenX: number, screenY: number) => {
        const { x, y } = correctForMapOffset(screenX, screenY)

        // correct for panning and zooming of the canvas
        return {
            x: ((x - panOffset.x) / zoomLevel),
            y: (y - panOffset.y) / zoomLevel,
        }
    }

    const createNodeAtLocation = (e: React.MouseEvent) => {
        const { x, y } = screenCoordsToMapCoords(e.clientX, e.clientY)
        const blankNode = getBlankNode(x, y)
        addNode(firestore, mapId, blankNode)
    }

    const [, drop] = useDrop(
        () => ({
            accept: ItemTypes.NODE,
            drop(item: DragItem, monitor) {
                const delta = monitor.getDifferenceFromInitialOffset() as XYCoord
                // correct for canvas zoom
                const x = Math.round(item.x + (delta.x / zoomLevel))
                const y = Math.round(item.y + (delta.y / zoomLevel))
                updateNode(firestore, mapId, item.id, { x, y })

                setTimeout(() => updateXArrow(), 10) // temporary hack - doesn't work if another moves it

                return undefined
            },
        }),
        [dispatch, zoomLevel],
    )

    if (!map) {
        return <div className={styles.Map}>
            <p>Loading map (ID: {mapId})...</p>
        </div>
    }
    return (
        <MapContext.Provider value={mapId}>
            <div
                className={styles.Map}
                onDoubleClick={(e) => createNodeAtLocation(e)}
                ref={drop}
            >
                <MapHeader map={map} paneIndex={paneIndex} divRef={mapHeaderDivRef} />

                <div className={styles.MapMain}>
                    <Xwrapper>
                        <TransformWrapper
                            minPositionX={0}
                            minScale={0.1}
                            doubleClick={{ disabled: true }}
                            panning={{
                                excluded: ["doNotPan"],
                                velocityDisabled: true
                            }}
                            limitToBounds={false}
                            onZoom={(ref, event) => { setZoomLevel(ref.state.scale); }}
                            onPanning={(ref, event) => {
                                setPanOffset({ x: ref.state.positionX, y: ref.state.positionY })
                            }}
                        >
                            <TransformComponent
                                wrapperStyle={{ height: "100%", width: "100%", backgroundColor: "#eee" }}
                            >
                                {nodes && Object.values(nodes).map((node: any) =>
                                    node && <NodeComponent
                                        node={node}
                                        key={node.id}
                                    />
                                )}
                            </TransformComponent>
                        </TransformWrapper>

                        {arrows && Object.values(arrows).map((arrow: any) =>
                            arrow && <ArrowComponent
                                arrow={arrow}
                                key={arrow.id}
                                strokeWidthScaler={zoomLevel}
                            />
                        )}
                        <MouseFollower strokeWidthScaler={zoomLevel} correctForMapOffset={correctForMapOffset} />
                    </Xwrapper>

                    <SchemaPane schema={map.schema} />
                </div>
            </div>
        </MapContext.Provider>
    )
}