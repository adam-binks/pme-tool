import { AbstractProperty, Property } from "../../app/schema";
import styles from "./Property.module.css"
import TextProperty from "./TextProperty";

interface PropertyProps {
    property: Property | undefined  // passed only if this is on a map node
    abstractProperty: AbstractProperty
    updateAbstractProperty: (id: string, changes: Partial<AbstractProperty>) => void
    updatePropertyValue: (property: Property, newValue: any) => void
}
export default function PropertyComponent({ property, abstractProperty, updateAbstractProperty, updatePropertyValue }: PropertyProps) {

    return (
        <div className={`${styles.Property} doNotPan`}>
            <input
                type="text" 
                className={`${styles.propertyName} subtleTextArea doNotPan`} 
                value={abstractProperty.name}
                onChange={(e) => updateAbstractProperty(abstractProperty.id, {name: e.target.value})}
            />

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