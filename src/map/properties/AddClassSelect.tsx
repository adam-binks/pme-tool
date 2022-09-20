import { Select } from "@mantine/core"
import { useFirestore } from "react-redux-firebase"
import { useAppSelector } from "../../app/hooks"
import { Arrow, Class, elementType, Node, Schema } from "../../app/schema"
import { generateId } from "../../etc/helpers"
import { useSelectable } from "../../etc/useSelectable"
import { updateArrow, updateNode, updateSchema } from "../../reducers/mapFunctions"
import { useMapId } from "../Map"

interface AddClassSelectProps {
    elementType: elementType
    element: Node | Arrow | Class
}
export function AddClassSelect({ elementType, element }: AddClassSelectProps) {
    const firestore = useFirestore()
    const mapId = useMapId()
    const schema: Schema | undefined = useAppSelector(state => state.firestore.data.maps[mapId]?.schema)
    const { onClickSelectable } = useSelectable(element.id, elementType)

    const createClass = (newClass: Class) => {
        schema && updateSchema(firestore, mapId, "classes", [...schema.classes, newClass])
    }

    const addClassToElement = (newClass: Class) => {
        if (elementType === "node") {
            updateNode(firestore, mapId, element.id, { classId: newClass.id })
        }
        if (elementType === "arrow") {
            updateArrow(firestore, mapId, element.id, { classId: newClass.id })
        }
    }

    const createNewClassAndAddToElement = (name: string) => {
        const newClass: Class = {
            id: generateId(),
            name,
            element: elementType,
            propertyIds: [],
        }
        createClass(newClass)
        addClassToElement(newClass)
    }

    if (schema?.classes === undefined) {
        console.error("No schema.classes!")
        updateSchema(firestore, mapId, "classes", [])
    }

    const classId = elementType === "class" ? element.id : (element as Node | Arrow).classId
    const theClass = elementType === "class" ?
        element :
        classId && schema?.classes?.find(
            (cls: Class) => cls.id === classId
        )
    if (elementType === "node" && classId && !theClass) {
        console.error(`Missing class with ID ${classId}`)
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
            style={{ position: "absolute" }}
            mt={-40}
            styles={(theme) => ({
                input: {
                    backgroundColor: theClass ? "white" : "",
                    fontWeight: "bold",
                }
            })}
            pb={5}
            withinPortal
            radius="xl"
            variant="filled"
            getCreateLabel={(input) => `+ Create ${input}`}
            onCreate={(input) => {
                if (input) {
                    createNewClassAndAddToElement(input)
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
                    addClassToElement(selectedClass)
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