import { ActionIcon, Textarea } from "@mantine/core"
import { IconHeading, IconLetterCase } from "@tabler/icons"
import { useFirestore } from "react-redux-firebase"
import { useAppDispatch } from "../../app/hooks"
import { AbstractProperty, Property } from "../../app/schema"
import { useBatchedTextInput } from "../../etc/batchedTextInput"
import { CommandDebounce } from "../../etc/firestoreHistory"
import { updateElementProperties } from "../../reducers/mapFunctions"
import { elementHasTitle, getAbstractProperty, useAllAbstractProperties, useArrows, useElement } from "../../reducers/mapSelectors"
import { useMapId } from "../Map"
import { textUntitled } from "./globalProperties"
import styles from "./Property.module.css"
import { PropertyControls } from "./PropertyControls"
import { PropertyLabel } from "./PropertyLabel"


interface TextPropertyProps {
    property: Property | undefined  // passed only if this is on a map node
    abstractProperty: AbstractProperty
    updatePropertyValue: (property: Property, newValue: any, debounce?: CommandDebounce) => void
    textStyle: "text" | "title" | "text_untitled"
    zoomedOutMode: boolean
}
export default function TextProperty({ property, abstractProperty, updatePropertyValue, textStyle, zoomedOutMode }: TextPropertyProps) {
    const { element, elementType } = useElement()
    const firestore = useFirestore()
    const dispatch = useAppDispatch()
    const mapId = useMapId()
    const abstractProperties = useAllAbstractProperties()
    const hasTitle = element && abstractProperties && elementHasTitle(element, abstractProperties)

    const label = (textStyle !== "text_untitled" && textStyle !== "title") && (
        <PropertyLabel
            abstractProperty={abstractProperty}
            labelProps={{ mb: -10 }}
        />
    )

    const batchedTextInput = useBatchedTextInput(property?.value,
        (newValue) => property && updatePropertyValue(property, newValue, {
            target: `${property.id}-text-update`,
            intervalMs: 2000,
            timestamp: new Date(),
        })
    )

    const fontScaler = zoomedOutMode ? 2 : 1

    return (
        <>
            <PropertyControls abstractProperty={abstractProperty} property={property} mt={label ? undefined : 7} />
            {
                element && !hasTitle && <ActionIcon
                    className={styles.propertyOverflowButton}
                    title="Transform into heading"
                    onClick={() => {
                        if (!element?.id || !property) {
                            return
                        }
                        // move to be first, and make it a title
                        const filteredProps = element?.properties.filter(prop => prop.id !== property?.id)
                        filteredProps &&
                            updateElementProperties(firestore, dispatch, mapId, element.id, elementType, element.properties, [
                                {
                                    ...property,
                                    abstractPropertyId: "title",
                                },
                                ...filteredProps
                            ])
                    }}
                    mx="xs"
                    my={5}
                    style={{ position: "absolute", right: 0, top: 22, zIndex: 2 }}
                    radius="xl"
                    size="xs"
                >
                    <IconHeading />
                </ActionIcon>
            }
            {
                textStyle === "title" && <ActionIcon
                    className={styles.propertyOverflowButton}
                    title="Transform into paragraph"
                    onClick={() => {
                        if (!element?.id || !property) {
                            return
                        }
                        updateElementProperties(firestore, dispatch, mapId, element.id, elementType, element.properties,
                            element.properties.map(prop => getAbstractProperty(prop, abstractProperties)?.type === "title" ?
                                {
                                    ...prop,
                                    abstractPropertyId: textUntitled,
                                } : prop))
                    }}
                    mx="xs"
                    my={5}
                    style={{ position: "absolute", right: 0, top: 22, zIndex: 2 }}
                    radius="xl"
                    size="xs"
                >
                    <IconLetterCase />
                </ActionIcon>
            }
            <Textarea
                label={label}
                styles={{
                    input: (textStyle === "title") ? {
                        fontSize: `${105 * fontScaler}%`,
                        fontWeight: "bold"
                    } : {
                        fontSize: `${14 * fontScaler}px`,
                    },
                    label: {
                        width: "95%"
                    }
                }}
                mt={!label ? 5 : undefined}
                variant="filled"
                placeholder={abstractProperty.name}
                autosize
                autoFocus={textStyle === "text_untitled"}
                maxRows={8}
                disabled={property === undefined}
                {...batchedTextInput}
            />
        </>
    )
}