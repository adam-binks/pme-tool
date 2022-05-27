import React from "react";
import { useDrop } from "react-dnd";
import { ItemTypes } from "../ItemTypes";
import Node from "./Node";
import styles from './Map.module.css';

interface MapProps {
    id: string
}
export default function Map({ id }: MapProps) {
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

    return (
        <div className={styles.Map}>
            <p>Map {id}</p>
            {nodeIds.map(id =>
                <Node
                    id={id}
                />
            )}
        </div>
    )
}