import { Button, Overlay, ScrollArea, Skeleton, Stack, Title } from "@mantine/core"
import { IconPlus } from "@tabler/icons"
import { useState } from "react"
import { isLoaded, useFirestore } from "react-redux-firebase"
import { Class, LibrarySchema } from "../../app/schema"
import { generateId } from "../../etc/helpers"
import { emptySelection, useSelection } from "../../etc/useSelectable"
import { addLibrarySchema } from "../../state/libraryFunctions"
import { useFirestoreData } from "../../state/mapSelectors"
import { LibrarySchemaDetail } from "./LibrarySchemaDetail"
import { LibrarySchemaThumbnail } from "./LibrarySchemaThumbnail"

export function LibraryPane({}: {}) {
    const firestore = useFirestore()
    const [, setSelection] = useSelection()

    const librarySchemas: { [key: string]: LibrarySchema } = useFirestoreData(state => state.librarySchemas)
    const libraryClasses: { [key: string]: Class } = useFirestoreData(state => state.libraryClasses)

    const [viewingSchemaId, setViewingSchemaId] = useState<undefined | string>(undefined)

    return (
        <div
            className={"z-10 bg-slate-500 text-white shadow-inner-lg max-h-full"}
            onClick={(e: any) => {
                setSelection(emptySelection)
                e.stopPropagation()
            }}
        >
            <ScrollArea style={{ height: "100%" }} offsetScrollbars>
                <Stack className="w-80" p={"md"}>
                    <Title className="select-none" order={3}>Library</Title>
                    {(!isLoaded(libraryClasses) || !isLoaded(librarySchemas)) ?
                        <Skeleton />
                        :
                        <>
                            {librarySchemas && Object.values(librarySchemas).map(
                                (librarySchema) =>
                                    librarySchema && <LibrarySchemaThumbnail
                                        key={librarySchema.id}
                                        librarySchema={librarySchema}
                                        onViewDetail={(librarySchema: LibrarySchema) => setViewingSchemaId(librarySchema.id)}
                                    />
                            )}
                            {/* <Title order={4}>All classes</Title>
                            {libraryClasses && Object.values(libraryClasses).map(
                                (libraryClass) => <p key={libraryClass.id}>{libraryClass.name}</p>
                            )} */}

                            {viewingSchemaId && <Overlay className="z-20" color={"#444"} blur={2} onClick={() => setViewingSchemaId(undefined)} />}
                        </>
                    }
                </Stack>
                <Button
                    onClick={() => addLibrarySchema(firestore, {
                        id: generateId(),
                        name: "New schema",
                        classIds: [],
                        createdAt: new Date(),
                        description: "",
                    })}
                    variant="filled"
                    className="bg-slate-400"
                >
                    Add schema
                </Button>
            </ScrollArea>
            {(viewingSchemaId && librarySchemas[viewingSchemaId]) &&
                <LibrarySchemaDetail
                    librarySchema={librarySchemas[viewingSchemaId]}
                    classes={libraryClasses}
                    closeDetail={() => setViewingSchemaId(undefined)}
                />}
        </div>
    )
}