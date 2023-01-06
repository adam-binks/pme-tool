import { map } from "lodash";
import { Class, LibrarySchema, Schema } from "../app/schema";
import { generateId, prettyPrintDate } from "../etc/helpers";
import { fs } from "./mapFunctions";

export function addLibraryClass(firestore: fs, libraryClass: Class) {
    firestore.set({ collection: 'libraryClasses', doc: libraryClass.id }, libraryClass)
}

export function updateLibraryClass(firestore: fs, libraryClass: Partial<Class>) {
    firestore.update({ collection: 'libraryClasses', doc: libraryClass.id }, libraryClass)
}

export function addLibrarySchema(firestore: fs, librarySchema: LibrarySchema) {
    firestore.set({ collection: 'librarySchemas', doc: librarySchema.id }, librarySchema)
}

export function updateLibrarySchema(firestore: fs, librarySchema: Partial<LibrarySchema>) {
    firestore.update({ collection: 'librarySchemas', doc: librarySchema.id }, librarySchema)
}

export function deleteLibrarySchema(firestore: fs, librarySchemaId: string) {
    firestore.delete({ collection: 'librarySchemas', doc: librarySchemaId })
}

export function createLibraryClassAndAddToSchema(firestore: fs, librarySchemaId: string, libraryClass: Class) {
    addLibraryClass(firestore, libraryClass)
    firestore.update({ collection: 'librarySchemas', doc: librarySchemaId }, { classIds: firestore.FieldValue.arrayUnion(libraryClass.id) })
}

export function copyMapSchemaToLibrary(firestore: fs, mapSchema: Schema, mapName: string, uid: string) {
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
    })
}