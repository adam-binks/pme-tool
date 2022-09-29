import { Select, SelectProps } from "@mantine/core";
import { useState } from "react";
import { useFirestore } from "react-redux-firebase";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { AbstractProperty, Element, PropertyType } from "../../app/schema";
import { enact, enactAll } from "../../etc/firestoreHistory";
import { generateId } from "../../etc/helpers";
import { addPropertyToElementCommand, createNewPropertyAndAddToElementCommands } from "../../reducers/mapFunctions";
import { elementHasTitle } from "../../reducers/mapSelectors";
import { useMapId } from "../Map";
import styles from './Property.module.css';

interface AddPropertySelectProps {
    element: Element
}
export function AddPropertySelect({ element }: AddPropertySelectProps) {
    const mapId = useMapId()
    const firestore = useFirestore()
    const dispatch = useAppDispatch()

    const [isCreatingNewProperty, setIsCreatingNewProperty] = useState("")

    const schema = useAppSelector(state => state.firestore.data.maps[mapId]?.schema)

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
        const hasTitle = schema.properties && elementHasTitle(element, schema.properties)
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
                        enact(dispatch, mapId,
                            addPropertyToElementCommand(firestore, mapId, element, property)
                        )
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
                        enactAll(dispatch, mapId,
                            createNewPropertyAndAddToElementCommands(firestore, mapId, schema,
                                {
                                    id: generateId(),
                                    name: isCreatingNewProperty,
                                    type: newValue as PropertyType
                                }, element)
                        )
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