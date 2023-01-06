import { Project } from "../app/schema";
import { fs } from "./mapFunctions";

export function addProject(firestore: fs, project: Project) {
    firestore.set({ collection: 'projects', doc: project.id }, project)
}