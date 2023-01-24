import { TransformComponent, TransformWrapper } from "@kokarn/react-zoom-pan-pinch";
import { Skeleton } from "@mantine/core";
import { useMouse } from "@mantine/hooks";
import { showNotification } from "@mantine/notifications";
import React, { useContext, useRef, useState } from "react";
import { useDrop, XYCoord } from "react-dnd";
import { useFirestore } from "react-redux-firebase";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { Arrow, Class, Node } from "../app/schema";
import { generateId, useMemoisedState } from "../etc/helpers";
import { emptySelection, Selection, SelectionContext } from "../etc/useSelectable";
import { ItemTypes } from "../ItemTypes";
import { addNode, getBlankNode, getBlankNodeOfClass, updateNode } from "../state/mapFunctions";
import { Pane, setAddingArrowFrom } from "../state/paneReducer";
import ArrowComponent from "./arrow/Arrow";
import { LibraryPane } from "./library/LibraryPane";
import { useMapHotkeys } from "./mapHotkeys";
import { MouseFollower } from "./node/MouseFollower";
import NodeComponent from "./node/Node";
import { SchemaPane } from "./schema/SchemaPane";

const MapContext = React.createContext<string>("")
export const useMapId = () => useContext(MapContext)

const ZoomedOutMode = React.createContext<boolean>(false)
export const useZoomedOutMode = () => useContext(ZoomedOutMode)
const zoomedOutModeThreshold = 0.3

export interface DragItem {
    id: string
    x: number
    y: number
    mapId: string
    node?: Node
    theClass?: Class
}

