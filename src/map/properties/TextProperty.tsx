import ReactTextareaAutosize from "react-textarea-autosize"
import { AbstractProperty, Property } from "../../app/schema"
import styles from "./Property.module.css"

// TODO NEXT - make the property label editable, improve style on main textarea

interface TextPropertyProps {
    property: Property | undefined  // passed only if this is on a map node
    abstractProperty: AbstractProperty
    updatePropertyValue: (property: Property, newValue: any) => void
}
export default function TextProperty({ property, abstractProperty, updatePropertyValue }: TextPropertyProps) {
    return (
        <>
            <ReactTextareaAutosize
                value={property?.value}
                //onChange={(e) => dispatch(nodeTextUpdated({ id: node.id, changes: { label: e.target.value } }))}
                className={`${styles.textInput} subtleTextArea doNotPan`}
                maxRows={8}
                disabled={property === undefined}
                onChange={(e) => property && updatePropertyValue(property, e.target.value)}
            />
        </>
    )
}