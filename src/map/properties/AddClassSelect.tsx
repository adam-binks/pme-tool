import { Select } from "@mantine/core"
import { useFirestore } from "react-redux-firebase"
import { useAppDispatch, useAppSelector } from "../../app/hooks"
import { Arrow, Class, Element, elementType, Node, Schema } from "../../app/schema"
import { enactAll } from "../../etc/firestoreHistory"
import { useSelectable } from "../../etc/useSelectable"
import { addClassToElementCommands, createNewClassAndAddToElementCommands, updateSchema } from "../../reducers/mapFunctions"
import { useMapId } from "../Map"

interface AddClassSelectProps {
    elementType: elementType
    element: Element | Class
}
export function AddClassSelect({ elementType, element }: AddClassSelectProps) {
    const firestore = useFirestore()
    const dispatch = useAppDispatch()
    const mapId = useMapId()
    const schema: Schema | undefined = useAppSelector(state => state.firestore.data.maps[mapId]?.schema)
    const { onClickSelectable } = useSelectable(element.id, elementType)
    const inSchema = elementType === "class"

    const classId = elementType === "class" ? element.id : (element as Node | Arrow).classId
    const theClass = elementType === "class" ?
        element :
        classId && schema?.classes?.find(
            (cls: Class) => cls.id === classId
        )
    if (elementType === "node" && classId && !theClass) {
        console.error(`Missing class with ID ${classId}`)
    }

    if (schema?.classes === undefined) {
        console.error("No schema.classes!")
        updateSchema(firestore, dispatch, mapId, "classes", schema, [])
    }

    return (
        <Select
            key="Select type"
            className={`doNotPan doNotZoom`}
            placeholder={`＋ Set type`}
            searchable
            creatable
            nothingFound={`Name a new ${elementType} type`}
            value={classId}
            shadow="md"
            data={
                (schema?.classes !== undefined) ? schema?.classes.map(
                    (theClass: Class) => ({
                        value: theClass.id,
                        label: theClass.name,
                        group: `Existing ${elementType} types`
                    })
                ) : []
            }
            dropdownPosition="top"
            style={inSchema ? {} : { position: "absolute", width: "200px" }}
            mt={-40}
            styles={(theme) => ({
                input: {
                    backgroundColor: theClass ? "white" : "",
                    fontWeight: "bold",
                    outline: `1px solid ${theme.colors["gray"][3]}`,
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
                            input, schema.classes, schema.properties)
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
                        addClassToElementCommands(firestore, mapId, element as Element, selectedClass, schema.properties)
                    )
                }
            }}
            onClickCapture={(e) => {
                e.stopPropagation()
                onClickSelectable(e)
            }}
            onDoubleClick={(e) => e.stopPropagation()}
        />
    )
}