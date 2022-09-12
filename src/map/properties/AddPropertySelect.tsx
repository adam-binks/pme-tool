import { Select, SelectProps } from "@mantine/core";
import { useState } from "react";
import { useFirestore } from "react-redux-firebase";
import { useAppSelector } from "../../app/hooks";
import { AbstractProperty, defaultPropertyValueByType, Node, PropertyType } from "../../app/schema";
import { generateId } from "../../etc/helpers";
import { elementHasTitle, updateNodeProperties, updateSchema } from "../../reducers/mapFunctions";
import { useMapId } from "../Map";
import styles from './Property.module.css';

interface AddPropertySelectProps {
    node: Node
}
export function AddPropertySelect({ node }: AddPropertySelectProps) {
    const mapId = useMapId()
    const firestore = useFirestore()

    const [isCreatingNewProperty, setIsCreatingNewProperty] = useState("")

    const schema = useAppSelector(state => state.firestore.data.maps[mapId]?.schema)

    const createAbstractProperty = (newProperty: AbstractProperty) => {
        updateSchema(firestore, mapId, "properties",
            [...(schema?.properties ? schema.properties : []), newProperty]
        )
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
        const newProperty = {
            id: generateId(),
            abstractPropertyId: abstractProperty.id,
            value: defaultPropertyValueByType[abstractProperty.type]
        }

        updateNodeProperties(firestore, mapId, node.id, 
            // make the title the first property
            abstractProperty.type === "title" ? [newProperty, ...node.properties]
                                              : [...node.properties, newProperty]
        )
    }

    const sharedProps: Partial<SelectProps> = {
        className: `${styles.AddNewPropertySelect} doNotPan doNotZoom`,
        value: undefined,
        radius: "xl",
        variant: "filled",
        pt: 8,
        shadow: "md",
        withinPortal: true,
    }

    if (!isCreatingNewProperty) {
        const hasTitle = schema.properties && elementHasTitle(node, schema.properties)
        return (
            <Select
                key="Add property"
                placeholder="＋ Add property"
                searchable
                creatable
                nothingFound={"Type to name a new property"}
                data={
                    schema?.properties ? schema?.properties.filter(
                        (property: AbstractProperty) => 
                            (property.type !== "text_untitled") &&
                            !(hasTitle && property.type === "title")
                    ).map(
                        (property: AbstractProperty) => ({
                            value: property.id,
                            label: property.name,
                            group: "Existing properties"
                        })
                    ) : []
                }
                onClickCapture={(e) => e.stopPropagation()}
                onDoubleClick={(e) => e.stopPropagation()}
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
        let propertyTypes = [
            { value: "text", label: "Text" },
            { value: "checkbox", label: "Checkbox" },
        ]
        return (
            <Select
                key="Created property input"
                placeholder={`Choose an input for '${isCreatingNewProperty}'`}
                data={propertyTypes}
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