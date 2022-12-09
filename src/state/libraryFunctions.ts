import { Class } from "../app/schema";
import { fs } from "./mapFunctions";

export function addLibraryClassCommand(firestore: fs, libraryClass: Class) {
    firestore.set({ collection: 'libraryClasses', doc: libraryClass.id }, libraryClass)
}