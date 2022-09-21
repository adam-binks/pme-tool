import { TransformComponent, TransformWrapper } from "@kokarn/react-zoom-pan-pinch";
import { Skeleton } from "@mantine/core";
import { useMouse } from "@mantine/hooks";
import React, { useContext, useRef, useState } from "react";
import { useDrop, XYCoord } from "react-dnd";
import { useFirestore } from "react-redux-firebase";
import { useXarrow } from "react-xarrows";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { emptySelection, Selection, SelectionContext } from "../etc/useSelectable";
import { ItemTypes } from "../ItemTypes";
import { addNode, getBlankNode, updateNode } from "../reducers/mapFunctions";
import { Pane, setAddingArrowFrom } from "../reducers/paneReducer";
import ArrowComponent from "./arrow/Arrow";
import styles from './Map.module.css';
import MapHeader from "./MapHeader";
import { MouseFollower } from "./node/MouseFollower";
import NodeComponent from "./node/Node";
import { SchemaPane } from "./schema/SchemaPane";

const MapContext = React.createContext<string>("")
export const useMapId = () => useContext(MapContext)

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
export default function Map({ mapId, paneIndex }: MapProps) {
    const dispatch = useAppDispatch()
    const firestore = useFirestore()
    const map = useAppSelector(state => state.firestore.data?.maps && state.firestore.data.maps[mapId])
    const nodes = useAppSelector(state => state.firestore.data[`nodes.${mapId}`])
    const arrows = useAppSelector(state => state.firestore.data[`arrows.${mapId}`])

    const [selection, setSelection] = useState<Selection>(emptySelection)

    const updateXArrow = useXarrow()

    const addingArrowFrom = useAppSelector(state => state.panes.find(
        (pane: Pane) => pane.id === mapId)?.addingArrowFrom
    )

    const mapHeaderDivRef = useRef<HTMLDivElement>(null)

    const [zoomLevel, setZoomLevel] = useState(1)
    const [panOffset, setPanOffset] = useState({ x: 0, y: 0 })

    const { x: mouseX, y: mouseY, ref: mouseRef } = useMouse()

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
        const offset = { x: -20, y: -50 } // to correct for naked nodes
        const blankNode = getBlankNode(x + offset.x, y + offset.y)
        addNode(firestore, dispatch, mapId, blankNode)
    }

    const [, drop] = useDrop(
        () => ({
            accept: ItemTypes.NODE,
            drop(item: DragItem, monitor) {
                const delta = monitor.getDifferenceFromInitialOffset() as XYCoord
                // correct for canvas zoom
                const x = Math.round(item.x + (delta.x / zoomLevel))
                const y = Math.round(item.y + (delta.y / zoomLevel))
                updateNode(firestore, dispatch, mapId, item.id, { x: item.x, y: item.y }, { x, y })

                return undefined
            },
        }),
        [dispatch, zoomLevel],
    )

    if (!map) {
        return (
            <>
                <Skeleton />
                {/* <Text p="xl" color="dimmed">Loading map (ID: {mapId})...</Text> */}
            </>
        )
    }
    return (
        <MapContext.Provider value={mapId}>
            <SelectionContext.Provider value={[selection, setSelection]}>
                <div
                    className={styles.Map}
                    onDoubleClick={(e) => createNodeAtLocation(e)}
                    ref={(el) => drop(el) && mouseRef}
                >
                    <MapHeader map={map} paneIndex={paneIndex} divRef={mapHeaderDivRef} />

                    <div
                        className={styles.MapMain}
                        onClick={(e) => {
                            // NB: includes schemePane etc
                            setSelection(emptySelection);
                            (document.activeElement as HTMLElement).blur()
                            addingArrowFrom && dispatch(setAddingArrowFrom({ mapId, addingArrowFrom: undefined }))
                        }}
                    >
                        <TransformWrapper
                            minPositionX={0}
                            minScale={0.1}
                            doubleClick={{ disabled: true }}
                            panning={{
                                excluded: [
                                    "doNotPan",
                                    "textarea",
                                    "input",
                                    "mantine-Select-dropdown",
                                    "mantine-ScrollArea-root",
                                    "mantine-ScrollArea-viewport",
                                    "mantine-ScrollArea-scrollbar",
                                    "mantine-ScrollArea-thumb",
                                    "mantine-Select-item",
                                    "mantine-Group-root",
                                    "mantine-Stack-root",
                                ],
                                velocityDisabled: true
                            }}
                            wheel={{
                                excluded: [
                                    "doNotZoom",
                                    "mantine-Select-dropdown",
                                    "mantine-ScrollArea-root",
                                    "mantine-ScrollArea-viewport",
                                    "mantine-ScrollArea-scrollbar",
                                    "mantine-ScrollArea-thumb",
                                    "mantine-Select-item",
                                    "mantine-Menu-itemLabel",
                                    "mantine-Menu-itemLabel",
                                    "mantine-Menu-item",
                                ]
                            }}
                            limitToBounds={false}
                            onZoom={(ref, event) => {
                                setZoomLevel(ref.state.scale)
                                // panoffset can also be changed when zooming
                                setPanOffset({ x: ref.state.positionX, y: ref.state.positionY })
                            }}
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
                                        inSchema={false}
                                    />
                                )}
                                {arrows && Object.values(arrows).map((arrow: any) => {
                                    if (!arrow || !nodes) return
                                    const sourceNode = nodes[arrow.source]
                                    const destNode = nodes[arrow.dest]
                                    if (!sourceNode || !destNode) {
                                        console.warn(`Missing parts of arrow: `, arrow)
                                        return
                                    }
                                    return <ArrowComponent
                                        source={{ x: sourceNode.x, y: sourceNode.y }}
                                        dest={{ x: destNode.x, y: destNode.y }}
                                        arrow={arrow}
                                        key={arrow.id}
                                        strokeWidthScaler={zoomLevel}
                                    />
                                }
                                )}
                            </TransformComponent>
                        </TransformWrapper>

                        <MouseFollower
                            mouseX={mouseX}
                            mouseY={mouseY}
                            strokeWidthScaler={zoomLevel}
                        />

                        <SchemaPane schema={map.schema} />
                    </div>
                </div>
            </SelectionContext.Provider>
        </MapContext.Provider>
    )
}