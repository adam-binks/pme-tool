import React from "react";
import { useDrop } from "react-dnd";
import { ItemTypes } from "../ItemTypes";
import Node from "./Node";
import styles from './Map.module.css';
import { useSubscription } from '@logux/redux';
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { renameMap } from "../common/mapActions";

interface MapProps {
    id: string
}
export default function Map({ id }: MapProps) {
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
            <p>Map {id}</p>
            <input value={map?.name} onChange={(e) => dispatch.sync(renameMap({ id, name: e.target.value }))} />

            {nodeIds.map(nodeId =>
                <Node
                    id={nodeId}
                    key={nodeId}
                />
            )}
        </div>
    )
}