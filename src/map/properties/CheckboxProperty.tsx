import ReactTextareaAutosize from "react-textarea-autosize"
import { AbstractProperty, Property } from "../../app/schema"
import styles from "./Property.module.css"

interface CheckboxPropertyProps {
    property: Property | undefined  // passed only if this is on a map node
    abstractProperty: AbstractProperty
    updatePropertyValue: (property: Property, newValue: any) => void
}
export default function CheckboxProperty({ property, abstractProperty, updatePropertyValue }: CheckboxPropertyProps) {
    return (
        <>
            <input 
                type="checkbox"
                checked={property ? property.value : true} // always check in schema, so it looks like a checkbox
                onChange={(e) => property && updatePropertyValue(property, e.target.checked)}
            />
        </>
    )
}