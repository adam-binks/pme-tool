import { useDrop } from "react-dnd";
import { ItemTypes } from "../ItemTypes";
import Node from "./Node";
import styles from './Map.module.css';
import { useSubscription } from '@logux/redux';
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { closePane, renameMap } from "../common/mapActions";
import { TransformComponent, TransformWrapper } from "@kokarn/react-zoom-pan-pinch";

interface MapProps {
    id: string,
    paneIndex: number,
}
export default function Map({ id, paneIndex }: MapProps) {
    const map = useAppSelector(state => state.maps.find(map => map._id === id))
    const dispatch = useAppDispatch()

    const nodeIds = ["one", "two"]

    // const [, drop] = useDrop(
    //     () => ({
    //         accept: ItemTypes.NODE,
    //         drop(item: DragItem, monitor) {
    //             const delta = monitor.getDifferenceFromInitialOffset() as XYCoord
    //             const left = Math.round(item.left + delta.x)
    //             const top = Math.round(item.top + delta.y)
    //             moveBox(item.id, left, top)
    //             return undefined
    //         },
    //     }),
    //     [moveBox],
    // )

    const isSubscribing = useSubscription([`map/${id}`])
    if (isSubscribing) {
        return <div className={styles.Map}>
            <p>Loading... {id}</p>
        </div>
    }

    if (!map) {
        return <div className={styles.Map}>
            <p>Error: could not load map (ID: {id})</p>
        </div>
    }
    return (
        <div
            className={styles.Map}
        // onDoubleClick={}
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
            >
                    <p>Map {id}</p>
                    <input value={map?.name} onChange={(e) => dispatch.sync(renameMap({ id, name: e.target.value }))} />
                    <button onClick={() => dispatch(closePane({ paneIndex }))}>Close pane</button>
                <TransformComponent
                    wrapperStyle={{ height: "100%", width: "100%", backgroundColor: "#eee" }}
                >
                    {nodeIds.map(nodeId =>

                        <Node
                            id={nodeId}
                            key={nodeId}
                        />

                    )}
                </TransformComponent>
            </TransformWrapper>
        </div>
    )
}