import { ActionIcon, Textarea } from "@mantine/core"
import { IconHeading, IconLetterCase } from "@tabler/icons"
import { useFirestore } from "react-redux-firebase"
import { AbstractProperty, Property } from "../../app/schema"
import { useBatchedTextInput } from "../../etc/batchedTextInput"
import { elementHasTitle, getAbstractProperty, updateElementProperties, useAbstractProperties, useElement } from "../../reducers/mapFunctions"
import { useMapId } from "../Map"
import { textUntitled } from "./globalProperties"
import styles from "./Property.module.css"
import { PropertyControls } from "./PropertyControls"
import { PropertyLabel } from "./PropertyLabel"


interface TextPropertyProps {
    property: Property | undefined  // passed only if this is on a map node
    abstractProperty: AbstractProperty
    updatePropertyValue: (property: Property, newValue: any) => void
    textStyle: "text" | "title" | "text_untitled"
}
export default function TextProperty({ property, abstractProperty, updatePropertyValue, textStyle }: TextPropertyProps) {
    const { element, elementType } = useElement()
    const firestore = useFirestore()
    const mapId = useMapId()
    const abstractProperties = useAbstractProperties()
    const hasTitle = element && abstractProperties && elementHasTitle(element, abstractProperties)

    const label = (textStyle !== "text_untitled" && textStyle !== "title") && (
        <PropertyLabel
            abstractProperty={abstractProperty}
            labelProps={{ mb: -10 }}
        />
    )

    const batchedTextInput = useBatchedTextInput(property?.value,
        (newValue) => property && updatePropertyValue(property, newValue)
    )

    return (
        <div className="doNotPan" style={{position: "relative"}}>
            <PropertyControls abstractProperty={abstractProperty} property={property} mt={label ? undefined : 7} />
            {
                !hasTitle && <ActionIcon
                    className={styles.propertyOverflowButton}
                    title="Transform into heading"
                    onClick={() => {
                        if (!element?.id || !property) {
                            return
                        }
                        // move to be first, and make it a title
                        const filteredProps = element?.properties.filter(prop => prop.id !== property?.id)
                        filteredProps &&
                            updateElementProperties(firestore, mapId, element.id, elementType, [
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
                        updateElementProperties(firestore, mapId, element.id, elementType,
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
                        fontSize: "105%",
                        fontWeight: "bold"
                    } : undefined,
                    label: {
                        width: "95%"
                    }
                }}
                mt={!label ? 5 : undefined}
                variant="filled"
                placeholder={abstractProperty.name}
                autosize
                maxRows={8}
                disabled={property === undefined}
                {...batchedTextInput}
            />
        </div>
    )
}