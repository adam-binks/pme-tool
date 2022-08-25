import { Textarea, TextInputProps, TextInput } from "@mantine/core"
import { useContext } from "react"
import { useFirestore } from "react-redux-firebase"
import { useAppSelector } from "../../app/hooks"
import { AbstractProperty } from "../../app/schema"
import { updateAbstractProperty } from "../../reducers/mapFunctions"
import { MapContext } from "../Map"

interface PropertyLabelProps {
    abstractProperty: AbstractProperty
    labelProps: Partial<TextInputProps>
}
export function PropertyLabel({ abstractProperty, labelProps }: PropertyLabelProps) {
    const firestore = useFirestore()
    const mapId = useContext(MapContext)
    const abstractProperties = useAppSelector(state => state.firestore.data.maps[mapId].schema.properties)
    
    return (
        <TextInput
            value={abstractProperty.name}
            variant="unstyled"
            size="xs"
            styles={{
                input: {
                    height: "50%"
                }
            }}
            onChange={(e) => updateAbstractProperty(firestore, mapId, abstractProperties,
                 abstractProperty.id, { name: e.target.value })}
            {...labelProps}
        />
    )
}