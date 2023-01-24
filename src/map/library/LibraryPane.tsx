import { Button, Overlay, ScrollArea, Skeleton, Stack, Title } from "@mantine/core"
import { showNotification } from "@mantine/notifications"
import { IconScriptPlus } from "@tabler/icons"
import { useState } from "react"
import { isLoaded, useFirestore } from "react-redux-firebase"
import { useThrottle } from "use-lodash-debounce-throttle"
import { Class, LibrarySchema } from "../../app/schema"
import { generateId, useUserId } from "../../etc/helpers"
import { emptySelection, useSelection } from "../../etc/useSelectable"
import { addLibrarySchema, copyMapSchemaToLibrary } from "../../state/libraryFunctions"
import { useFirestoreData, useMap, useSchema } from "../../state/mapSelectors"
import { useProject } from "../../state/projectFunctions"
import { LibrarySchemaDetail } from "./LibrarySchemaDetail"
import { LibrarySchemaThumbnail } from "./LibrarySchemaThumbnail"
import { LibrarySection } from "./LibrarySection"

export function LibraryPane({ }: {}) {
    const firestore = useFirestore()
    const [, setSelection] = useSelection()
    const uid = useUserId()

    const librarySchemas: { [key: string]: LibrarySchema } = useFirestoreData(state => state.librarySchemas)
    const libraryClasses: { [key: string]: Class } = useFirestoreData(state => state.libraryClasses)

    const [viewingSchemaId, setViewingSchemaId] = useState<undefined | string>(undefined)

    const allUniqueTags = Array.from(new Set(Object.values(librarySchemas).reduce((acc, schema) => {
        return [...acc, ...schema?.tags || []]
    }, [] as string[])))

    const getThumbnail = (librarySchema: LibrarySchema) =>
        librarySchema && <LibrarySchemaThumbnail
            key={librarySchema.id}
            librarySchema={librarySchema}
            onViewDetail={(librarySchema: LibrarySchema) => setViewingSchemaId(librarySchema.id)}
        />

    return (
        <div
            className={"z-10 bg-silk text-black shadow-inner-lg max-h-full"}
            onClick={(e: any) => {
                setSelection(emptySelection)
                e.stopPropagation()
            }}
        >
            <ScrollArea style={{ height: "100%" }} offsetScrollbars>
                <Stack className="w-80" p={"md"}>
                    <Title className="select-none opacity-60" order={3}>Library</Title>
                    {(!isLoaded(libraryClasses) || !isLoaded(librarySchemas)) ?
                        <Skeleton />
                        :
                        <>
                            {
                                <LibrarySection title="Your custom schemas" key="custom">
                                    <div className="my-auto flex flex-col gap-2 bg-palepink py-6 px-3 rounded-lg">
                                        <IconScriptPlus className="m-auto -mt-4" color="black" />
                                        <CopySchemaToLibraryButton />
                                        <Button
                                            onClick={() => addLibrarySchema(firestore, {
                                                id: generateId(),
                                                name: "New schema",
                                                classIds: [],
                                                createdAt: new Date(),
                                                description: "",
                                                tags: [],
                                                creator: uid,
                                                recipe: {
                                                    id: generateId(),
                                                    content: "![ ]!First, ...\n![ ]!Then, ...",
                                                }
                                            })}
                                            variant="filled"
                                            className="bg-peachcrayon text-black text-center"
                                        >
                                            New schema
                                        </Button>
                                    </div>
                                    {librarySchemas && Object.values(librarySchemas)
                                        .filter(schema => schema && schema.creator)
                                        .map((librarySchema) => getThumbnail(librarySchema))}
                                </LibrarySection>
                            }
                            {allUniqueTags.map(tag =>
                                <LibrarySection key={tag} title={tag}>
                                    {librarySchemas && Object.values(librarySchemas)
                                        .filter(schema => schema && schema?.tags && schema.tags.includes(tag)).map(
                                            (librarySchema) => getThumbnail(librarySchema)
                                        )}
                                </LibrarySection>
                            )}

                            <LibrarySection title="Other" key="uncategorised">
                                {librarySchemas && Object.values(librarySchemas)
                                    .filter(schema => schema && (!schema.tags || schema.tags.length === 0))
                                    .map((librarySchema) => getThumbnail(librarySchema))}
                            </LibrarySection>
                        </>

                        // <LibrarySection title="Your schemas">
                        //     {librarySchemas && Object.values(librarySchemas).map(
                        // (librarySchema) =>
                        // </LibrarySection>
                    }
                    {viewingSchemaId && <Overlay className="z-20" color={"#444"} blur={2} onClick={() => setViewingSchemaId(undefined)} />}
                </Stack>
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

const CopySchemaToLibraryButton = () => {
    const firestore = useFirestore()
    const mapSchema = useSchema(schema => schema)
    const throttledCopyMapSchemaToLibrary = useThrottle(copyMapSchemaToLibrary, 1000)
    const uid = useUserId()
    const mapName = useMap(map => map.name)
    const recipe = useProject(project => project.recipe)

    return (
        <Button
            onClick={() => uid ?
                throttledCopyMapSchemaToLibrary(firestore, mapSchema, mapName, uid, recipe)
                : showNotification({ message: "Oops! You're not logged in." })
            }
            variant="filled"
            className="bg-peachcrayon text-black text-center"
        >
            Save your<br />map schema
        </Button>
    )
}