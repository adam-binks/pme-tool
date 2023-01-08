import { EditorView } from "codemirror";

export const recipeTheme = EditorView.theme({
    "&": {
        height: "275px",
        borderRadius: "10px",
        padding: "4px",
    },
    "&.cm-editor.cm-focused": {
        outline: "none",
    },
    ".cm-content": {
        fontFamily: "sans-serif",
        fontSize: "14px",
        borderRadius: "5px",
    },
})