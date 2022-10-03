import { Button, Group, Paper, Title } from "@mantine/core"
import { IconPlus } from "@tabler/icons"
import { useFirestore } from "react-redux-firebase"
import { createMap } from "../state/mapFunctions"
import { openPane } from "../state/paneReducer"
import { useAppDispatch } from "./hooks"

export default function Header() {
    const dispatch = useAppDispatch()
    const firestore = useFirestore()

    return (
        <Paper
            style={{ backgroundColor: "#eee", zIndex: 5 }}
            p={5}
        >
            <Group mx="lg" position="apart">
                <Title order={4}>
                    PME Tool
                </Title>
                <Button
                    onClick={async () => {
                        const id = createMap(firestore)
                        dispatch(openPane({ id, addingArrowFrom: undefined }))
                    }}
                    variant="light"
                    leftIcon={<IconPlus/>}
                >
                    Create map
                </Button>
            </Group>
        </Paper>
    )
}