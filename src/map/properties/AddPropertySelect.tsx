import { useContext, useState } from "react";
import { useFirestore } from "react-redux-firebase";
import { Select, SelectProps } from "@mantine/core";
import { useAppSelector } from "../../app/hooks";
import { AbstractProperty, defaultPropertyValueByType, Node, PropertyType } from "../../app/schema";
import { generateId } from "../../etc/helpers";
import { updateNodeProperties, updateSchema } from "../../reducers/mapFunctions";
import { MapContext } from "../Map";
import styles from './Property.module.css'

interface AddPropertySelectProps {
    node: Node
}
export function AddPropertySelect({ node }: AddPropertySelectProps) {
    const mapId = useContext(MapContext)
    const firestore = useFirestore()

    const [isCreatingNewProperty, setIsCreatingNewProperty] = useState("")

    const schema = useAppSelector(state => state.firestore.data.maps[mapId]?.schema)

    const createAbstractProperty = (newProperty: AbstractProperty) => {
        updateSchema(firestore, mapId, {
            properties: [...schema?.properties, newProperty]
        })
    }

    const createNewPropertyAndAddToNode = (name: string, type: PropertyType) => {
        const abstractProperty = {
            id: generateId(),
            name,
            type
        }
        createAbstractProperty(abstractProperty)
        addPropertyToNode(abstractProperty)
    }

    const addPropertyToNode = (abstractProperty: AbstractProperty) => {
        updateNodeProperties(firestore, mapId, node.id, [...node.properties, {
            id: generateId(),
            abstractPropertyId: abstractProperty.id,
            value: defaultPropertyValueByType[abstractProperty.type]
        }])
    }

    const sharedProps : Partial<SelectProps> = {
        value: undefined,
        radius: "xl"
    }

    if (!isCreatingNewProperty) {
        return (
            <Select
                className={`${styles.AddNewPropertySelect} doNotPan doNotZoom`}
                placeholder="Add property"
                searchable
                creatable
                nothingFound={"Type to name a new property"}
                data={
                    schema?.properties.map(
                        (property: AbstractProperty) => ({
                            value: property.id,
                            label: property.name,
                            group: "Existing properties"
                        })
                    )
                }
                getCreateLabel={(input) => `+ Create ${input}`}
                onCreate={(input) => {
                    if (input) {
                        setIsCreatingNewProperty(input)
                        return undefined
                    }
                }}
                onChange={(newValue) => {
                    if (newValue) {
                        const property = schema?.properties.find((prop: AbstractProperty) => prop.id === newValue)
                        if (!property) {
                            console.error(`Missing property ${property}`)
                            return
                        }
                        addPropertyToNode(property)
                    }
                }}
                {...sharedProps}
            />
        )
    } else {
        return (
            <Select
                className={`${styles.AddNewPropertySelect} doNotPan doNotZoom`}
                placeholder={`Choose an input for '${isCreatingNewProperty}'`}
                data={[
                    { value: "text", label: "Text" },
                    { value: "checkbox", label: "Checkbox" },
                ]}
                onChange={(newValue) => {
                    if (newValue) {
                        createNewPropertyAndAddToNode(isCreatingNewProperty, newValue as PropertyType)
                        setIsCreatingNewProperty("")
                    }
                }}
                initiallyOpened={true}
                autoFocus={true}
                onDropdownClose={() => setIsCreatingNewProperty("")}
                {...sharedProps}
            />
        )
    }
}