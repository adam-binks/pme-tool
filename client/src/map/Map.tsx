import React from "react";
import { useDrop } from "react-dnd";
import { ItemTypes } from "../ItemTypes";
import Node from "./Node";
import styles from './Map.module.css';
import { useSubscription } from '@logux/redux';
import { useAppDispatch } from "../app/hooks";

interface MapProps {
    id: string
}
export default function Map({ id }: MapProps) {
    const nodeIds = ["one", "two"]
    const dispatch = useAppDispatch()

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
    return (
        <div 
            className={styles.Map}
            // onDoubleClick={}
        >
            <p>Map {id}</p>
            <input onChange={(e) => dispatch.sync({type: 'map/rename', id, name: e.target.value})}/>

            {nodeIds.map(nodeId =>
                <Node
                    id={nodeId}
                    key={nodeId}
                />
            )}
        </div>
    )
}