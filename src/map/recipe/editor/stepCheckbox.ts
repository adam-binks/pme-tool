import { syntaxTree } from "@codemirror/language"
import { Range } from "@codemirror/state"
import { Decoration, DecorationSet, keymap, ViewPlugin, ViewUpdate, WidgetType } from "@codemirror/view"
import { EditorView } from "codemirror"

export const addCheckboxOnNewline = keymap.of([{
    key: "Enter",
    run(view: EditorView) {
        view.dispatch(view.state.replaceSelection("\n![ ]!"))
        return true
    },
    preventDefault: true,
}])

export const stepCheckboxPlugin = ViewPlugin.fromClass(class {
    decorations: DecorationSet

    constructor(view: EditorView) {
        this.decorations = checkboxes(view)
    }

    update(update: ViewUpdate) {
        if (update.docChanged || update.viewportChanged)
            this.decorations = checkboxes(update.view)
    }
}, {
    decorations: v => v.decorations,

    eventHandlers: {
        mousedown: (e, view) => {
            let target = e.target as HTMLElement
            if (target.nodeName == "INPUT")
                return toggleBoolean(view, view.posAtDOM(target))
        }
    }
})

class CheckboxWidget extends WidgetType {
    constructor(readonly checked: true | false | "in progress") { super() }

    eq(other: CheckboxWidget) { return other.checked == this.checked }

    toDOM() {
        let wrap = document.createElement("span")
        wrap.setAttribute("aria-hidden", "true")
        wrap.className = "cm-boolean-toggle mr-1"
        let box = wrap.appendChild(document.createElement("input"))
        box.type = "checkbox"
        box.checked = this.checked === true
        box.indeterminate = this.checked === "in progress"
        return wrap
    }

    ignoreEvent() { return false }
}

function checkboxes(view: EditorView) {
    let widgets: Range<Decoration>[] = []
    for (let { from, to } of view.visibleRanges) {
        syntaxTree(view.state).iterate({
            from, to,
            enter: (node) => {
                if (node.name === "Checkbox") {
                    const checkboxString = view.state.doc.sliceString(node.from, node.to)
                    const checkboxState = {
                        "![ ]!": false,
                        "![o]!": "in progress",
                        "![x]!": true
                    }[checkboxString]
                    if (checkboxState !== undefined) {
                        let deco = Decoration.replace({
                            widget: new CheckboxWidget(checkboxState as boolean | "in progress"),
                        })
                        widgets.push(deco.range(node.from, node.to))
                    }
                }
            }
        })
    }
    return Decoration.set(widgets)
}

function toggleBoolean(view: EditorView, pos: number) {
    let before = view.state.doc.sliceString(Math.max(0, pos - "![ ]!".length), pos)
    let change
    if (before == "![ ]!")
        change = { from: pos - "![ ]!".length, to: pos, insert: "![o]!" }
    else if (before.endsWith("![o]!"))
        change = { from: pos - "![o]!".length, to: pos, insert: "![x]!" }
    else if (before.endsWith("![x]!"))
        change = { from: pos - "![x]!".length, to: pos, insert: "![ ]!" }
    else
        return false
    
    view.dispatch({ changes: change })
    return true
}