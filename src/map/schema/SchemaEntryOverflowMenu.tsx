import { ActionIcon, Menu } from "@mantine/core"
import { IconDots, IconTrash } from "@tabler/icons"
import { useFirestore } from "react-redux-firebase"
import { useAppDispatch } from "../../app/hooks"
import { Class } from "../../app/schema"
import { enactAll } from "../../etc/firestoreHistory"
import { deleteClassCommands } from "../../state/mapFunctions"
import { useElementsWithClass, useSchema } from "../../state/mapSelectors"
import { useMapId } from "../Map"

interface SchemaEntryOverFlowMenuProps {
    theClass: Class
}
export function SchemaEntryOverFlowMenu({ theClass }: SchemaEntryOverFlowMenuProps) {
    const mapId = useMapId()
    const firestore = useFirestore()
    const dispatch = useAppDispatch()

    const classes = useSchema(schema => theClass && schema.classes)
    const elementsWithClass = useElementsWithClass(theClass.element, theClass.id, (elementsWithClass) => elementsWithClass)
    return (
        <Menu shadow="md" width={200} position="left-start">
            <Menu.Target>
                <ActionIcon radius="xl" size="xs" className="-mt-2">
                    <IconDots />
                </ActionIcon>
            </Menu.Target>
            <Menu.Dropdown>
                <Menu.Item
                    onClick={() => {
                        theClass && enactAll(dispatch, mapId, deleteClassCommands(firestore, mapId, theClass, classes, elementsWithClass))
                    }}
                    icon={<IconTrash size={14} />}>
                    Delete from schema
                </Menu.Item>
            </Menu.Dropdown>
        </Menu>
    )
}