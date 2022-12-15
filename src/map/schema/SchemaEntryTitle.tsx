import { useFirestore } from "react-redux-firebase"
import { useAppDispatch } from "../../app/hooks"
import { Class } from "../../app/schema"
import { useBatchedTextInput } from "../../etc/batchedTextInput"
import { enact } from "../../etc/firestoreHistory"
import { updateLibraryClass } from "../../state/libraryFunctions"
import { updateClassCommand } from "../../state/mapFunctions"
import { useSchema } from "../../state/mapSelectors"
import { useMapId } from "../Map"

export function SchemaEntryTitle({
    theClass,
    inLibrary,
}: {
    theClass: Class
    inLibrary: boolean
}) {
    const firestore = useFirestore()
    const dispatch = useAppDispatch()
    const mapId = useMapId()

    const classes = useSchema(schema => schema.classes)
    const { value, onChange, onBlur, onFocus } = useBatchedTextInput(
        theClass.name,
        (newName) => {
            inLibrary ?
                updateLibraryClass(firestore, { id: theClass.id, name: newName })
                :
                enact(dispatch, mapId, updateClassCommand(firestore, mapId, classes, theClass.id, { name: newName }))
        }
    )

    return (
        <input
            type="text"
            className="text-center hover:bg-slate-100 focus:bg-slate-100"
            {...{ value, onChange, onBlur, onFocus }}
        />
    )
}