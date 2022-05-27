import React from "react";
import { useAppSelector } from "../app/hooks";
import styles from "./Node.module.css";

interface NodeProps {
    id: string,
}
export default function Node({ id }: NodeProps) {
    // temp
    const node = {
        x: 100,
        y: 100
    }
    return (
        <div 
            className={styles.Node}
            style={{left: node.x, top: node.y}}
        >
            <p>Node {id}</p>
        </div>
    )
}