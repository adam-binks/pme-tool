import { autocompletion } from "@codemirror/autocomplete";
import { Extension } from "@codemirror/state";
import { EditorView } from "codemirror";
import { autocomplete, autocompleteTheme } from "./autocomplete";
import { checkboxPlugin } from './checkbox';
import { exposeProperties, Property } from "./exposeProperties";
import { pmelang, pmeLanguage } from './language';
import { panel } from "./panel";
import { arrowDotPlugin } from "./arrowDotWidgets";
import { dynamicHighlighting, highlighting, PropertiesToHighlight } from "./syntaxHighlighting";
import { theme } from "./theme";
import { domEventHandlers } from "./domEventHandlers";

const staticExtensions: Extension[] = [
    theme,
    EditorView.lineWrapping,
    checkboxPlugin,
    pmelang(),
    pmeLanguage.data.of({ closeBrackets: { brackets: ["="] } }),
    highlighting,
    arrowDotPlugin,
    domEventHandlers,
    autocompletion({
        closeOnBlur: false,
    }),
    // autocomplete(),
    // autocompleteTheme,
    panel(),
]

export interface ExtensionParams {
    onUpdateProperties: (properties: Property[]) => void
    propertiesToHighlight: PropertiesToHighlight
}

export function extensions({onUpdateProperties, propertiesToHighlight} : ExtensionParams): Extension[] {
    return [
        ...staticExtensions,
        exposeProperties(onUpdateProperties),
        dynamicHighlighting(propertiesToHighlight),
    ]
}
