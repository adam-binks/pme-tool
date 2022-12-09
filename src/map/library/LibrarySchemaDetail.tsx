import { Button, Stack } from "@mantine/core"
import { Class, LibrarySchema } from "../../app/schema"
import SchemaEntry from "../schema/SchemaEntry"

export function LibrarySchemaDetail({
    librarySchema,
    classes,
}: {
    librarySchema: LibrarySchema
    classes: { [key: string]: Class }
}) {
    return (
        <div className="absolute right-10 top-20 z-40 bg-slate-400 w-60 m-auto text-white rounded-lg py-6 px-4 text-left text-sm flex flex-col space-y-2 overflow-auto">
                <div>
                    <h3 className="font-bold pb-2 text-lg">{librarySchema.name}</h3>

                    <p className="opacity-80">{librarySchema.description}</p>

                    <Stack mt={30} spacing={50}>
                        <p></p>
                        {librarySchema.classIds.map((classId) =>
                            classes[classId] ?
                                <SchemaEntry key={classId} inLibrary={true} theClass={classes[classId]} />
                                : <p>Error: missing class</p>
                        )}
                    </Stack>

                    <Button className="bg-blue-500" variant="filled">
                        Add all to schema
                    </Button>

                </div>
        </div>
    )
}