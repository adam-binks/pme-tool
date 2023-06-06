import { map } from "lodash";
import { Class, LibrarySchema, Recipe, Schema } from "../app/schema";
import { executeAndLogAction } from '../etc/actionLogging';
import { generateId, prettyPrintDate } from "../etc/helpers";
import { fs } from "./mapFunctions";

export function addLibraryClass(firestore: fs, libraryClass: Class) {
    executeAndLogAction(firestore, "set", `libraryClasses/${libraryClass.id}`, libraryClass)
}

export function updateLibraryClass(firestore: fs, libraryClass: Partial<Class>) {
    executeAndLogAction(firestore, "update", `libraryClasses/${libraryClass.id}`, libraryClass)
}

export function addLibrarySchema(firestore: fs, librarySchema: LibrarySchema) {
    executeAndLogAction(firestore, "set", `librarySchemas/${librarySchema.id}`, librarySchema)
}

export function updateLibrarySchema(firestore: fs, librarySchema: Partial<LibrarySchema>) {
    executeAndLogAction(firestore, "update", `librarySchemas/${librarySchema.id}`, librarySchema)
}

export function deleteLibrarySchema(firestore: fs, librarySchemaId: string) {
    executeAndLogAction(firestore, "delete", `librarySchemas/${librarySchemaId}`)
}

export function createLibraryClassAndAddToSchema(firestore: fs, librarySchemaId: string, libraryClass: Class) {
    addLibraryClass(firestore, libraryClass)
    executeAndLogAction(firestore, "update", `librarySchemas/${libraryClass.id}`, { classIds: firestore.FieldValue.arrayUnion(libraryClass.id) })
}

export function copyMapSchemaToLibrary(firestore: fs, mapSchema: Schema, mapName: string, uid: string, recipe: Recipe) {
    const classIds = mapSchema.classes.map(
        (theClass) => {
            const id = generateId()
            addLibraryClass(firestore, {...theClass, id})
            return id
        }
    )
    const librarySchemaId = generateId()
    addLibrarySchema(firestore, {
        id: librarySchemaId, 
        classIds,
        name: `${mapName} schema`,
        createdAt: new Date(),
        creator: uid,
        description: `Snapshot of ${map.name} schema on ${prettyPrintDate(new Date())}`,
        tags: [],
        recipe: {
            ...recipe,
            id: generateId(),
        }
    })
}