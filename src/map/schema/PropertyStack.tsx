import { Card, Text } from "@mantine/core"
import { useState } from "react"
import { AbstractProperty, Class, Node } from "../../app/schema"
import { useAbstractProperties, useNodesWithClass } from "../../reducers/mapSelectors"
import { PropertySuggestion } from "./PropertySuggestion"

interface PropertyStackProps {
    theClass: Class
}
export function PropertyStack({ theClass }: PropertyStackProps) {
    const [collapsed, setCollapsed] = useState(true)

    const elementsOfClass = useNodesWithClass(theClass.id, (nodesOfClass) => nodesOfClass)
    const abstractPropertyIds = new Set(elementsOfClass ? elementsOfClass.flatMap(
        (node: Node) => { return node.properties.map(prop => prop.abstractPropertyId) }
    ) as string[] : [])

    const abstractProperties = useAbstractProperties(props => props.filter(
        (p: AbstractProperty) => abstractPropertyIds.has(p.id)
    ))


    if (!(abstractProperties?.length > 0)) return <></>

    return (
        <Card.Section p={5}
            onMouseEnter={() => setCollapsed(false)}
            onMouseLeave={() => setCollapsed(true)}
        >
            <Text color="dimmed" align="center" size={"sm"}>Suggested properties</Text>
            {abstractProperties.map((property: AbstractProperty, index: number) =>
                <PropertySuggestion
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