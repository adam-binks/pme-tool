import { cursorCharBackward, insertBlankLine, selectCharLeft } from "@codemirror/commands"
import { StateEffect, StateField } from "@codemirror/state"
import { EditorView, showPanel } from "@codemirror/view"

const togglePanel = StateEffect.define<boolean>()

const panelState = StateField.define<boolean>({
    create: () => true,
    update(value, tr) {
        for (let e of tr.effects) if (e.is(togglePanel)) value = e.value
        return value
    },
    provide: f => showPanel.from(f, on => on ? createPanel : null)
})



function createPanel(view: EditorView) {
    let dom = document.createElement("div")
    dom.className = "cm-help-panel"
    let btn = dom.appendChild(document.createElement("button"))
    btn.className = "cm-button"
    btn.textContent = "Add a =property="
    btn.addEventListener("click", () => {
        insertBlankLine({state: view.state, dispatch: view.dispatch})
        view.dispatch(view.state.replaceSelection("= ="))
        setTimeout(() => {
            cursorCharBackward(view)
            selectCharLeft(view)
        })
    })
    return { top: false, dom }
}

const helpTheme = EditorView.baseTheme({
    ".cm-help-panel": {
        border: "none",
        display: "none",
    },
    "&.cm-focused .cm-help-panel": {
        display: "block",
        padding: "5px 10px",
        fontSize: "small"
    },
    ".cm-panels": {
        border: "none",
        background: "none",
    },
    ".cm-button": {
        borderRadius: "5px",
        bottom: "0px",
        position: "relative",
    }
})

export function panel() {
    return [showPanel.of(createPanel), helpTheme]
}