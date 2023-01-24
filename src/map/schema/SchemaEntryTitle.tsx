import { clsx } from "@mantine/core"
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
            className={clsx("flex-1 min-w-0 text-center text-sm font-semibold rounded-full",
                `hover:bg-seashell focus:bg-seashell`,
                theClass.element === "arrow" && "text-xs",
            )}
            style={{ backgroundColor: theClass.colour }}
            {...{ value, onChange, onBlur, onFocus }}
        />
    )
}