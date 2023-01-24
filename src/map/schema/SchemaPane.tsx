import { clsx, Paper, ScrollArea, Stack, Title } from "@mantine/core"
import { showNotification } from "@mantine/notifications"
import { MouseEvent } from "react"
import { useDrop } from "react-dnd"
import { useFirestore } from "react-redux-firebase"
import { useAppDispatch } from "../../app/hooks"
import { Class, Schema } from "../../app/schema"
import { enact } from "../../etc/firestoreHistory"
import { generateId, truthyLog } from "../../etc/helpers"
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

    function addCopyOfClassToSchema(classToAdd: Class) {
        if (schema.classes.some(c => c.name === classToAdd.name)) {
            showNotification({
                title: `You already have a class named ${classToAdd.name}`,
                message: "Try renaming it first",
            })
            return
        }
        // add a copy of the class to the schema
        enact(
            dispatch,
            mapId,
            createClassesCommand(firestore, mapId, [{ ...classToAdd, id: generateId() }], schema.classes)
        )
    }

    const [{ draggedItemCouldBeDroppedHere, dropItemOver }, drop] = useDrop(
        () => ({
            accept: [ItemTypes.LIBRARY_CLASS, ItemTypes.SCHEMA_CLASS],
            drop(item: DragItem, monitor) {
                if (monitor.getItemType() === ItemTypes.LIBRARY_CLASS) {
                    if (!libraryClasses || !libraryClasses[item.id]) {
                        console.warn("Could not drop library class")
                        return
                    }

                    const libraryClass = libraryClasses[item.id]
                    addCopyOfClassToSchema(libraryClass)
                }

                if (monitor.getItemType() === ItemTypes.SCHEMA_CLASS) {
                    if (item.mapId !== mapId && item.theClass) {
                        addCopyOfClassToSchema(item.theClass)
                    }
                }
                return undefined
            },
            collect: (monitor) => ({
                draggedItemCouldBeDroppedHere: monitor.canDrop() && (
                    monitor.getItemType() === ItemTypes.LIBRARY_CLASS || monitor.getItem()?.mapId !== mapId
                ),
                dropItemOver: monitor.isOver(),
            }),
        }),
        [dispatch, schema.classes, libraryClasses, addCopyOfClassToSchema],
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
            className={clsx("z-10 flex flex-col justify-between h-full bg-seashellpale border-l border-seashell shadow-seashell",
                draggedItemCouldBeDroppedHere && "bg-blue-50",
                draggedItemCouldBeDroppedHere && dropItemOver && "bg-blue-200",
            )}
            ref={(el: any) => drop(el)}
            p={5}
            radius={0}
            shadow={"xs"}
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
                    <Title className="select-none opacity-60" order={3}>Schema</Title>

                    <Title className="select-none text-darkplatinum" order={5}>Node types</Title>
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

                    <Title className="select-none text-darkplatinum" order={5}>Arrow types</Title>
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