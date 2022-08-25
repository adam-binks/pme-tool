import { useContext } from "react"
import { useFirestore } from "react-redux-firebase"
import { Schema } from "../../app/schema"
import { updateAbstractProperty } from "../../reducers/mapFunctions"
import { MapContext } from "../Map"
import PropertyComponent from "../properties/Property"
import styles from "./SchemaPane.module.css"

interface SchemaPaneProps {
    schema: Schema
}
export function SchemaPane({ schema }: SchemaPaneProps) {
    const firestore = useFirestore()
    const mapId = useContext(MapContext)

    if (!schema?.properties) {
        return (
            <div className={styles.schemaPane}>
                Schema is missing
            </div>
        )
    }

    return (
        <div className={styles.schemaPane}>
            <p>Schema</p>

            <p>Headless properties</p>

            {schema.properties.map(
                (property) => <PropertyComponent
                    key={property.id}
                    abstractProperty={property}
                    property={undefined}
                    updatePropertyValue={() => { console.error("updatePropertyValue called on schema element") }}
                />
            )}

        </div>
    )
}