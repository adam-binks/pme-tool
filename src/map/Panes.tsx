import { useForceUpdate } from "@mantine/hooks";
import { useEffect, useState } from "react";
import { useFirestore } from "react-redux-firebase";
import { useAppSelector } from "../app/hooks";
import SplitWrapper from "../lib/react-split";
import Map from "./Map";
import "./Panes.css";

export default function Panes() {
    const panes = useAppSelector(state => state.panes)

    const firestore = useFirestore()
    const [subscribedMaps, setSubscribedMaps] = useState<string[]>([])

    const forceUpdate = useForceUpdate()

    useEffect(() => {
        const getListeners = (mapId: string) => [
            {
                doc: mapId,
                collection: 'maps',
            },
            {
                doc: mapId,
                collection: 'maps',
                subcollections: [
                    { collection: 'nodes' }
                ],
                storeAs: `nodes.${mapId}`
            },
            {
                doc: mapId,
                collection: 'maps',
                subcollections: [
                    { collection: 'arrows' }
                ],
                storeAs: `arrows.${mapId}`
            },
        ]

        // Add listeners for all open maps
        for (let i = 0; i < panes.length; i++) {
            const pane = panes[i]
            if (!subscribedMaps.includes(pane.id)) {
                firestore.setListeners(getListeners(pane.id))
                setTimeout(forceUpdate, 0)
            }
        }

        // Remove unused listeners
        for (let i = 0; i < subscribedMaps.length; i++) {
            const subscribedMap = subscribedMaps[i]
            if (!panes.find((pane: any) => pane.id === subscribedMap)) {
                firestore.setListeners(getListeners(subscribedMap))
            }
        }

        const mapIds = panes.map((pane: any) => pane.id)
        if (subscribedMaps !== mapIds) {
            setSubscribedMaps(mapIds)
        }
    }, [panes])

    if (panes.length === 0) {
        return (<p>Open a map!</p>)
    }
    return (
        // wrapping this in a fragment prevents a bug where a newly added pane size can't be reduced
        // for some reason 🤷
        <>
            <SplitWrapper
                className="split-flex"
                direction="horizontal"
                aria-roledescription={`Split screen into ${panes.length}`}
                key={panes.length}
                style={{overflow: "auto"}}
            >
                {panes.map((pane: any, paneIndex: number) =>
                    <Map
                        mapId={pane.id}
                        key={pane.id}
                        paneIndex={paneIndex}
                    />
                )}
            </SplitWrapper>
        </>
    )
}