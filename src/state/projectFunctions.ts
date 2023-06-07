import { Project } from "../app/schema";
import { executeAndLogAction } from "../etc/actionLogging";
import { useProjectId } from "../pages/ProjectView";
import { fs } from "./mapFunctions";
import { useFirestoreData } from "./mapSelectors";

export function addProject(firestore: fs, project: Project) {
    executeAndLogAction(firestore, "set", `projects/${project.id}`, project)
}

export function useProject(selector: (state: any) => any) {
    const projectId = useProjectId()
    return useFirestoreData(state => selector(state.projects && state.projects[projectId]))
}

export function updateProject(firestore: fs, projectId: string, project: Partial<Project>) {
    executeAndLogAction(firestore, "update", `projects/${projectId}`, project)
}