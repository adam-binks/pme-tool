import { Button } from "@mantine/core"
import { nanoid } from "nanoid"
import { useEffect, useState } from "react"
import { useFirestore } from "react-redux-firebase"
import { Link } from "react-router-dom"
import { getActionsAndReplay, replayAction } from "../etc/actionLogging"
import { ProjectView } from "./ProjectView"
import { writeFile } from 'fs';


export function ReplayPage() {
  const firestore = useFirestore()

  // ============================================================
  // SET THESE PARAMETERS TO CHOOSE WHAT TO REPLAY
  // ============================================================
  const projectId = "d2844c16059c56e28d7bb899" // find this in the firestore console, projects collection
  const mapId = "86ffe6a35b99cbf386141b66" // find the map id in the firestore console, listed under the project

  const localMachineId = "Jy28_7bFWJoXWH7uZQwjp" // this is listed in firestore console > actionLog. Find an entry from this replay and get the localMachineId (this avoids mixing actions from other users' projects)

  // you can set these to be super wide. Make sure the creation of the project and map are >startDate and <endDate
  const startDate = new Date("2024-06-12T00:00:00.000Z") // start date to look for logged actions to replay
  const endDate = new Date() // latest date to look for logged actions to replay

  // ============================================================
  // ============================================================

  const [hasReplayed, setHasReplayed] = useState(false)
  const [docs, setDocs] = useState<any>()
  useEffect(() => {
    async function replay() {
      if (hasReplayed) {
        return
      }

      const newReplaySession = nanoid()
      console.log(`STARTING REPLAY ${newReplaySession}`)
      const docs = await getActionsAndReplay(
        firestore,
        projectId,
        mapId,
        localMachineId,
        startDate,
        endDate,
        newReplaySession
      )
      setDocs(docs)
      setHasReplayed(true)
    }
    replay()
  }, [])

  const [show, setShow] = useState(false)

  var jsonObj = ""

  const [isPlaying, setIsPlaying] = useState(false)
  const replaySession = localStorage.getItem("replaySession")
  const [nextActionIndex, setNextActionIndex] = useState(0)
  async function playNextNActions(n: number) {
    setIsPlaying(true)
    if (!replaySession || !docs) {
      console.log("no replay session or docs", { replaySession, docs })
      return
    }
    for (let i = 0; i < n; i++) {
      const action = docs[nextActionIndex + i]?.data()
      if (action) {
        console.log("replaying action ", { action })
        await replayAction(firestore, replaySession, projectId, mapId, action)
      }
      await new Promise((resolve) => setTimeout(resolve, 100))
    }
    setNextActionIndex(nextActionIndex + n)
    setIsPlaying(false)
  }

  async function saveDataToJSON() {
    console.log("here is the length of docs: " , docs.length)
    for (let i = 0; i < docs.length; i++) {
      const action = docs[i]?.data()
      if (action) {
        console.log("replaying action ", { action })
        jsonObj += JSON.stringify(action) + ","
      }
    }
    const fileData = jsonObj;
    console.log(jsonObj)
    const blob = new Blob([fileData], {type: "text/plain"});
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.download = 'jsonData.json';
    link.href = url;
    link.click();
    // fs.writeFile('myjsonfile.json', "jsonObj");
  }

  if (!show) {
    console.log("showing button")
    return (
      <Button onClick={() => setShow(true)} className="bg-blue-500">
        Show replay
      </Button>
    )
  }

  return (
    <>
      <Button
        disabled={isPlaying}
        className="bg-blue-500 mr-2"
        onClick={() => {
          playNextNActions(1)
        }}
      >
        Play next action
      </Button>
      <Button
        disabled={isPlaying}
        className="bg-blue-500 mr-2"
        onClick={() => {
          playNextNActions(20)
        }}
      >
        Play next 20 actions
      </Button>
      <Button
        disabled={isPlaying}
        className="bg-blue-500 mr-2"
        onClick={() => {
          playNextNActions(200)
        }}
      >
        Play next 200 actions
      </Button>

      <Button
        className="bg-blue-500 mr-2"
        onClick={() => {
          saveDataToJSON()
        }}
      >
        Download JSON Data
      </Button>


      <Link to={`/`}>
        <Button
          className="bg-blue-500"
          onClick={() => {
            localStorage.removeItem("SKIP_LOGGING")
            localStorage.removeItem("replaySession")
            localStorage.removeItem("replayMapIds")
          }}
        >
          End replay
        </Button>
      </Link>
      <ProjectView
        passedProjectId={`REPLAY_PROJECT_${replaySession}_${projectId}`}
      />
    </>
  )
}
