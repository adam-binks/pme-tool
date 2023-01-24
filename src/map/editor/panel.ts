import { cursorCharBackward, insertBlankLine, selectCharLeft } from "@codemirror/commands"
import { EditorView, showPanel } from "@codemirror/view"

function createPanel(view: EditorView) {
    let div = document.createElement("div")
    div.className = "cm-btn-panel absolute -mt-2 right-0 -mr-1 p-2 text-xs hidden"
    let btn = div.appendChild(document.createElement("button"))
    btn.className = "text-black px-2 py-1 rounded-md hover:opacity-90 shadow-lg"
    btn.setAttribute("style", "background-color: var(--element-colour, #475569)")
    btn.textContent = "Add =property="

    btn.addEventListener("click", () => {
        insertBlankLine({state: view.state, dispatch: view.dispatch})
        view.dispatch(view.state.replaceSelection("= ="))
        setTimeout(() => {
            cursorCharBackward(view)
            selectCharLeft(view)
        })
    })
    return { top: false, dom: div }
}

const panelTheme = EditorView.baseTheme({
    "&.cm-focused .cm-btn-panel": {
        display: "block",
    },
    ".cm-panels": {
        border: "none",
        background: "none",
    }
})

export function panel() {
    return [showPanel.of(createPanel), panelTheme]
}