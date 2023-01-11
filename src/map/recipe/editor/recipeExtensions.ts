import { autocompletion } from "@codemirror/autocomplete";
import { indentWithTab } from "@codemirror/commands";
import { Extension } from "@codemirror/state";
import { keymap, placeholder } from "@codemirror/view";
import { EditorView } from "codemirror";
import { domEventHandlers } from "../../editor/domEventHandlers";
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
]

export function recipeExtensions(): Extension[] {
    return [
        ...staticRecipeExtensions,
    ]
}
