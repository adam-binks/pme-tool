import { ActionIcon, Button, Card, clsx, Group } from "@mantine/core";
import { MouseEvent, useEffect, useState } from "react";
import { useDrag } from "react-dnd";
import { useFirestore } from "react-redux-firebase";
import { useDebounce } from "use-lodash-debounce-throttle";
import { useAppDispatch } from "../../app/hooks";
import { Class } from "../../app/schema";
import { enact, enactAll } from "../../etc/firestoreHistory";
import { generateId } from "../../etc/helpers";
import { useSelectable } from "../../etc/useSelectable";
import { ItemTypes } from "../../ItemTypes";
import { addLibraryClassCommand } from "../../state/libraryFunctions";
import { setLocalClass, useLocalClass } from "../../state/localReducer";
import { getPropertiesFromContent, updateClassCommand, updateSchemaPropertiesCommands } from "../../state/mapFunctions";
import { useElementsWithClass, useSchema } from "../../state/mapSelectors";
import { Editor } from "../editor/Editor";
import { Property } from "../editor/exposeProperties";
import { useMapId } from "../Map";
import styles from "../node/Node.module.css";
import { AddClassSelect } from "../properties/AddClassSelect";
import { PropertyStack } from "./PropertyStack";
import { SchemaEntryOverFlowMenu } from "./SchemaEntryOverflowMenu";


export default function SchemaEntry({
    theClass,
    inLibrary,
}: {
    theClass: Class
    inLibrary: boolean
}) {
    const mapId = useMapId()
    const dispatch = useAppDispatch()
    const firestore = useFirestore()
    const classes: Class[] = useSchema((schema) => schema.classes)
    const elementsWithClass = useElementsWithClass(theClass.element, theClass.id, (elementsWithClass) => elementsWithClass)
    const localClass = useLocalClass(mapId, theClass.id)

    if (theClass.id === "") {
        console.error("Missing class!")
    }

    const [{ isDragging }, drag] = useDrag(
        () => ({
            type: inLibrary ? ItemTypes.LIBRARY_CLASS : ItemTypes.SCHEMA_CLASS,
            item: {
                id: theClass.id
            },
            collect: (monitor) => ({
                isDragging: monitor.isDragging(),
            }),
        }),
        [theClass.id],
    )

    const { isSelected, onMousedownSelectable } = useSelectable(theClass.id, "class")

    const [isHovered, setIsHovered] = useState(false)

    const updateContent = (newValue: string) => enact(dispatch, mapId, updateClassCommand(
        firestore, mapId, classes, theClass.id,
        { content: newValue }
    ))

    useEffect(() => {
        if (!inLibrary && localClass === undefined) {
            dispatch(setLocalClass({
                mapId,
                classId: theClass.id,
                class: {
                    id: theClass.id,
                    properties: getPropertiesFromContent(theClass.content)
                }
            }))
        }
    }, [])

    const updateProperties = useDebounce((newProperties: Property[]) => {
        if (localClass && localClass.properties !== newProperties) {
            enactAll(
                dispatch,
                mapId,
                updateSchemaPropertiesCommands(firestore, mapId, elementsWithClass, localClass?.properties || [], newProperties)
            )
            dispatch(setLocalClass({ mapId, classId: theClass.id, class: { properties: newProperties } }))
        }
    }, 200)

    return (
        <div className={clsx("flex flex-row m-auto", inLibrary && "cursor-grab")}>
            {/* {theClass.element === "arrow" && <div>Arr</div>} */}
            <div
                className={clsx(
                    isSelected && styles.isSelected,
                    isHovered && styles.isHovered,
                )}
                id={`class.${theClass.id}`}
            >
                <Card
                    shadow={isSelected ? "xl" : "xs"}
                    radius="md"
                    p="xs"
                    withBorder={true}
                    className={clsx(
                        isDragging && styles.isDragging,
                        "doNotPan",
                        theClass.element === "node" && "overflow-visible w-48",
                        theClass.element === "arrow" && "",
                    )
                    }
                    ref={drag}
                    onClick={(e: MouseEvent) => {
                        onMousedownSelectable(e)
                        e.stopPropagation()
                    }}
                    onDoubleClick={(e: MouseEvent) => e.stopPropagation()} // prevent this bubbling to map
                    onMouseEnter={() => { setIsHovered(true) }}
                    onMouseLeave={() => { setIsHovered(false) }}
                >
                    <AddClassSelect element={theClass} elementType={theClass.element} inSchema={true} />
                    <Group className={styles.nodeControls} my={-8} position="right" spacing="xs">
                        {inLibrary ?
                            <ActionIcon /> // this is a silly spacing hack
                            :
                            <SchemaEntryOverFlowMenu theClass={theClass} />
                        }
                    </Group>

                    <Editor
                        element={theClass}
                        editable={!inLibrary}
                        updateContent={(newValue: string) => { !inLibrary && updateContent(newValue) }}
                        extensionParams={{
                            onUpdateProperties: (newProperties) => !inLibrary && updateProperties(newProperties),
                            propertiesToHighlight: localClass ? localClass.properties.map(
                                (p: Property) => ({ name: p.name, highlight: "in schema" })
                            ) : [],
                        }}
                    />

                    <PropertyStack theClass={theClass} />

                    {!inLibrary && <Button variant={"outline"} size={"xs"} onClick={() => {
                        addLibraryClassCommand(firestore, {...theClass, id: generateId()})
                    }}>
                        Add to library
                    </Button>}

                </Card>
            </div>
            {/* {theClass.element === "arrow" && <div>Arr</div>} */}
        </div>
    )
}
