import { useMemo } from "react"
import { useFirestore } from "react-redux-firebase"
import Codemirror from "rodemirror"
import { useBatchedTextInput } from "../../../etc/batchedTextInput"
import { useProjectId } from "../../../pages/ProjectView"
import { updateProject, useProject } from "../../../state/projectFunctions"
import { recipeExtensions } from "./recipeExtensions"
import { recipeTheme } from "./recipeTheme"

export function RecipeEditor({

}: {

    }) {
    const firestore = useFirestore()
    const projectId = useProjectId()
    const recipe = useProject(project => project.recipe)

    const updateRecipe = (newContent: string) => {
        updateProject(firestore, projectId, { recipe: { ...recipe, content: newContent } })
    }

    const batched = useBatchedTextInput(
        recipe.content,
        updateRecipe,
    )

    const ext = useMemo(() => recipeExtensions({onUpdateProperties: () => {}, propertiesToHighlight: []}), [])

    return (
        <div className="flex-grow">
            <Codemirror
                key={"recipe"}
                extensions={ext}
                value={batched.value}
                onUpdate={(update) => {
                    if (update.docChanged) {
                        const value = update.state.doc.toString()
                        value && batched.onChangeValue(value, update)
                    }
                }}
                elementProps={{
                    className: "text-left doNotPan",
                    onFocus: batched.onFocus,
                    onBlur: batched.onBlur,
                }}
            />
        </div>
    )
}