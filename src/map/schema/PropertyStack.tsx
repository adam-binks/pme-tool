import { Card, Text } from "@mantine/core"
import { useRef, useState } from "react"
import { AbstractProperty, Class, Node } from "../../app/schema"
import { useAbstractProperties, useNodesWithClass } from "../../state/mapSelectors"
import { PropertySuggestion } from "./PropertySuggestion"

interface PropertyStackProps {
    theClass: Class
}
export function PropertyStack({ theClass }: PropertyStackProps) {
    const [collapsed, setCollapsed] = useState(true)

    const elementsOfClass = useNodesWithClass(theClass.id, (nodesOfClass) => nodesOfClass)
    const abstractPropertyIds = new Set(elementsOfClass ? elementsOfClass.flatMap(
        (node: Node) => {
            return node.properties.map(prop => prop.abstractPropertyId)
                .filter(propId => !theClass.propertyIds.includes(propId))
        }
    ) as string[] : [])

    const abstractProperties = useAbstractProperties(props => props.filter(
        (p: AbstractProperty) => abstractPropertyIds.has(p.id)
    ))

    const topOfStackRef = useRef<HTMLDivElement>(null)

    if (!(abstractProperties?.length > 0)) return <></>

    return (
        <Card.Section
            onMouseEnter={() => setCollapsed(false)}
            onMouseLeave={() => setCollapsed(true)}
            p={"xs"}
            m={5}
            style={{background: "#eee", borderRadius: "10px"}}
        >
            <Text color="dimmed" align="center" size={"xs"}>Add to all {theClass.name}s</Text>
            {abstractProperties.map((property: AbstractProperty, index: number) =>
                <PropertySuggestion
                    topOfStackRef={topOfStackRef}
                    key={property.id}
                    property={property}
                    collapsed={collapsed}
                    index={index}
                    theClass={theClass}
                    elementsOfClass={elementsOfClass}
                />
            )}
        </Card.Section>
    )
}