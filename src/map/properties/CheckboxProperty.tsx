import { Checkbox, Group } from "@mantine/core"
import { AbstractProperty, Property } from "../../app/schema"
import { PropertyLabel } from "./PropertyLabel"

interface CheckboxPropertyProps {
    property: Property | undefined  // passed only if this is on a map node
    abstractProperty: AbstractProperty
    updatePropertyValue: (property: Property, newValue: any) => void
}
export default function CheckboxProperty({ property, abstractProperty, updatePropertyValue }: CheckboxPropertyProps) {
    const label = <PropertyLabel abstractProperty={abstractProperty} labelProps={{
        size: "sm"
    }} />
    return (
        <>
            <Group position="apart">
                <Checkbox
                    checked={property ? property.value : true} // always check in schema, so it looks like a checkbox
                    onChange={(e) => property && updatePropertyValue(property, e.target.checked)}
                    label={label}
                    mx={2}
                />
            </Group>
        </>
    )
}