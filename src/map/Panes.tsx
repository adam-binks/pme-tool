import Split from "../lib/react-split";
import { useAppSelector } from "../app/hooks";
import Map from "./Map";
import "./Panes.css"
import { useFirestore } from "react-redux-firebase";
import { useEffect, useState } from "react";

export default function Panes() {
    const panes = useAppSelector(state => state.panes)

    const firestore = useFirestore()
    const [subscribedMaps, setSubscribedMaps] = useState<string[]>([])

    useEffect(() => {
        const getListeners = (mapId: string) => [{
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
        }
        ]

        // Add listeners for all open maps
        for (let i = 0; i < panes.length; i++) {
            const pane = panes[i]
            if (!subscribedMaps.includes(pane.id)) {
                firestore.setListeners(getListeners(pane.id))
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
        <>
            <Split
                className="split-flex"
                direction="horizontal"
                aria-roledescription={`Split screen into ${panes.length}`}
            >
                {panes.map((pane: any, paneIndex: number) =>
                    <Map
                        mapId={pane.id}
                        key={pane.id}
                        paneIndex={paneIndex}
                    />
                )}
            </Split>
        </>
    )
}