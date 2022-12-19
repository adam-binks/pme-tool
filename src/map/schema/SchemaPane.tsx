import { Paper, ScrollArea, Stack, Title } from "@mantine/core"
import { showNotification } from "@mantine/notifications"
import { MouseEvent } from "react"
import { useDrop } from "react-dnd"
import { useFirestore } from "react-redux-firebase"
import { useAppDispatch } from "../../app/hooks"
import { Class, Schema } from "../../app/schema"
import { enact } from "../../etc/firestoreHistory"
import { emptySelection, useSelection } from "../../etc/useSelectable"
import { ItemTypes } from "../../ItemTypes"
import { createClassesCommand } from "../../state/mapFunctions"
import { useFirestoreData } from "../../state/mapSelectors"
import { ToggleLibraryButton } from "../library/ToggleLibraryButton"
import { DragItem, useMapId } from "../Map"
import SchemaEntry from "./SchemaEntry"
import styles from "./SchemaPane.module.css"

interface SchemaPaneProps {
    schema: Schema
}
export function SchemaPane({ schema }: SchemaPaneProps) {
    const [, setSelection] = useSelection()

    const dispatch = useAppDispatch()
    const firestore = useFirestore()
    const mapId = useMapId()

    const libraryClasses: { [key: string]: Class } = useFirestoreData(data => data.libraryClasses)

    const [, drop] = useDrop(
        () => ({
            accept: [ItemTypes.LIBRARY_CLASS],
            drop(item: DragItem, monitor) {
                if (monitor.getItemType() === ItemTypes.LIBRARY_CLASS) {
                    if (!libraryClasses || !libraryClasses[item.id]) {
                        console.warn("Could not drop library class")
                        return
                    }

                    const libraryClass = libraryClasses[item.id]
                    if (schema.classes.some(c => c.name === libraryClass?.name)) {
                        showNotification({
                            title: `You already have a class named ${libraryClass.name}`,
                            message: "Try renaming it first",
                        })
                        return
                    }
                    // add a copy of the libraryClass to the schema
                    enact(dispatch, mapId, createClassesCommand(firestore, mapId, [libraryClass], schema.classes))
                }

                return undefined
            },
        }),
        [dispatch, schema.classes, libraryClasses],
    )

    if (!schema) {
        return (
            <Paper className={styles.schemaPane}>
                Schema is missing
            </Paper>
        )
    }

    return (
        <Paper
            className={"z-10 flex flex-col h-full"}
            ref={(el: any) => drop(el)}
            p={5}
            radius={0}
            shadow={"lg"}
            onClick={(e: MouseEvent) => {
                setSelection(emptySelection)
                e.stopPropagation()
            }}
            onDoubleClick={(e: MouseEvent) => {
                e.stopPropagation()
            }}
        >
            <ScrollArea offsetScrollbars>
                <Stack className="w-52" p={"md"}>
                    <Title className="select-none" order={3}>Schema</Title>

                    <Title className="select-none" order={5}>Node types</Title>
                    <Stack mt={-10} spacing={10}>
                        {schema.classes && schema.classes
                            .filter(cls => cls.element === "node")
                            .map((theClass) =>
                                    <SchemaEntry
                                        key={theClass.id}
                                        theClass={theClass}
                                        inLibrary={false}
                                        editable={true}
                                    />
                            )}
                    </Stack>

                    <Title className="select-none" order={5}>Arrow types</Title>
                    <Stack mt={-10} spacing={10}>
                        {schema.classes && schema.classes
                            .filter(cls => cls.element === "arrow")
                            .map((theClass) =>
                                    <SchemaEntry
                                        key={theClass.id}
                                        theClass={theClass}
                                        inLibrary={false}
                                        editable={true}
                                    />
                            )}
                    </Stack>
                </Stack>
            </ScrollArea>
            <ToggleLibraryButton />
        </Paper >
    )
}