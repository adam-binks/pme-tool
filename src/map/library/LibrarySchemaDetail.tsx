import { Button, Stack } from "@mantine/core"
import { useFirestore } from "react-redux-firebase"
import { useAppDispatch } from "../../app/hooks"
import { Class, LibrarySchema } from "../../app/schema"
import { enact } from "../../etc/firestoreHistory"
import { createClassesCommand } from "../../state/mapFunctions"
import { useSchema } from "../../state/mapSelectors"
import { useMapId } from "../Map"
import SchemaEntry from "../schema/SchemaEntry"

export function LibrarySchemaDetail({
    librarySchema,
    classes,
}: {
    librarySchema: LibrarySchema
    classes: { [key: string]: Class }
}) {
    const dispatch = useAppDispatch()
    const mapId = useMapId()
    const firestore = useFirestore()

    const schemaClasses = useSchema(schema => schema.classes)

    return (
        <div className="absolute right-10 top-20 z-40 bg-slate-400 w-60 m-auto text-white rounded-lg py-6 px-4 text-left text-sm flex flex-col overflow-auto">
                <h3 className="font-bold pb-2 text-lg">{librarySchema.name}</h3>

                <p className="opacity-80">{librarySchema.description}</p>

                <Stack spacing={10}>
                    <p></p>
                    {librarySchema.classIds.map((classId) =>
                        classes[classId] ?
                            <SchemaEntry key={classId} inLibrary={true} theClass={classes[classId]} />
                            : <p>Error: missing class</p>
                    )}
                </Stack>

                <Button
                    className="bg-blue-500 m-auto mt-4"
                    variant="filled"
                    onClick={() => {
                        enact(dispatch, mapId, createClassesCommand(firestore, mapId,
                            librarySchema.classIds
                                .filter(id => classes[id])
                                .map((classId) => classes[classId]),
                            schemaClasses
                        )
                        )
                    }}
                >
                    Add all to schema
                </Button>
        </div>
    )
}