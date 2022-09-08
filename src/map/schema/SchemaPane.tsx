import { Paper, Stack, Title } from "@mantine/core"
import { MouseEvent, useEffect } from "react"
import { useFirestore } from "react-redux-firebase"
import { Schema } from "../../app/schema"
import { updateAbstractProperties, updateSchema } from "../../reducers/mapFunctions"
import { useMapId } from "../Map"
import { globalProperties } from "../properties/globalProperties"
import PropertyComponent from "../properties/Property"
import styles from "./SchemaPane.module.css"

interface SchemaPaneProps {
    schema: Schema
}
export function SchemaPane({ schema }: SchemaPaneProps) {
    const firestore = useFirestore()
    const mapId = useMapId()

    useEffect(() => {
        if (firestore && schema && schema.properties) {
            const missingGlobalProperties = globalProperties.filter(
                globalProp => !schema.properties.find(prop => prop.id === globalProp.id)
            )
            if (missingGlobalProperties.length > 0) {
                console.log("Adding missing global properties ", missingGlobalProperties)
                updateAbstractProperties(firestore, mapId, [...missingGlobalProperties, ...schema.properties])
            }
        }
    }, [])

    if (!schema) {
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
            onClick={(e: MouseEvent) => e.stopPropagation()}
        >
            <Stack>
                <Title order={3}>Schema</Title>

                <Title order={5}>Classes</Title>

                {schema.classes && schema.classes.map(
                    (theClass) => <p key={theClass.id}>{JSON.stringify(theClass)}</p>
                )}

                <Title order={5}>Headless properties</Title>

                {schema.properties && schema.properties.map(
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