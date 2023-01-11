import { ActionIcon, clsx, Title } from "@mantine/core"
import { IconChevronDown, IconChevronUp } from "@tabler/icons"
import { useState } from "react"
import { useFirestore } from "react-redux-firebase"
import { useProjectId } from "../../pages/ProjectView"
import { updateProject, useProject } from "../../state/projectFunctions"
import { RecipeEditor } from "./editor/RecipeEditor"
import { WhatsNextPanel } from "./WhatsNextPanel"

export function RecipePane({

}: {
    }) {
    const firestore = useFirestore()
    const projectId = useProjectId()
    const recipe = useProject(project => project.recipe)


    const [collapsed, setCollapsed] = useState(false)


    const updateRecipe = (newContent: string) => {
        updateProject(firestore, projectId, { recipe: { ...recipe, content: newContent } })
    }

    return (
        <div className={clsx(
            "bg-slate-100 w-64 absolute left-4 z-20 bottom-0 rounded-t-lg shadow-xl"
        )}>
            <div
                className="bg-slate-500 rounded-t-lg p-1 flex justify-center relative cursor-pointer"
                onClick={() => setCollapsed(!collapsed)}
            >
                <Title order={3} className="text-white opacity-90 justify-self-center select-none">
                    Recipe
                </Title>
                <ActionIcon className="absolute right-2" variant="transparent">
                    {collapsed ?
                        <IconChevronUp color="white" size={24} className="opacity-70 hover:opacity-100" />
                        :
                        <IconChevronDown color="white" size={24} className="opacity-70 hover:opacity-100" />
                    }
                </ActionIcon>
            </div>
            {!collapsed &&
                <div className="flex flex-col gap-2">
                    <RecipeEditor content={recipe.content} onUpdate={updateRecipe} />
                    <WhatsNextPanel />
                </div>
            }
        </div>
    )
}