export default function Map({
    children,
    mapId,
    showLibrary,
}: {
    children: React.ReactNode
    mapId: string
    showLibrary: boolean
}) {
    const dispatch = useAppDispatch()
    const firestore = useFirestore()
    const map = useAppSelector(state => state.firestore.data?.maps && state.firestore.data.maps[mapId])

    const [selection, setSelection] = useMemoisedState<Selection>(emptySelection)

    const addingArrowFrom = useAppSelector(state => state.panes.find(
        (pane: Pane) => pane.id === mapId)?.addingArrowFrom
    )

    const hotkeysRef = useMapHotkeys(map?.id)

    const mapTopLeftRef = useRef<HTMLDivElement>(null)

    const [zoomLevel, setZoomLevel] = useState(1)
    const [panOffset, setPanOffset] = useMemoisedState({ x: 0, y: 0 })

    const correctForMapOffset = (screenX: number, screenY: number) => {
        const mapTopLeftRect = mapTopLeftRef.current?.getBoundingClientRect()

        // correct for canvas element offset from topleft of screen
        const xFromCanvasTopleft = screenX - (mapTopLeftRect?.left || 0)
        const yFromCanvasTopleft = screenY - (mapTopLeftRect?.top || 0)

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

    const createNodeAtLocation = ({ clientX, clientY }: { clientX: number, clientY: number }, node?: Node) => {
        const { x, y } = screenCoordsToMapCoords(clientX, clientY)
        const offset = { x: -20, y: -30 } // to display the new number under the cursor
        node = node || getBlankNode(x + offset.x, y + offset.y)
        node.x = x + offset.x
        node.y = y + offset.y
        addNode(firestore, dispatch, mapId, node)
    }

    const [{ draggedSchemaClass }, drop] = useDrop(
        () => ({
            accept: [ItemTypes.NODE, ItemTypes.SCHEMA_CLASS],
            drop(item: DragItem, monitor) {
                if (monitor.getItemType() === ItemTypes.NODE) {
                    if (item.mapId === mapId) {
                        const delta = monitor.getDifferenceFromInitialOffset() as XYCoord
                        // correct for canvas zoom
                        const x = Math.round(item.x + (delta.x / zoomLevel))
                        const y = Math.round(item.y + (delta.y / zoomLevel))
                        updateNode(firestore, dispatch, mapId, item.id, { x: item.x, y: item.y }, { x, y })
                    } else {
                        item.node && addNode(firestore, dispatch, mapId, {
                            ...item.node, id: generateId(), classId: null
                        })
                    }
                }
                if (monitor.getItemType() === ItemTypes.SCHEMA_CLASS) {
                    if (item.mapId === mapId) {
                        const theClass = map?.schema?.classes.find((c: Class) => c.id === item.id)
                        const node = theClass && getBlankNodeOfClass(theClass)

                        const coords = monitor.getClientOffset()
                        coords && node && createNodeAtLocation({ clientX: coords.x, clientY: coords.y }, node)
                    }
                }

                return undefined
            },
            collect: (monitor) => ({
                draggedSchemaClass: monitor.canDrop() && (
                    monitor.getItemType() === ItemTypes.SCHEMA_CLASS && monitor.getItem()?.mapId === mapId
                ),
            }),
        }),
        [dispatch, zoomLevel, map, mapId, firestore, panOffset],
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
            <ZoomedOutMode.Provider value={zoomLevel < 0.3}>
                <SelectionContext.Provider value={[selection, setSelection]}>
                    <MouseMoveDetector>
                        <div
                            className={"relative h-full w-full flex flex-col"}
                            onDoubleClick={(e) => createNodeAtLocation(e)}
                            ref={(el) => drop(el) && hotkeysRef}
                            tabIndex={-1} // make this focusable, so scoped hotkeys work
                        >
                            <div className="absolute" ref={mapTopLeftRef} />
                            <div
                                className={"flex flex-row flex-grow w-full h-full overflow-auto"}
                                onClick={(e) => {
                                    // NB: includes schemePane etc
                                    if (selection.arrowIds.length > 0 || selection.nodeIds.length > 0 || selection.classIds.length > 0) {
                                        setSelection(emptySelection);
                                    }
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
                                            "icon",
                                            "cm-editor",
                                            "cm-content",
                                            "cm-line",
                                        ],
                                        velocityDisabled: true
                                    }}
                                    wheel={{
                                        wheelDisabled: true,
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
                                    onPanningStop={(ref, event) => {
                                        setPanOffset({ x: ref.state.positionX, y: ref.state.positionY })
                                    }}
                                >
                                    <TransformComponent
                                        wrapperStyle={{
                                            height: "100%", width: "100%",
                                            backgroundColor: draggedSchemaClass ? "#eff6ff" : "white",
                                        }}
                                    >
                                        {children}
                                    </TransformComponent>
                                </TransformWrapper>

                                <SchemaPane schema={map.schema} />
                                {showLibrary && <LibraryPane />}
                            </div>
                        </div>
                    </MouseMoveDetector>
                </SelectionContext.Provider>
            </ZoomedOutMode.Provider>
        </MapContext.Provider>
    )
}

function MouseMoveDetector({
    children,
}: {
    children: React.ReactNode,
}) {
    const { x: mouseX, y: mouseY, ref: mouseRef } = useMouse()

    return <div className={"h-full w-full"} ref={mouseRef}>
        {children}
        <MouseFollower
            mouseX={mouseX}
            mouseY={mouseY}
            strokeWidthScaler={1}
        />
    </div>
}

export function MapContents({
    mapId,
}: {
    mapId: string
}) {
    const nodes = useAppSelector(state => state.firestore.data[`nodes.${mapId}`]) as { [key: string]: Node }
    const arrows = useAppSelector(state => state.firestore.data[`arrows.${mapId}`]) as { [key: string]: Arrow }

    return (
        <>
            {nodes && Object.values(nodes).map((node: any) =>
                node && <NodeComponent
                    node={node}
                    key={node.id}
                />
            )}
            {arrows && (Object.values(arrows)).map((arrow) => {
                if (!arrow || !nodes) return
                return <ArrowComponent
                    arrow={arrow}
                    key={arrow.id}
                    strokeWidthScaler={1}
                />
            })}
        </>
    )
}