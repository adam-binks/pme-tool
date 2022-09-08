import { Menu, ActionIcon } from "@mantine/core"
import { IconDotsVertical } from "@tabler/icons"
import { useFirestore } from "react-redux-firebase"
import { useAppSelector } from "../../app/hooks"
import { AbstractProperty, Property } from "../../app/schema"
import { updateNodeProperties } from "../../reducers/mapFunctions"
import { useMapId } from "../Map"
import styles from "./Property.module.css"
import { useElementId } from "./useElementId"

interface PropertyControlsProps {
    abstractProperty: AbstractProperty
    property: Property | undefined
}
export function PropertyControls({ abstractProperty, property }: PropertyControlsProps) {
    const firestore = useFirestore()
    const mapId = useMapId()
    const { elementType, elementId } = useElementId()

    const elementProperties = useAppSelector(state => {
        if (!property) return
        const store = `${elementType}s.${mapId}`
        const d = state.firestore.data[store]
        return d?.[elementId]?.properties
    })

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
                <Menu.Item onClick={() => {
                    if (property) {
                        // remove property from element
                        switch (elementType) {
                            case "node":
                                updateNodeProperties(firestore, mapId, elementId, 
                                    elementProperties.filter((prop: Property) => prop.id !== property.id)
                                )
                                break
                            default:
                                console.error("Not implemented!")
                        }
                    }
                }}>
                    Remove property
                </Menu.Item>
            </Menu.Dropdown>
        </Menu>
    )
}