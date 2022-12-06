import { syntaxTree } from "@codemirror/language"
import { Range } from "@codemirror/state"
import { Decoration, DecorationSet, ViewPlugin, ViewUpdate, WidgetType } from "@codemirror/view"
import { EditorView } from "codemirror"

export const arrowDotPlugin =
    ViewPlugin.fromClass(class {
        decorations: DecorationSet

        constructor(view: EditorView) {
            this.decorations = arrowDots(view)
        }

        update(update: ViewUpdate) {
            if (update.docChanged || update.viewportChanged)
                this.decorations = arrowDots(update.view)
        }
    }, {
        decorations: v => v.decorations,
    })

export function getArrowDotPropertyClass(property: string) {
    const safeProperty = property.replaceAll(/[!"#$%&'()*+,./:;<=>?@[\\\]^`{|}~\s]/g, '-')
    return `arrow-dot-property-${safeProperty}`
}

class ArrowDotWidget extends WidgetType {
    constructor(readonly property: string) { super() }

    eq(other: ArrowDotWidget) { return other.property == this.property }

    toDOM() {
        let placeholder = document.createElement("span")
        placeholder.setAttribute("aria-hidden", "true")
        placeholder.className = "cm-arrowdot"
        const child = placeholder.appendChild(document.createElement("span"))
        child.className = getArrowDotPropertyClass(this.property)
        return placeholder
    }

    ignoreEvent() { return false }
}

function arrowDots(view: EditorView) {
    let widgets: Range<Decoration>[] = []
    for (let { from, to } of view.visibleRanges) {
        syntaxTree(view.state).iterate({
            from, to,
            enter: (node) => {
                if (node.name === "PropertyName") {
                    const property = view.state.doc.sliceString(node.from, node.to)
                    let deco = Decoration.widget({
                        widget: new ArrowDotWidget(property),
                        side: 1,
                    })
                    widgets.push(deco.range(node.from))
                }
            }
        })
    }
    return Decoration.set(widgets)
}