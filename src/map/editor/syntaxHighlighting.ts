import { HighlightStyle, syntaxHighlighting } from "@codemirror/language";
import { Decoration, DecorationSet, EditorView, MatchDecorator, ViewPlugin, ViewUpdate } from "@codemirror/view";
import { tags } from "@lezer/highlight";
import { escapeRegExp } from "lodash";
import { tagEquals } from "./language";

export const highlighting = syntaxHighlighting(HighlightStyle.define([
    {
        tag: tags.className, class: "cm-property"
    },
    { tag: tagEquals, class: "cm-equals" },
]))

export type PropertiesToHighlight = { name: string, highlight: "in schema" }[]
export const getPropertyMatcher = (propertiesToHighlight: PropertiesToHighlight) => new MatchDecorator({
    // generates regex like "\=(prop 1)|(prop 2)|(prop 3)\="
    regexp: new RegExp( "\=(?:" + 
        propertiesToHighlight.map(p => `(?:${escapeRegExp(p.name)})`).join("|") +
        `)\=`,
        "g"),
    decoration: match => { return Decoration.mark({ class: "cm-in-schema" }); },
})

export const dynamicHighlighting = (propertiesToHighlight: PropertiesToHighlight) => [
    ViewPlugin.fromClass(class {
        decorations: DecorationSet
        propertyMatcher: MatchDecorator
        constructor(view: EditorView) {
            this.propertyMatcher = getPropertyMatcher(propertiesToHighlight)
            this.decorations = this.propertyMatcher.createDeco(view)
        }
        update(update: ViewUpdate) {
            this.decorations = this.propertyMatcher.updateDeco(update, this.decorations)
        }
    }, {
        decorations: instance => instance.decorations,
    }),
]