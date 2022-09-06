import { Textarea, TextInputProps, TextInput, Menu, ActionIcon } from "@mantine/core"
import { IconDots, IconDotsVertical } from "@tabler/icons"
import { useContext } from "react"
import { useFirestore } from "react-redux-firebase"
import { useAppSelector } from "../../app/hooks"
import { AbstractProperty } from "../../app/schema"
import { updateAbstractProperty } from "../../reducers/mapFunctions"
import { useMapId } from "../Map"
import styles from "./Property.module.css"

interface PropertyControlsProps {
    abstractProperty: AbstractProperty
}
export function PropertyControls({ abstractProperty }: PropertyControlsProps) {
    const firestore = useFirestore()
    const mapId = useMapId()
    const abstractProperties = useAppSelector(state => state.firestore.data.maps[mapId].schema.properties)

    return (
        <Menu shadow="md" width={200} position="left-start">
            <Menu.Target>
                <ActionIcon
                    className={styles.propertyOverflowButton}
                    mx="xs"
                    my={5}
                    style={{ position: "absolute", right: 0, zIndex: 2 }}
                    radius="xl"
                    size="xs"
                >
                    <IconDotsVertical />
                </ActionIcon>
            </Menu.Target>
            <Menu.Dropdown>
                <Menu.Item>Remove property (todo)</Menu.Item>
            </Menu.Dropdown>
        </Menu>
    )
}