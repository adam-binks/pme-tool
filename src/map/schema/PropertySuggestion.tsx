import { ActionIcon, Card, Group } from "@mantine/core";
import { IconPlus } from "@tabler/icons";
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
    topOfStackRef: React.RefObject<HTMLDivElement>
}
export function PropertySuggestion({ theClass, property, collapsed, index, elementsOfClass, topOfStackRef }: PropertySuggestionProps) {
    const firestore = useFirestore()
    const dispatch = useAppDispatch()
    const mapId = useMapId()
    const classes = useSchema((schema) => schema.classes)
    
    const height = collapsed && topOfStackRef?.current?.offsetHeight //.getBoundingClientRect()?.height
    const marginTop = (collapsed && height && index > 0) ? 5 - height : 0
    
    return (
        <Card
            p={5}
            shadow="xs"
            className={styles.PropertySuggestionsCard}
            withBorder
            {...index === 0 ? {ref: topOfStackRef} : {} }
            mt={marginTop}
            style={{
                zIndex: 50 - index, // make the low index items show on top of the others
                ...(collapsed && height ? {
                    transform: `scale(${1 - 0.02 * index})`,
                    height
                } : {
                    transform: "scale(1)"
                }),
            }}
        >
            {<Group style={(index !== 0 && collapsed) ? {display: "none"} : {}} noWrap>
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
                            theClass, elementsOfClass))}
                >
                    <IconPlus />
                </ActionIcon>
            </Group>}
        </Card>
    )
}