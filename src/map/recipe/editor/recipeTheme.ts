import { EditorView } from "codemirror";

export const recipeTheme = EditorView.theme({
    "&": {
        maxHeight: "275px",
        padding: "4px 4px 0 4px",
    },
    "&.cm-editor.cm-focused": {
        outline: "none",
    },
    ".cm-content": {
        fontFamily: "sans-serif",
        fontSize: "12px",
        borderRadius: "5px",
        lineHeight: "1.5",
    },
    "&.cm-scroller": {
        overflow: "auto",
    },
})