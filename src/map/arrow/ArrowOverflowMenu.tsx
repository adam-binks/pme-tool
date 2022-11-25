import { ActionIcon, Menu } from "@mantine/core"
import { IconDots, IconTrash } from "@tabler/icons"
import { useFirestore } from "react-redux-firebase"
import { useAppDispatch, useAppSelector } from "../../app/hooks"
import { Arrow, Class } from "../../app/schema"
import { enact } from "../../etc/firestoreHistory"
import { deleteArrowCommand } from "../../state/mapFunctions"
import { useMapId } from "../Map"

interface ArrowOverFlowMenuProps {
    arrow: Arrow | undefined
    theClass: Class | undefined
}
export function ArrowOverFlowMenu({ arrow, theClass }: ArrowOverFlowMenuProps) {
    const mapId = useMapId()
    const firestore = useFirestore()
    const dispatch = useAppDispatch()
    const arrows = useAppSelector(state => state.firestore.data[`arrows.${mapId}`])
    return (
        <Menu shadow="md" width={200} position="left-start">
            <Menu.Target>
                <ActionIcon radius="xl" style={{}} size="sm">
                    <IconDots />
                </ActionIcon>
            </Menu.Target>
            <Menu.Dropdown>
                <Menu.Item
                    onClick={() => {
                        arrow && enact(dispatch, mapId, deleteArrowCommand(firestore, mapId, arrow))
                        theClass && console.error("Not yet implemented")
                    }}
                    icon={<IconTrash size={14} />}>
                    Delete
                </Menu.Item>
            </Menu.Dropdown>
        </Menu>
    )
}