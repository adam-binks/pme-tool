import { Paper, ScrollArea, Stack, Title } from "@mantine/core"
import { MouseEvent } from "react"
import { Schema } from "../../app/schema"
import { emptySelection, useSelection } from "../../etc/useSelectable"
import SchemaEntry from "./SchemaEntry"
import styles from "./SchemaPane.module.css"

interface SchemaPaneProps {
    schema: Schema
}
export function SchemaPane({ schema }: SchemaPaneProps) {
    const [, setSelection] = useSelection()

    if (!schema) {
        return (
            <Paper className={styles.schemaPane}>
                Schema is missing
            </Paper>
        )
    }

    return (
        <Paper
            className={"z-10"}
            p={5}
            radius={0}
            shadow={"lg"}
            onClick={(e: MouseEvent) => {
                setSelection(emptySelection)
                e.stopPropagation()
            }}
        >
            <ScrollArea style={{ height: "100%" }} offsetScrollbars>
                <Stack className="w-52" p={"md"}>
                    <Title order={3}>Schema</Title>

                    <Title order={5}>Node types</Title>
                    <Stack mt={30} spacing={50}>
                        {schema.classes && schema.classes
                            .filter(cls => cls.element === "node")
                            .map(
                                (theClass) => <SchemaEntry key={theClass.id} theClass={theClass} />
                            )}
                    </Stack>

                    <Title order={5}>Arrow types</Title>
                    <Stack mt={30} spacing={50}>
                        {schema.classes && schema.classes
                            .filter(cls => cls.element === "arrow")
                            .map(
                                (theClass) => <SchemaEntry key={theClass.id} theClass={theClass} />
                            )}
                    </Stack>
                </Stack>
            </ScrollArea>
        </Paper >
    )
}