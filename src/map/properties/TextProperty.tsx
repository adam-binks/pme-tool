import { Textarea } from "@mantine/core"
import { AbstractProperty, Property } from "../../app/schema"
import { PropertyLabel } from "./PropertyLabel"


interface TextPropertyProps {
    property: Property | undefined  // passed only if this is on a map node
    abstractProperty: AbstractProperty
    updatePropertyValue: (property: Property, newValue: any) => void
}
export default function TextProperty({ property, abstractProperty, updatePropertyValue }: TextPropertyProps) {
    const label = <PropertyLabel
        abstractProperty={abstractProperty}
        labelProps={{mb: -10}}
    />
    
    return (
        <>
            <Textarea
                value={property?.value}
                onChange={(e) => property && updatePropertyValue(property, e.currentTarget.value)}
                label={label}
                styles={{
                    label: {
                        width: "95%"
                    }
                }}
                variant="filled"
                placeholder={abstractProperty.name}
                autosize
                maxRows={8}
                disabled={property === undefined}
            />
        </>
    )
}