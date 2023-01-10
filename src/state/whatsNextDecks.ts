import { Arrow, Node, Map, Project } from "../app/schema"
import { truthyLog } from "../etc/helpers"

export interface WhatsNextDeck {
    name: string
    cards: WhatsNextCard[]
}

interface WhatsNextCard {
    title: string
    description: string
    autoAdvance?: AutoAdvanceCheck
}

export type AutoAdvanceCheck = (data: AutoAdvanceData) => boolean

interface AutoAdvanceData {
    maps: (Map & {nodes: Node[], arrows: Arrow[]})[]
    project: Project
}

export const whatsNextDecks: WhatsNextDeck[] = [
    {
        name: "How to add structure to your map",
        cards: [
            {
                title: "Add your first node",
                description: "Double click to add a node, and start adding ideas to your map.",
                autoAdvance: (data) => data.maps.some(
                    map => map?.nodes && Object.values(map.nodes).length > 0
                )
            },
            {
                title: "Add another node",
                description: "Add another node to your map with a double click.",
                autoAdvance: (data) => data.maps.some(
                    map => map?.nodes && Object.values(map.nodes).length > 1
                )
            },
            {
                title: "Add your first arrow",
                description: "Click two purple dots to add an arrow connecting them.",
                autoAdvance: (data) => data.maps.some(
                    map => map?.arrows && Object.values(map.arrows).length > 0
                )
            },
            {
                title: "Add the type of a node",
                description: "Select a node and add a type to it. What kind of thing is it?",
                autoAdvance: (data) => data.maps.some(
                    map => map?.nodes && Object.values(map.nodes).some(node => node.classId != null)
                )
            },
            {
                title: "Add a property to a node",
                description: "Record structured information on your nodes. For example: =Confidence= 80%.",
                autoAdvance: (data) => data.maps.some(
                    map => map?.nodes && Object.values(map.nodes).some(node => node.content.match(/\=.*\=/))
                )
            },
            {
                title: "Add a property to all nodes of a type",
                description: "In the schema, add a property to add it to all nodes of that type. For example: =Confidence=.",
                autoAdvance: (data) => data.maps.some(
                    map => map.schema.classes.some(cls => cls.content.match(/\=.*\=/))
                )
            },
            {
                title: "Add the type of an arrow",
                description: "Select an arrow and add a type to it. What kind of relation is it?",
                autoAdvance: (data) => data.maps.some(
                    map => map?.arrows && Object.values(map.arrows).some(arrow => arrow.classId != null)
                )
            },
        ]
    },
    {
        name: "How to get unstuck",
        cards: [
            {
                title: "Rubber duck debugging",
                description: "Record a voice note where you explain your current problem aloud, using words anyone could understand.",
            }
        ]
    }
]