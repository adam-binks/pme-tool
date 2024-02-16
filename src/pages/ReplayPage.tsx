import { Button } from "@mantine/core";
import { useEffect, useState } from "react";
import { useFirestore } from "react-redux-firebase";
import { getActionsAndReplay } from "../etc/actionLogging";
import { ProjectView } from "./ProjectView";
import {Link} from 'react-router-dom';
import { nanoid } from "nanoid";

export function ReplayPage() {
    const firestore = useFirestore()
    const projectId = "7c4cf87031ce43877b3a32fb"

    const [hasReplayed, setHasReplayed] = useState(false)
    useEffect(() => {
        if (hasReplayed) { return }

        const mapId = "71b1d5db044d5f9ff4794649"
        const localMachineId = "nqPgKT9Xe97UBlpySlGNv"
        const startDate = new Date("2023-06-15T12:15:00.000Z")
        const endDate = new Date()
        const replaySession = nanoid()
        console.log(`STARTING REPLAY ${replaySession}`)
        getActionsAndReplay(firestore, projectId, mapId, localMachineId, startDate, endDate, replaySession)
        setHasReplayed(true)
    }, [])

    const [show, setShow] = useState(false)

    const replaySession = localStorage.getItem("replaySession")

    if (!show) {
        return (
            <Button onClick={() => setShow(true)}>
                Start replay
            </Button>
        )
    }

    return (
        <>
            <Link to={`/`}>
                <Button onClick={() => {
                    localStorage.removeItem("SKIP_LOGGING")
                    localStorage.removeItem("replaySession")
                    localStorage.removeItem("replayMapIds")
                }}>
                    End replay
                </Button>
            </Link>
            <ProjectView passedProjectId={`REPLAY_PROJECT_${replaySession}_${projectId}`}/>
        </>
    )
}