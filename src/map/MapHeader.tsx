import { useFirestore } from "react-redux-firebase"
import { useAppDispatch } from "../app/hooks"
import { renameMap } from "../reducers/mapFunctions"
import { closePane } from "../reducers/paneReducer"
import { Map } from "../app/schema"
import styles from "./MapHeader.module.css"
import { CloseButton, Group, Paper, Text, TextInput } from "@mantine/core"

interface MapHeaderProps {
    map: Map
    paneIndex: number
    divRef: React.RefObject<HTMLDivElement>
}
export default function MapHeader({ map, paneIndex, divRef }: MapHeaderProps) {
    const dispatch = useAppDispatch()
    const firestore = useFirestore()

    return (
        <Paper
            ref={divRef}
            className={styles.MapHeader}
            shadow="md"
            p="xs"
            radius={0}
            onClick={(e: any) => e.stopPropagation()}
            onDoubleClick={(e: any) => e.stopPropagation()}
        >
            <Group position="apart" mx="md">
                <TextInput
                    value={map.name}
                    variant="filled"
                    size="md"
                    onChange={(e) => renameMap(firestore, map.id, e.target.value)}
                />
                <Text size="xs" color="dimmed">
                    Map ID: {map.id}
                </Text>
                <CloseButton
                    title="Close map"
                    onClick={() => dispatch(closePane(paneIndex))}
                    size="lg"
                />
            </Group>
        </Paper>
    )
}