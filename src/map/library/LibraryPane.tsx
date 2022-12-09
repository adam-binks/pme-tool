import { Overlay, ScrollArea, Stack, Title } from "@mantine/core"
import { useState } from "react"
import { isLoaded } from "react-redux-firebase"
import { Class, LibrarySchema } from "../../app/schema"
import { emptySelection, useSelection } from "../../etc/useSelectable"
import { useFirestoreData } from "../../state/mapSelectors"
import { LibrarySchemaDetail } from "./LibrarySchemaDetail"
import { LibrarySchemaThumbnail } from "./LibrarySchemaThumbnail"

export function LibraryPane({

}: {

    }) {
    const [, setSelection] = useSelection()

    const librarySchemas: { [key: string]: LibrarySchema } = useFirestoreData(state => state.librarySchemas)
    const libraryClasses: { [key: string]: Class } = useFirestoreData(state => state.libraryClasses)

    const [viewingSchemaId, setViewingSchemaId] = useState<undefined | string>(undefined)

    return (
        <div
            className={"z-10 bg-slate-500 text-white shadow-inner-lg"}
            onClick={(e: any) => {
                setSelection(emptySelection)
                e.stopPropagation()
            }}
        >
            <ScrollArea style={{ height: "100%" }} offsetScrollbars>
                <Stack className="w-80" p={"md"}>
                    <Title order={3}>Library</Title>
                    {(!isLoaded(libraryClasses) || !isLoaded(librarySchemas)) ?
                        <p>Loading...</p>
                        :
                        <>
                            {librarySchemas && Object.values(librarySchemas).map(
                                (librarySchema) =>
                                    <LibrarySchemaThumbnail
                                        key={librarySchema.id}
                                        librarySchema={librarySchema}
                                        onViewDetail={(librarySchema: LibrarySchema) => setViewingSchemaId(librarySchema.id)}
                                    />
                            )}
                            <Title order={4}>All classes</Title>
                            {libraryClasses && Object.values(libraryClasses).map(
                                (libraryClass) => <p key={libraryClass.id}>{libraryClass.name}</p>
                            )}

                            {viewingSchemaId && <Overlay className="z-20" color={"#444"} blur={2} onClick={() => setViewingSchemaId(undefined)} />}
                        </>
                    }
                </Stack>
            </ScrollArea>
            {(viewingSchemaId && librarySchemas[viewingSchemaId]) &&
                <LibrarySchemaDetail
                    librarySchema={librarySchemas[viewingSchemaId]} 
                    classes={libraryClasses}
                />}
        </div>
    )
}