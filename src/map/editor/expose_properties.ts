import { syntaxTree } from "@codemirror/language"
import { ViewUpdate } from "@codemirror/view"
import { Tree } from "@lezer/common"
import { EditorView } from "codemirror"

export interface Property {
    name: string
}

export const exposeProperties = (onUpdateProperties: (properties: Property[]) => void) =>
    EditorView.updateListener.of((v: ViewUpdate) => {
        if (v.docChanged) {
            const t = syntaxTree(v.state)
            onUpdateProperties(getProperties(t, (from, to) => v.state.sliceDoc(from, to)))
        }
    })

export function getProperties(t: Tree, sliceDoc: (from: number, to: number) => string) {
    const properties = t.topNode.getChildren("Property")
    return properties.map((node) => {
        const nameNode = node.getChild("PropertyName")
        const name = nameNode && sliceDoc(nameNode.from, nameNode.to)
        return {
            name 
        }
    }).filter(prop => prop.name !== null) as Property[]
}