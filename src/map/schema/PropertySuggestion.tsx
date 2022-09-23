import { ActionIcon, Card, Group } from "@mantine/core";
import { IconPlus } from "@tabler/icons";
import { useRef } from "react";
import { useFirestore } from "react-redux-firebase";
import { useAppDispatch } from "../../app/hooks";
import { AbstractProperty, Class, Element } from "../../app/schema";
import { enactAll } from "../../etc/firestoreHistory";
import { addPropertyToClassCommands } from "../../reducers/mapFunctions";
import { useSchema } from "../../reducers/mapSelectors";
import { useMapId } from "../Map";
import PropertyComponent from "../properties/Property";
import styles from "./SchemaPane.module.css";

interface PropertySuggestionProps {
    theClass: Class
    property: AbstractProperty
    collapsed: boolean
    index: number
    elementsOfClass: Element[]
}
export function PropertySuggestion({ theClass, property, collapsed, index, elementsOfClass }: PropertySuggestionProps) {
    const firestore = useFirestore()
    const dispatch = useAppDispatch()
    const mapId = useMapId()
    const classes = useSchema((schema) => schema.classes)
    
    const ref = useRef<HTMLDivElement>(null)
    const height = collapsed && ref.current?.getBoundingClientRect()?.height
    const marginTop = (collapsed && height && index > 0) ? 5 - height : 0
    
    return (
        <Card
            p={5}
            shadow="xs"
            className={styles.PropertySuggestionsCard}
            withBorder
            ref={ref}
            mt={marginTop}
            style={{
                zIndex: 50 - index, // make the low index items show on top of the others
                ...(collapsed ? {transform: `scale(${1 - 0.02 * index})`} : {transform: "scale(1)"}),
            }}
        >
            <Group noWrap>
                <PropertyComponent
                    property={undefined}
                    abstractProperty={property}
                    updatePropertyValue={() => { }}
                    key={property.id}
                />
                <ActionIcon
                    title="Add to everything of this type"
                    size="sm"
                    onClick={() => enactAll(dispatch, mapId, addPropertyToClassCommands(firestore, mapId, property, classes, 
                            theClass, elementsOfClass))} //todo
                >
                    <IconPlus />
                </ActionIcon>
            </Group>
        </Card>
    )
}