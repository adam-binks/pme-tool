import { useForceUpdate } from "@mantine/hooks";
import { useEffect, useState } from "react";
import { useFirestore } from "react-redux-firebase";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { Project } from "../app/schema";
import SplitWrapper from "../lib/react-split";
import { defaultPane, setPanes } from "../state/paneReducer";
import Map, { MapContents } from "./Map";
import { MapTabs } from "./MapTabs";
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
    }, [project.id])

    // subscribe to all maps in project
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
        for (let i = 0; i < project.mapIds.length; i++) {
            const mapId = project.mapIds[i]
            if (!subscribedMaps.includes(mapId)) {
                firestore.setListeners(getListeners(mapId))
                setTimeout(forceUpdate, 0)
            }
        }

        // Remove unused listeners
        for (let i = 0; i < subscribedMaps.length; i++) {
            const subscribedMap = subscribedMaps[i]
            if (!project.mapIds.find((mapId: string) => mapId === subscribedMap)) {
                firestore.unsetListeners(getListeners(subscribedMap))
            }
        }

        // also listen to library stuff
        firestore.setListeners([{ collection: "libraryClasses" }, { collection: "librarySchemas" }])

        if (subscribedMaps !== project.mapIds) {
            setSubscribedMaps(project.mapIds)
        }
    }, [project.mapIds])

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
                style={{ overflow: "auto", flexGrow: 1 }}
            >
                {panes.map((pane: any, paneIndex: number) =>
                    <div className="flex flex-col" key={paneIndex}>
                        <MapTabs
                            mapIds={project.mapIds}
                            paneIndex={paneIndex}
                            isOnlyPane={panes.length === 1}
                            project={project}
                        />
                        <Map
                            mapId={pane.id}
                            key={pane.id}
                            showLibrary={pane.libraryOpen}
                        >
                            <MapContents mapId={pane.id} />
                        </Map>
                    </div>
                )}
            </SplitWrapper>
        </>
    )
}