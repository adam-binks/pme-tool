import { Paper, ScrollArea, Stack, Title } from "@mantine/core"
import { MouseEvent } from "react"
import { useFirestore } from "react-redux-firebase"
import { useAppDispatch } from "../../app/hooks"
import { Schema } from "../../app/schema"
import { emptySelection, useSelection } from "../../etc/useSelectable"
import { useMapId } from "../Map"
import SchemaEntry from "./SchemaEntry"
import styles from "./SchemaPane.module.css"

interface SchemaPaneProps {
    schema: Schema
}
export function SchemaPane({ schema }: SchemaPaneProps) {
    const firestore = useFirestore()
    const dispatch = useAppDispatch()
    const mapId = useMapId()

    const [, setSelection] = useSelection()

    // useEffect(() => {
    //     if (firestore && schema && schema.properties) {
    //         const missingGlobalProperties = globalProperties.filter(
    //             globalProp => !schema.properties.find(prop => prop.id === globalProp.id)
    //         )
    //         if (missingGlobalProperties.length > 0) {
    //             console.log("Adding missing global properties ", missingGlobalProperties)
    //             updateAbstractProperties(firestore, dispatch, mapId, schema.properties,
    //                 [...missingGlobalProperties, ...schema.properties])
    //         }
    //     }
    // }, [firestore, mapId, schema])

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
            p={5}
            radius={0}
            shadow={"lg"}
            onClick={(e: MouseEvent) => {
                setSelection(emptySelection)
                e.stopPropagation()
            }}
        >
            <ScrollArea style={{ height: "100%" }} offsetScrollbars>
                <Stack p={"md"}>
                    <Title order={3}>Schema</Title>

                    <Title order={5}>Node types</Title>

                    <Stack mt={30} spacing={50}>
                        {schema.classes && schema.classes.map(
                            (theClass) => <SchemaEntry key={theClass.id} theClass={theClass} />
                        )}
                    </Stack>

                    {/* <Title order={5}>Headless properties</Title>

                    {schema.properties && schema.properties.map(
                        (property) => <PropertyComponent
                            key={property.id}
                            abstractProperty={property}
                            property={undefined}
                            updatePropertyValue={() => { console.error("updatePropertyValue called on schema element") }}
                        />
                    )} */}
                </Stack>
            </ScrollArea>
        </Paper >
    )
}