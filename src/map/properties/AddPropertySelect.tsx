import { useContext, useState } from "react";
import { useFirestore } from "react-redux-firebase";
import Creatable from "react-select/creatable";
import Select from "react-select";
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

    const sharedProps = {
        value: null,
        styles: {
            menu: (base: any) => ({
                ...base,
                marginTop: -1,
            }),
            menuPortal: (base: any) => ({ ...base, zIndex: 9999 })
        },
        menuPortalTarget: document.body
    }

    if (!isCreatingNewProperty) {
        return (
            <Creatable
                className={`${styles.AddNewPropertySelect} doNotPan`}
                placeholder="Add property"
                noOptionsMessage={() => <p>Type to name a new property</p>}
                options={[
                    {
                        label: "Existing properties",
                        options: schema?.properties.map(
                            (property: AbstractProperty) => ({ value: property.id, label: property.name })
                        )
                    }
                ]}
                onCreateOption={(input) => {
                    if (input) {
                        setIsCreatingNewProperty(input)
                    }
                }}
                onChange={(newValue, meta) => {
                    if (newValue) {
                        const property = schema?.properties.find((prop: AbstractProperty) => prop.id === (newValue as any).value)
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
                className={`${styles.AddNewPropertySelect} doNotPan`}
                placeholder={`Choose an input for '${isCreatingNewProperty}'`}
                options={[
                    { value: "text", label: "Text" },
                    { value: "checkbox", label: "Checkbox" },
                ]}
                onChange={(e, meta) => {
                    if (e?.value) {
                        createNewPropertyAndAddToNode(isCreatingNewProperty, e.value as PropertyType)
                        setIsCreatingNewProperty("")
                    }
                }}
                menuIsOpen={true}
                autoFocus={true}
                onMenuClose={() => setIsCreatingNewProperty("")}
                {...sharedProps}
            />
        )
    }
}