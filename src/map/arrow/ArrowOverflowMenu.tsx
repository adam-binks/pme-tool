import { ActionIcon, Menu } from "@mantine/core"
import { IconDots, IconTrash } from "@tabler/icons"
import { useFirestore } from "react-redux-firebase"
import { useAppDispatch } from "../../app/hooks"
import { Arrow } from "../../app/schema"
import { enact } from "../../etc/firestoreHistory"
import { deleteArrowCommand } from "../../state/mapFunctions"
import { useMapId } from "../Map"

interface ArrowOverFlowMenuProps {
    arrow: Arrow
}
export function ArrowOverFlowMenu({ arrow }: ArrowOverFlowMenuProps) {
    const mapId = useMapId()
    const firestore = useFirestore()
    const dispatch = useAppDispatch()

    return (
        <Menu shadow="md" width={200} position="left-start">
            <Menu.Target>
                <ActionIcon radius="xl" size="xs" className="-mt-1">
                    <IconDots />
                </ActionIcon>
            </Menu.Target>
            <Menu.Dropdown>
                <Menu.Item
                    onClick={() => {
                        enact(dispatch, mapId, deleteArrowCommand(firestore, mapId, arrow))
                    }}
                    icon={<IconTrash size={14} />}>
                    Delete
                </Menu.Item>
            </Menu.Dropdown>
        </Menu>
    )
}