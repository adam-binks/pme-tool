import { AbstractProperty, Property } from "../../app/schema";
import CheckboxProperty from "./CheckboxProperty";
import styles from "./Property.module.css";
import TextProperty from "./TextProperty";

interface PropertyProps {
    property: Property | undefined  // passed only if this is on a map node
    abstractProperty: AbstractProperty
    updatePropertyValue: (property: Property, newValue: any) => void
    zoomedOutMode?: boolean
}
export default function PropertyComponent({ property, abstractProperty, updatePropertyValue, zoomedOutMode }: PropertyProps) {

    if (!abstractProperty) {
        console.error(`Undefined prop ${property}`)
        return (<></>)
    }

    const getPropertyElement = () => {
        switch (abstractProperty.type) {
            case "text":
            case "title":
            case "text_untitled":
                return <TextProperty
                    property={property}
                    abstractProperty={abstractProperty}
                    updatePropertyValue={updatePropertyValue}
                    textStyle={abstractProperty.type}
                    zoomedOutMode={zoomedOutMode === true}
                />

            case "checkbox":
                return <CheckboxProperty
                    property={property}
                    abstractProperty={abstractProperty}
                    updatePropertyValue={updatePropertyValue}
                />

            default:
                return <p>Unhandled property type {abstractProperty.type}</p>
        }

    }
    
    const propertyElement = getPropertyElement()
    return <div className={`${styles.Property} doNotPan`} style={{position: "relative"}}>
        {propertyElement}
    </div>
}