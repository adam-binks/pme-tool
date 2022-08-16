import { useFirestore } from "react-redux-firebase";
import Select from "react-select";
import { useAppSelector } from "../../app/hooks";
import { AbstractProperty, defaultPropertyValueByType, Node, Property, PropertyType } from "../../app/schema";
import { generateId } from "../../etc/helpers";
import { updateNodeProperties, updateSchema } from "../../reducers/mapFunctions";

interface AddPropertySelectProps {
    mapId: string
    node: Node
}
export function AddPropertySelect({ mapId, node }: AddPropertySelectProps) {
    const firestore = useFirestore()

    const options = [
        { value: "text", label: "Text" },
        { value: "checkbox", label: "Checkbox" },
    ]

    const schema = useAppSelector(state => state.firestore.data.maps[mapId]?.schema)
    const addAbstractProperty = (newProperty: AbstractProperty) => {
        updateSchema(firestore, mapId, {
            properties: [...schema?.properties, newProperty]
        })
    }

    const createNewPropertyAndAddToNode = (name: string, type: PropertyType) => {
        const abstractPropertyId = generateId()
        addAbstractProperty({
            id: abstractPropertyId,
            name,
            type
        })
        addProperty({
            id: generateId(),
            abstractPropertyId,
            value: defaultPropertyValueByType[type]
        })
    }

    const addProperty = (property: Property) => {
        updateNodeProperties(firestore, mapId, node.id, [...node.properties, property])
    }

    return (
        <Select
            className="doNotPan"
            value={null} // So it goes back to "Add property" on select an option 
            placeholder="Add property"
            options={options}
            onChange={(e, meta) => {
                if (e?.value) {
                    createNewPropertyAndAddToNode("New property", e.value as PropertyType)
                }
            }}
        />
    )
}