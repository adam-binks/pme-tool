import { useForceUpdate } from "@mantine/hooks";
import { useEffect, useState } from "react";
import { useFirestore } from "react-redux-firebase";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { Project } from "../app/schema";
import SplitWrapper from "../lib/react-split";
import { defaultPane, setPanes } from "../state/paneReducer";
import Map, { MapContents } from "./Map";
import "./Panes.css";

export default function Panes({
    project,
}
    : {
        project: Project
    }) {
    const panes = useAppSelector(state => state.panes)
    const dispatch = useAppDispatch()
    const firestore = useFirestore()
    const [subscribedMaps, setSubscribedMaps] = useState<string[]>([])

    const forceUpdate = useForceUpdate()

    useEffect(() => {
        dispatch(setPanes([{
            ...defaultPane,
            id: project.mapIds[0],
        }]))
        console.log("open ", project.mapIds[0])
    }, [project.id])

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

        // also listen to library stuff
        firestore.setListeners([{ collection: "libraryClasses" }, { collection: "librarySchemas" }])

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
                style={{ overflow: "auto" }}
            >
                {panes.map((pane: any, paneIndex: number) =>
                    <Map
                        mapId={pane.id}
                        key={pane.id}
                        paneIndex={paneIndex}
                        showLibrary={pane.libraryOpen}
                        isOnlyPane={panes.length === 1}
                    >
                        <MapContents mapId={pane.id} />
                    </Map>
                )}
            </SplitWrapper>
        </>
    )
}