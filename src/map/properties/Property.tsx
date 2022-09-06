import { Card, TextInput } from "@mantine/core";
import { toast } from "react-toastify";
import { AbstractProperty, Property } from "../../app/schema";
import CheckboxProperty from "./CheckboxProperty";
import styles from "./Property.module.css"
import TextProperty from "./TextProperty";

interface PropertyProps {
    property: Property | undefined  // passed only if this is on a map node
    abstractProperty: AbstractProperty
    updatePropertyValue: (property: Property, newValue: any) => void
}
export default function PropertyComponent({ property, abstractProperty, updatePropertyValue }: PropertyProps) {

    if (!abstractProperty) {
        toast.error(`Undefined prop ${property}`)
        return (<></>)
    }

    return (
        <div className={styles.Property}>
            {abstractProperty.type === "text" &&
                <TextProperty
                    property={property}
                    abstractProperty={abstractProperty}
                    updatePropertyValue={updatePropertyValue}
                    textStyle={"text"}
                />}
            {abstractProperty.type === "title" &&
                <TextProperty
                    property={property}
                    abstractProperty={abstractProperty}
                    updatePropertyValue={updatePropertyValue}
                    textStyle={"title"}
                />}
            {abstractProperty.type === "checkbox" &&
                <CheckboxProperty
                    property={property}
                    abstractProperty={abstractProperty}
                    updatePropertyValue={updatePropertyValue}
                />}
        </div>
    )
}