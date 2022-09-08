import { Textarea } from "@mantine/core"
import { AbstractProperty, Property } from "../../app/schema"
import { useBatchedTextInput } from "../../etc/batchedTextInput"
import { PropertyControls } from "./PropertyControls"
import { PropertyLabel } from "./PropertyLabel"


interface TextPropertyProps {
    property: Property | undefined  // passed only if this is on a map node
    abstractProperty: AbstractProperty
    updatePropertyValue: (property: Property, newValue: any) => void
    textStyle: "text" | "title"
}
export default function TextProperty({ property, abstractProperty, updatePropertyValue, textStyle }: TextPropertyProps) {
    const label = (textStyle !== "title") && (
        <PropertyLabel
            abstractProperty={abstractProperty}
            labelProps={{ mb: -10 }}
        />
    )

    const batchedTextInput = useBatchedTextInput(property?.value,
        (newValue) => property && updatePropertyValue(property, newValue)
    )

    return (
        <div>
            <PropertyControls abstractProperty={abstractProperty} property={property} />
            <Textarea
                label={label}
                styles={{
                    input: (textStyle === "title") ? {
                        fontSize: "105%",
                        fontWeight: "bold"
                    } : undefined,
                    label: {
                        width: "95%"
                    }
                }}
                mt={(textStyle === "title") ? 5 : undefined}
                variant="filled"
                placeholder={abstractProperty.name}
                autosize
                maxRows={8}
                disabled={property === undefined}
                {...batchedTextInput}
            />
        </div>
    )
}