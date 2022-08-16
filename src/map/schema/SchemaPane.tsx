import { Schema } from "../../app/schema"
import PropertyComponent from "../properties/Property"
import styles from "./SchemaPane.module.css"

interface SchemaPaneProps {
    schema: Schema
}
export function SchemaPane({ schema }: SchemaPaneProps) {

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