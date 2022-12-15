import { EditorView } from "@codemirror/view";

export const domEventHandlers = EditorView.domEventHandlers({
    blur: (e, view) => {
        // on blur clear selection
        view.dispatch({
            selection: { anchor: 0 }
        })
        view.contentDOM.blur()
    }
})