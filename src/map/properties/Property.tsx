import { toast } from "react-toastify";
import { AbstractProperty, Property } from "../../app/schema";
import CheckboxProperty from "./CheckboxProperty";
import styles from "./Property.module.css"
import TextProperty from "./TextProperty";

interface PropertyProps {
    property: Property | undefined  // passed only if this is on a map node
    abstractProperty: AbstractProperty
    updateAbstractProperty: (id: string, changes: Partial<AbstractProperty>) => void
    updatePropertyValue: (property: Property, newValue: any) => void
}
export default function PropertyComponent({ property, abstractProperty, updateAbstractProperty, updatePropertyValue }: PropertyProps) {

    if (!abstractProperty) {
        toast.error(`Undefined prop ${property}`)
        return (<></>)
    }

    return (
        <div className={`${styles.Property} doNotPan`} key={abstractProperty.id}>
            <input
                type="text"
                className={`${styles.propertyName} subtleTextArea doNotPan`}
                value={abstractProperty.name}
                onChange={(e) => updateAbstractProperty(abstractProperty.id, { name: e.target.value })}
            />

            {abstractProperty.type === "text" &&
                <TextProperty
                    property={property}
                    abstractProperty={abstractProperty}
                    updatePropertyValue={updatePropertyValue}
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