import { AbstractProperty, Property } from "../../app/schema";
import styles from "./Property.module.css"
import TextProperty from "./TextProperty";

interface PropertyProps {
    property: Property | undefined  // passed only if this is on a map node
    abstractProperty: AbstractProperty
    updatePropertyValue: (property: Property, newValue: any) => void
}
export default function PropertyComponent({ property, abstractProperty, updatePropertyValue }: PropertyProps) {

    return (
        <div className={`${styles.Property} doNotPan`}>
            {abstractProperty.type === "text" && 
                <TextProperty 
                    property={property}
                    abstractProperty={abstractProperty}
                    updatePropertyValue={updatePropertyValue}
                />}
            {abstractProperty.type === "checkbox" && <p>Todo implement checkbox</p>}
        </div>
    )
}