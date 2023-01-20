import { EditorView } from "@codemirror/view";

export const domEventHandlers = EditorView.domEventHandlers({
    blur: (e, view) => {
        if (view.state.selection.main.empty) return
        
        // on blur clear selection
        view.dispatch({
            selection: { anchor: 0 }
        })
        view.contentDOM.blur()
    }
})