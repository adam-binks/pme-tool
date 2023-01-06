import { Button, Card } from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import { useEffect } from "react";
import { useFirestore } from "react-redux-firebase";
import { Link } from "react-router-dom";
import { useAppSelector } from "../app/hooks";
import { Project } from "../app/schema";
import { generateId } from "../etc/helpers";
import { createMap } from "../state/mapFunctions";
import { addProject } from "../state/projectFunctions";

export function ProjectsPage({

}: {

    }) {
    const firestore = useFirestore()
    const uid = useAppSelector(state => state.firebase.auth?.uid)
    const projects: { [key: string]: Project } = useAppSelector(state => state.firestore.data.projects)

    useEffect(() => {
        if (!uid) { return }

        firestore.setListener({
            collection: "projects",
            where: ["editors", "array-contains", uid]
        })
    }, [uid])

    return (
        <div className="text-center items-center m-auto my-8 flex flex-col space-y-6">
            <h1 className="text-2xl">PME Tool</h1>
            <Button
                className="bg-violet-600"
                onClick={() => {
                    if (!uid) {
                        showNotification({ title: "Can't create project", message: "Sign in to create a project" })
                        return
                    }

                    const projectName = window.prompt("Enter project name", "New project")
                    if (!projectName) { return }

                    const mapId = createMap(firestore)
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
                <h2 className="text-xl mt-2">Your projects</h2>
                <div className="flex flex-wrap justify-around gap-2 mt-2 max-w-prose">
                    {projects && Object.values(projects).map((project) => (
                        project &&
                        <Card className="w-60 px-6 py-4 flex flex-col space-y-2" withBorder shadow={"md"} key={project.id}>
                            <h3 className="text-lg">{project.name}</h3>
                            <Link to={`/project/${project.id}`}>
                                <Button className="bg-indigo-400 w-full">Open</Button>
                            </Link>
                            <Button
                                onClick={() => {
                                    window.confirm("Are you sure you want to delete this project?") &&
                                        firestore.delete({
                                            collection: "projects",
                                            doc: project.id,
                                        })
                                }}
                                className="bg-slate-400"
                            >
                                Delete
                            </Button>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    )
}