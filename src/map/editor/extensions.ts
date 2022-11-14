import { autocompletion } from "@codemirror/autocomplete";
import { Extension } from "@codemirror/state";
import { EditorView } from "codemirror";
import { autocomplete, autocompleteTheme } from "./autocomplete";
import { checkboxPlugin } from './checkbox';
import { exposeProperties, Property } from "./expose_properties";
import { pmelang, pmeLanguage } from './language';
import { panel } from "./panel";
import { highlighting } from "./syntaxHighlighting";

const staticExtensions: Extension[] = [
    EditorView.baseTheme({
        ".cm-content": {
            fontFamily: "sans-serif",
            fontSize: "14px",
        }
    }),
    EditorView.lineWrapping,
    checkboxPlugin,
    pmelang(),
    pmeLanguage.data.of({ closeBrackets: { brackets: ["="] } }),
    highlighting,
    autocompletion({
        closeOnBlur: false,
    }),
    autocomplete(),
    autocompleteTheme,
    panel(),
]

export function extensions(onUpdateProperties: (properties: Property[]) => void): Extension[] {
    return [
        ...staticExtensions,
        exposeProperties(onUpdateProperties),
    ]
}
