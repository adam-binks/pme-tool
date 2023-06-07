import { Button } from "@mantine/core";
import { useEffect, useState } from "react";
import { useFirestore } from "react-redux-firebase";
import { getActionsAndReplay } from "../etc/actionLogging";
import { ProjectView } from "./ProjectView";
import {Link} from 'react-router-dom';
import { nanoid } from "nanoid";

export function ReplayPage() {
    const firestore = useFirestore()
    const projectId = "45548dfbb5f38b632540cff4"

    useEffect(() => {
        const mapId = "b035ff307ce0e8dc25cc1a33"
        const localMachineId = "ic613AivAqesvtSGUW0iU"
        const startDate = new Date("2023-06-07T12:15:00.000Z")
        const endDate = new Date()
        const replaySession = nanoid()
        console.log(`STARTING REPLAY ${replaySession}`)
        getActionsAndReplay(firestore, projectId, mapId, localMachineId, startDate, endDate, replaySession)
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