import { EditorView } from "codemirror";

export const theme = EditorView.theme({
    "&": {
        borderRadius: "10px",
    },
    "&.cm-editor.cm-focused": {
        outline: "none",
    },
    ".cm-content": {
        backgroundColor: "white",
        fontFamily: "sans-serif",
        fontSize: "12px",
        borderRadius: "5px",
    },
    ".schema-entry .cm-content": {
        fontStyle: "italic",
    },
    ".cm-property": {
        color: "#222", fontWeight: "bold", backgroundColor: "#c084fc", padding: "1px 3px",
        borderRadius: "5px",
        opacity: "0.8",
    },
    ".cm-in-schema .cm-property": {
        backgroundColor: "var(--element-colour, #4baa4b80)",
    },
    ".cm-equals": {
        fontSize: "smaller", color: "#aaa", padding: "0 2px"
    },
    ".cm-equals:first-of-type": {
        marginLeft: "8px",
    }
})