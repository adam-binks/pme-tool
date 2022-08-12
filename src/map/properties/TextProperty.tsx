import ReactTextareaAutosize from "react-textarea-autosize"
import { AbstractProperty, Property } from "../../app/schema"
import styles from "./Property.module.css"

interface TextPropertyProps {
    property: Property | undefined  // passed only if this is on a map node
    abstractProperty: AbstractProperty
}
export default function TextProperty({ property, abstractProperty }: TextPropertyProps) {
    return (
        <>
            <label>
                {abstractProperty.name}
            </label>
            <ReactTextareaAutosize
                value={property?.value}
                //onChange={(e) => dispatch(nodeTextUpdated({ id: node.id, changes: { label: e.target.value } }))}
                className={`${styles.textInput} hiddenTextArea`}
                maxRows={8}
                disabled={property === undefined}
            />
        </>
    )
}