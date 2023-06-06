import { Button, Card } from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import { useFirestore } from "react-redux-firebase";
import { Link } from "react-router-dom";
import { useAppSelector } from "../app/hooks";
import { Project } from "../app/schema";
import Header from "../chrome/Header";
import { getActionsAndReplay } from "../etc/actionLogging";
import { generateId, useUserId } from "../etc/helpers";
import { createMap } from "../state/mapFunctions";
import { addProject } from "../state/projectFunctions";

export function ProjectsPage({

}: {

    }) {
    const firestore = useFirestore()
    const uid = useUserId()
    const projects: { [key: string]: Project } = useAppSelector(state => state.firestore.data.projects)

    return (
        <div className="">
            <div className="text-center items-center m-auto my-8 flex flex-col space-y-6">
                <Button
                    className="bg-melon text-black"
                    onClick={() => {
                        if (!uid) {
                            showNotification({ title: "Can't create project", message: "Sign in to create a project" })
                            return
                        }

                        const projectName = window.prompt("Enter project name", "New project")
                        if (!projectName) { return }

                        const mapId = createMap(firestore, `${projectName} map`, undefined)
                        const projectId = generateId()
                        addProject(firestore, {
                            name: projectName,
                            createdAt: new Date(),
                            id: projectId,
                            mapIds: [mapId],
                            recipe: {
                                id: generateId(),
                                content: "",
                            },
                            anyoneCanEdit: false,
                            editors: [uid],
                            anyoneCanView: false,
                            viewers: [uid],
                        })
                    }}
                >
                    Create project
                </Button>
                <div>
                    <h2 className="text-xl mt-2 text-darkplatinum font-semibold">Your projects</h2>
                    <div className="flex flex-wrap justify-around gap-2 mt-2 max-w-prose">
                        {projects && Object.values(projects).map((project) => (
                            project &&
                            <Card className="w-60 px-6 py-4 flex flex-col space-y-2 bg-seashell" withBorder shadow={"md"} key={project.id}>
                                <h3 className="text-lg font-semibold">{project.name}</h3>
                                <Link to={`/project/${project.id}`}>
                                    <Button color="mistyrose" className="bg-melon text-black w-full">Open</Button>
                                </Link>
                                <Button
                                    onClick={() => {
                                        window.confirm("Are you sure you want to delete this project?") &&
                                            firestore.delete({
                                                collection: "projects",
                                                doc: project.id,
                                            })
                                    }}
                                    className="bg-mistyrose text-black"
                                >
                                    Delete
                                </Button>
                            </Card>
                        ))}
                    </div>
                </div>
                {}
                <Button onClick={async () => {
                    const mapId = "a2d814e86d2f985fbc6d9c2b"
                    const localMachineId = "ic613AivAqesvtSGUW0iU"
                    const startDate = new Date("2021-08-15T18:00:00.000Z")
                    const endDate = new Date()
                    await getActionsAndReplay(firestore, mapId, localMachineId, startDate, endDate)
                    console.log("replay done")
                }}>
                    Replay
                </Button>
            </div>
        </div>
    )
}