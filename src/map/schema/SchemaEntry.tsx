import { Button, Card, clsx } from "@mantine/core";
import { sample } from "lodash";
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
import { addLibraryClass, updateLibraryClass } from "../../state/libraryFunctions";
import { setLocalClass, useLocalClass } from "../../state/localReducer";
import { getPropertiesFromContent, updateClassCommand, updateSchemaPropertiesCommands } from "../../state/mapFunctions";
import { useElementsWithClass, useFirestoreData, useSchema } from "../../state/mapSelectors";
import { Editor } from "../editor/Editor";
import { Property } from "../editor/exposeProperties";
import { ColourPicker, ELEMENT_COLOURS } from "../element/ColourPicker";
import { useMapId } from "../Map";
import styles from "../node/Node.module.css";
import { PropertyStack } from "./PropertyStack";
import { SchemaEntryOverFlowMenu } from "./SchemaEntryOverflowMenu";
import { SchemaEntryTitle } from "./SchemaEntryTitle";


export default function SchemaEntry({
    theClass,
    inLibrary,
    editable,
}: {
    theClass: Class
    inLibrary: boolean
    editable: boolean
}) {
    const mapId = useMapId()
    const dispatch = useAppDispatch()
    const firestore = useFirestore()

    const mapClasses: Class[] = useSchema((schema) => !inLibrary && schema.classes)
    const libraryClasses: Class[] = useFirestoreData((state) => inLibrary && state.libraryClasses)
    const classes = mapClasses || libraryClasses

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

    const updateClass = (field: string) => inLibrary ?
        (newValue: string) => updateLibraryClass(firestore, { id: theClass.id, [field]: newValue })
        :
        (newValue: string) => enact(dispatch, mapId, updateClassCommand(
            firestore, mapId, classes, theClass.id,
            { [field]: newValue }
        ))
    
    const updateColour = updateClass("colour")

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
                    "m-auto",
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
                        theClass.element === "node" && "w-48",
                        theClass.element === "arrow" && "w-40 overflow-visible",
                    )}
                    ref={drag}
                    onClick={(e: MouseEvent) => {
                        onMousedownSelectable(e)
                        e.stopPropagation()
                    }}
                    onDoubleClick={(e: MouseEvent) => e.stopPropagation()} // prevent this bubbling to map
                    onMouseEnter={() => { setIsHovered(true) }}
                    onMouseLeave={() => { setIsHovered(false) }}
                >
                    <div className="flex flex-row space-x-1">
                        <ColourPicker color={theClass.colour} onChange={updateColour} elementType={theClass.element} />
                        <SchemaEntryTitle theClass={theClass} inLibrary={inLibrary} />
                        {!inLibrary && <SchemaEntryOverFlowMenu theClass={theClass} />}
                    </div>

                    <Editor
                        element={theClass}
                        editable={true}
                        updateContent={updateClass("content")}
                        extensionParams={{
                            onUpdateProperties: (newProperties) => !inLibrary && updateProperties(newProperties),
                            propertiesToHighlight: localClass ? localClass.properties.map(
                                (p: Property) => ({ name: p.name, highlight: "in schema" })
                            ) : [],
                        }}
                    />

                    <PropertyStack theClass={theClass} />

                    {!inLibrary && <Button variant={"outline"} size={"xs"} onClick={() => {
                        addLibraryClass(firestore, { ...theClass, id: generateId() })
                    }}>
                        Add to library
                    </Button>}

                </Card>
            </div>
            {/* {theClass.element === "arrow" && <div>Arr</div>} */}
        </div>
    )
}
