import { ActionIcon, CloseButton, Group, Paper, Text, TextInput } from "@mantine/core"
import { IconCornerUpLeft, IconCornerUpRight } from "@tabler/icons"
import { useFirestore } from "react-redux-firebase"
import { useAppDispatch, useAppSelector } from "../app/hooks"
import { Map } from "../app/schema"
import { redo, undo } from "../reducers/historyReducer"
import { renameMap } from "../reducers/mapFunctions"
import { closePane } from "../reducers/paneReducer"
import styles from "./MapHeader.module.css"

interface MapHeaderProps {
    map: Map
    paneIndex: number
    divRef: React.RefObject<HTMLDivElement>
}
export default function MapHeader({ map, paneIndex, divRef }: MapHeaderProps) {
    const dispatch = useAppDispatch()
    const firestore = useFirestore()

    const history = useAppSelector(state => state.history[map.id])

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
                    onChange={(e) => renameMap(firestore, dispatch, map.id, map.name, e.target.value)}
                />
                <Text size="xs" color="dimmed">
                    Map ID: {map.id}
                </Text>
                <Group>
                    <ActionIcon
                        title="Undo"
                        size="lg"
                        onClick={() => dispatch(undo(map.id))}
                        disabled={!history || (history.undo.length === 0)}
                    >
                        <IconCornerUpLeft />
                    </ActionIcon>
                    <ActionIcon
                        title="Redo"
                        size="lg"
                        onClick={() => dispatch(redo(map.id))}
                        disabled={!history || (history.redo.length === 0)}
                    >
                        <IconCornerUpRight />
                    </ActionIcon>
                </Group>
                <CloseButton
                    title="Close map"
                    onClick={() => dispatch(closePane(paneIndex))}
                    size="lg"
                />
            </Group>
        </Paper>
    )
}