import { clsx, Select } from "@mantine/core"
import { useFirestore } from "react-redux-firebase"
import { useAppDispatch, useAppSelector } from "../../app/hooks"
import { Arrow, Class, Element, elementType, Node, Schema } from "../../app/schema"
import { enactAll } from "../../etc/firestoreHistory"
import { useSelectable } from "../../etc/useSelectable"
import { addClassToElementCommands, createNewClassAndAddToElementCommands, updateSchema } from "../../state/mapFunctions"
import { useMapId } from "../Map"

interface AddClassSelectProps {
    elementType: elementType
    element: Element | Class
    zoomedOutMode?: boolean
    inSchema?: boolean
}
export function AddClassSelect({ elementType, element, inSchema, zoomedOutMode }: AddClassSelectProps) {
    const firestore = useFirestore()
    const dispatch = useAppDispatch()
    const mapId = useMapId()
    const schema: Schema | undefined = useAppSelector(state => state.firestore.data.maps[mapId]?.schema)
    const { onMousedownSelectable } = useSelectable(element.id, elementType)

    const classId = inSchema ? element.id : (element as Node | Arrow).classId
    const theClass = inSchema ?
        element as Class :
        classId ? schema?.classes?.find(
            (cls: Class) => cls.id === classId
        ) : undefined
    if (elementType === "node" && classId && !theClass) {
        console.error(`Missing class with ID ${classId}`)
    }

    if (schema?.classes === undefined) {
        console.error("No schema.classes!")
        updateSchema(firestore, dispatch, mapId, "classes", schema, [])
    }

    const fontScaler = zoomedOutMode ? 2 : 1

    return (
        <Select
            key="Select type"
            className={clsx(`doNotPan doNotZoom mx-auto`,
                elementType === "arrow" && "w-20",
            )}
            placeholder={`＋ Type`}
            searchable
            creatable
            nothingFound={`Name a new ${elementType} type`}
            value={classId}
            shadow="md"
            data={
                (schema?.classes !== undefined) ? schema?.classes
                    .filter((cls: Class) => cls.element === elementType)
                    .map(
                        (theClass: Class) => ({
                            value: theClass.id,
                            label: theClass.name,
                            group: `Existing ${elementType} types`
                        })
                    ) : []
            }
            dropdownPosition="top"
            mt={-40}
            styles={(theme) => ({
                input: {
                    textAlign: "center",
                    padding: "0 12px",
                    backgroundColor: theClass ? "white" : "",
                    fontWeight: "bold",
                    outline: `1px solid ${theme.colors["gray"][3]}`,
                    fontSize: `${(elementType === "arrow" ? 10 : 14) * fontScaler}px`
                },
                rightSection: {
                    display: "none",
                }
            })}
            pb={5}
            withinPortal
            radius="xl"
            variant="filled"
            getCreateLabel={(input) => `+ Create ${input}`}
            onCreate={(input) => {
                if (input) {
                    schema && !inSchema && enactAll(dispatch, mapId,
                        createNewClassAndAddToElementCommands(firestore, mapId, element as Element, elementType,
                            input, schema.classes)
                    )
                    return undefined
                }
            }}
            onChange={(newValue) => {
                if (newValue) {
                    const selectedClass = schema?.classes.find((cls: Class) => cls.id === newValue)
                    if (!selectedClass) {
                        console.error(`Missing class ${selectedClass}`)
                        return
                    }
                    schema && !inSchema && enactAll(dispatch, mapId,
                        addClassToElementCommands(firestore, mapId, element as Element, theClass, selectedClass)
                    )
                }
            }}
            onClick={(e) => e.stopPropagation()}
            onMouseDownCapture={(e) => {
                e.stopPropagation()
                onMousedownSelectable(e)
            }
            }
            onDoubleClick={(e) => e.stopPropagation()}
        />
    )
}