import { LanguageSupport, LRLanguage } from "@codemirror/language"
import { styleTags, tags as t } from "@lezer/highlight"
import { parser } from "./parser"

const parserWithMetadata = parser.configure({
    props: [
        styleTags({
            Checkbox: t.bool,
            CommandLine: t.attributeName,
            CommentLine: t.lineComment,
        }),
        // indentNodeProp.add({
        //     Application: context => context.column(context.node.from) + context.unit
        // }),
        // foldNodeProp.add({
        //     Application: foldInside
        // })
    ]
})

export const recipeLanguage = LRLanguage.define({
    parser: parserWithMetadata,
    languageData: {
        // commentTokens: { line: ";" }
    },
})

export function recipelang() {
    return new LanguageSupport(recipeLanguage)
}