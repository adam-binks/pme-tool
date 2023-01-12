import { syntaxTree } from "@codemirror/language"
import { Range } from "@codemirror/state"
import { Decoration, DecorationSet, ViewPlugin, ViewUpdate, WidgetType } from "@codemirror/view"
import { EditorView } from "codemirror"
import { ExtendedFirestoreInstance } from "react-redux-firebase"
import { addNode, getBlankNode } from "../../../state/mapFunctions"

export type ExecuteCommandFunc = (dispatch: any, firestore: ExtendedFirestoreInstance) => void

export const runCommandPlugin = (execute: (execute: ExecuteCommandFunc) => void) => ViewPlugin.fromClass(class {
    decorations: DecorationSet

    constructor(view: EditorView) {
        this.decorations = commands(view, execute)
    }

    update(update: ViewUpdate) {
        if (update.docChanged || update.viewportChanged)
            this.decorations = commands(update.view, execute)
    }
}, {
    decorations: v => v.decorations,

    // eventHandlers: {
    //     mousedown: (e, view) => {
    //         let target = e.target as HTMLElement
    //         if (target.nodeName == "INPUT")
    //             return toggleBoolean(view, view.posAtDOM(target))
    //     }
    // },
})

class CommandWidget extends WidgetType {
    constructor(readonly runCommand: () => void) { super() }

    eq(other: CommandWidget) { return false }

    toDOM() {
        let wrap = document.createElement("span")
        wrap.setAttribute("aria-hidden", "true")
        wrap.className = "cm-boolean-toggle mr-1 bg-[#bbbbbb51] py-[1px] pr-[2px]"
        let playBtn = wrap.appendChild(document.createElement("button"))
        playBtn.className = "bg-pink-600 hover:bg-pink-400 opacity-80 text-white rounded-full "
            + "pl-[5px] pr-[3px] pb-[1px] pt-[2px] my-auto text-[8px] user-select-none"
        playBtn.textContent = "▶"

        playBtn.onclick = (e: any) => {
            this.runCommand()
            e.preventDefault()

            playBtn.textContent = "✓"
            setTimeout(() => playBtn.textContent = "▶", 1000)
        }

        return wrap
    }

    ignoreEvent() { return false }
}

function commands(view: EditorView, execute: (execute: ExecuteCommandFunc) => void) {
    let widgets: Range<Decoration>[] = []
    for (let { from, to } of view.visibleRanges) {
        syntaxTree(view.state).iterate({
            from, to,
            enter: (node) => {
                if (node.name === "Command") {
                    const commandString = view.state.doc.sliceString(node.from, node.to)
                    console.log(commandString)
                    let deco = Decoration.widget({
                        widget: new CommandWidget(() => execute((dispatch, firestore) => {
                            const mapId = "d7a4be7d9d9d2733513a24f9"
                            addNode(firestore, dispatch, mapId, {
                                ...getBlankNode(),
                                content: "Created by recipe",
                            })
                            console.log("Command executed")
                        })),
                        side: 1,
                    })
                    widgets.push(deco.range(node.to))
                }
            }
        })
    }
    return Decoration.set(widgets)
}