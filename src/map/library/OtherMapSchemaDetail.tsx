import { Button } from "@mantine/core"
import { useFirestore } from "react-redux-firebase"
import { useAppDispatch } from "../../app/hooks"
import { Class, Map } from "../../app/schema"
import { enact } from "../../etc/firestoreHistory"
import { generateId } from "../../etc/helpers"
import { createClassesCommand } from "../../state/mapFunctions"
import { useSchema } from "../../state/mapSelectors"
import { useMapId } from "../Map"
import SchemaEntry from "../schema/SchemaEntry"

export function OtherMapSchemaDetail({
    map,
    closeDetail,
}: {
    map: Map
    closeDetail: () => void
}) {
    const dispatch = useAppDispatch()
    const mapId = useMapId()
    const firestore = useFirestore()
    const schema = map.schema

    const thisLibrarySchemaClasses = schema.classes

    const classesInMapSchema: Class[] = useSchema(mapSchema => mapSchema.classes)

    const classesNotAdded: Class[] = thisLibrarySchemaClasses.filter(cls => !classesInMapSchema.some(c => c.name === cls.name))

    return (
        <div className="absolute right-10 top-20 z-40 bg-slate-400 w-60 m-auto 
            text-white rounded-lg py-6 px-4 text-left text-sm flex flex-col overflow-auto"
            style={{maxHeight: "calc(100% - 90px)"}}>
            
                <h3
                    className="font-bold pb-2 text-lg"
                >
                    {map.name} schema
                </h3>

            <p className="opacity-80">The schema from your other map.</p>

            <div className="flex flex-col space-y-2 mt-4">
                <h4 className="font-bold text-center">Schema</h4>
                {thisLibrarySchemaClasses.map((theClass) =>
                    theClass ?
                        <div key={theClass.id} className="m-auto flex">
                            <SchemaEntry key={theClass.id} inLibrary={true} theClass={theClass} editable={false} />
                        </div>
                        : <p>Error: missing class</p>
                )}
            </div>

            {classesNotAdded.length > 0 ?
                <>
                    <Button
                        className="bg-blue-500 m-auto mt-4"
                        variant="filled"
                        onClick={() => {
                            enact(dispatch, mapId, createClassesCommand(firestore, mapId,
                                classesNotAdded.map(cls => ({ ...cls, id: generateId() })),
                                classesInMapSchema
                            ))
                        }}
                    >
                        Add all to schema
                    </Button>
                    <p className="mx-4 mt-2 italic text-xs text-slate-200 text-center">Or drag individual classes into your schema</p>
                </>
                :
                <p className="opacity-80 m-auto mt-4">All classes added</p>
            }
        </div>
    )
}