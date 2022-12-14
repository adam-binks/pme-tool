import { TransformComponent, TransformWrapper } from "@kokarn/react-zoom-pan-pinch";
import { Skeleton } from "@mantine/core";
import { useMouse } from "@mantine/hooks";
import React, { useContext, useRef, useState } from "react";
import { useDrop, XYCoord } from "react-dnd";
import { useFirestore } from "react-redux-firebase";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { Arrow, Class, Node } from "../app/schema";
import { emptySelection, Selection, SelectionContext } from "../etc/useSelectable";
import { ItemTypes } from "../ItemTypes";
import { addNode, getBlankNode, getBlankNodeOfClass, updateNode } from "../state/mapFunctions";
import { Pane, setAddingArrowFrom } from "../state/paneReducer";
import ArrowComponent from "./arrow/Arrow";
import { LibraryPane } from "./library/LibraryPane";
import MapHeader from "./MapHeader";
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
    type: string
    id: string
    x: number
    y: number
}

export default function Map({
    mapId,
    paneIndex,
    showLibrary,
}: {
    mapId: string,
    paneIndex: number,
    showLibrary: boolean,
}) {
    const dispatch = useAppDispatch()
    const firestore = useFirestore()
    const map = useAppSelector(state => state.firestore.data?.maps && state.firestore.data.maps[mapId])
    const nodes = useAppSelector(state => state.firestore.data[`nodes.${mapId}`]) as { [key: string]: Node }
    const arrows = useAppSelector(state => state.firestore.data[`arrows.${mapId}`]) as { [key: string]: Arrow }

    const [selection, setSelection] = useState<Selection>(emptySelection)

    const addingArrowFrom = useAppSelector(state => state.panes.find(
        (pane: Pane) => pane.id === mapId)?.addingArrowFrom
    )

    const hotkeysRef = useMapHotkeys(map?.id)

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

    const createNodeAtLocation = ({ clientX, clientY }: { clientX: number, clientY: number }, node?: Node) => {
        const { x, y } = screenCoordsToMapCoords(clientX, clientY)
        const offset = { x: -20, y: -50 } // to correct for naked nodes
        node = node || getBlankNode(x + offset.x, y + offset.y)
        node.x = x + offset.x
        node.y = y + offset.y
        addNode(firestore, dispatch, mapId, node)
    }

    const [, drop] = useDrop(
        () => ({
            accept: [ItemTypes.NODE, ItemTypes.SCHEMA_CLASS],
            drop(item: DragItem, monitor) {
                if (monitor.getItemType() === ItemTypes.NODE) {
                    const delta = monitor.getDifferenceFromInitialOffset() as XYCoord
                    // correct for canvas zoom
                    const x = Math.round(item.x + (delta.x / zoomLevel))
                    const y = Math.round(item.y + (delta.y / zoomLevel))
                    updateNode(firestore, dispatch, mapId, item.id, { x: item.x, y: item.y }, { x, y })
                }
                if (monitor.getItemType() === ItemTypes.SCHEMA_CLASS) {
                    const theClass = map?.schema?.classes.find((c: Class) => c.id === item.id)
                    const node = theClass && getBlankNodeOfClass(theClass)

                    const coords = monitor.getClientOffset()
                    coords && node && createNodeAtLocation({ clientX: coords.x, clientY: coords.y }, node)
                }

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
            <ZoomedOutMode.Provider value={zoomLevel < 0.3}>
                <SelectionContext.Provider value={[selection, setSelection]}>
                    <MouseMoveDetector>
                        <div
                            className={"relative h-full w-full flex flex-col"}
                            onDoubleClick={(e) => createNodeAtLocation(e)}
                            ref={(el) => drop(el) && hotkeysRef}
                            tabIndex={-1} // make this focusable, so scoped hotkeys work
                        >
                            <MapHeader map={map} paneIndex={paneIndex} divRef={mapHeaderDivRef} />

                            <div
                                className={"flex flex-row flex-grow w-full h-full overflow-auto"}
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
                                            />
                                        )}
                                        {arrows && (Object.values(arrows)).map((arrow) => {
                                            if (!arrow || !nodes) return
                                            return <ArrowComponent
                                                arrow={arrow}
                                                key={arrow.id}
                                                strokeWidthScaler={zoomLevel}
                                            />
                                        }
                                        )}
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