import { Textarea, TextInputProps, TextInput } from "@mantine/core"
import { useContext } from "react"
import { useFirestore } from "react-redux-firebase"
import { useAppDispatch, useAppSelector } from "../../app/hooks"
import { AbstractProperty } from "../../app/schema"
import { useBatchedTextInput } from "../../etc/batchedTextInput"
import { updateAbstractProperty } from "../../reducers/mapFunctions"
import { useMapId } from "../Map"

interface PropertyLabelProps {
    abstractProperty: AbstractProperty
    labelProps: Partial<TextInputProps>
}
export function PropertyLabel({ abstractProperty, labelProps }: PropertyLabelProps) {
    const firestore = useFirestore()
    const dispatch = useAppDispatch()
    const mapId = useMapId()
    const abstractProperties = useAppSelector(state => state.firestore.data.maps[mapId].schema.properties)
    
    const batchedTextInput = useBatchedTextInput(
        abstractProperty.name,
        (newValue) => updateAbstractProperty(firestore, dispatch, mapId, abstractProperties,
            abstractProperty.id, { name: newValue })
    )

    return (
        <TextInput
            // value={abstractProperty.name}
            variant="unstyled"
            size="xs"
            styles={{
                input: {
                    height: "50%"
                }
            }}
            // onChange={(e) => updateAbstractProperty(firestore, mapId, abstractProperties,
            //      abstractProperty.id, { name: e.target.value })}
            {...labelProps}
            {...batchedTextInput}
        />
    )
}