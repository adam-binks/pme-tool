import { Paper, Stack, Text, Title } from "@mantine/core"
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
            <Paper className={styles.schemaPane}>
                Schema is missing
            </Paper>
        )
    }

    return (
        <Paper 
            className={styles.schemaPane}
            p="md"
            radius={0}
            shadow={"lg"}
        >
            <Stack>
                <Title order={3}>Schema</Title>

                <Title order={5}>Headless properties</Title>

                {schema.properties.map(
                    (property) => <PropertyComponent
                        key={property.id}
                        abstractProperty={property}
                        property={undefined}
                        updatePropertyValue={() => { console.error("updatePropertyValue called on schema element") }}
                    />
                )}
            </Stack>
        </Paper>
    )
}