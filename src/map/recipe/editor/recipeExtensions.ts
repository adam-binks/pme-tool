import { autocompletion } from "@codemirror/autocomplete";
import { Extension } from "@codemirror/state";
import { placeholder, keymap } from "@codemirror/view";
import {indentWithTab} from "@codemirror/commands"
import { EditorView } from "codemirror";
import { domEventHandlers } from "../../editor/domEventHandlers";
import { exposeProperties, Property } from "../../editor/exposeProperties";
import { dynamicHighlighting, PropertiesToHighlight } from "../../editor/syntaxHighlighting";
import { recipelang } from "./recipeLanguage";
import { recipeTheme } from "./recipeTheme";
import { addCheckboxOnNewline, stepCheckboxPlugin } from "./stepCheckbox";
import { highlighting } from "./syntaxHighlighting";

const staticRecipeExtensions: Extension[] = [
    recipeTheme,
    recipelang(),
    EditorView.lineWrapping,
    placeholder("Plan out what you'll do"),
    domEventHandlers,
    autocompletion({
        closeOnBlur: false,
    }),
    highlighting,
    stepCheckboxPlugin,
    addCheckboxOnNewline,
    keymap.of([indentWithTab]),
    // autocomplete(),
    // autocompleteTheme,
]

export interface ExtensionParams {
    onUpdateProperties: (properties: Property[]) => void
    propertiesToHighlight: PropertiesToHighlight
}

export function recipeExtensions({onUpdateProperties, propertiesToHighlight} : ExtensionParams): Extension[] {
    return [
        ...staticRecipeExtensions,
        exposeProperties(onUpdateProperties),
        dynamicHighlighting(propertiesToHighlight),
    ]
}
