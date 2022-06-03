import { useDrop } from "react-dnd";
import { ItemTypes } from "../ItemTypes";
import Node from "./Node";
import styles from './Map.module.css';
import { useSubscription } from '@logux/redux';
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { addNodeToMap, closePane, createNode, renameMap } from "../common/mapActions";
import { TransformComponent, TransformWrapper } from "@kokarn/react-zoom-pan-pinch";
import { generateId } from "../etc/helpers";

interface MapProps {
    id: string,
    paneIndex: number,
}
export default function Map({ id, paneIndex }: MapProps) {
    const map = useAppSelector(state => state.maps.maps.find(map => map._id === id))
    const dispatch = useAppDispatch()

    const addNode = (e: React.MouseEvent) => {
        const nodeId = generateId();
        dispatch.sync(createNode({ id: nodeId, name: "New node", properties: [] }))
        dispatch.sync(addNodeToMap({
            mapId: id,
            nodeId,
            nodeOnMapId: generateId(),
            x: 0,
            y: 0,
        }))
    }

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
            onDoubleClick={(e) => addNode(e)}
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