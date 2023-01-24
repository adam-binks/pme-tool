import { ActionIcon, Button, clsx, CopyButton, Textarea } from "@mantine/core"
import { IconTrash } from "@tabler/icons"
import { sample } from "lodash"
import { useFirestore } from "react-redux-firebase"
import { useAppDispatch } from "../../app/hooks"
import { Class, LibrarySchema } from "../../app/schema"
import { BatchedTextArea } from "../../etc/BatchedTextArea"
import { useBatchedTextInput } from "../../etc/batchedTextInput"
import { enact } from "../../etc/firestoreHistory"
import { generateId, useUserId } from "../../etc/helpers"
import { createLibraryClassAndAddToSchema, deleteLibrarySchema, updateLibrarySchema } from "../../state/libraryFunctions"
import { createClassesCommand } from "../../state/mapFunctions"
import { useSchema } from "../../state/mapSelectors"
import { ELEMENT_COLOURS } from "../element/ColourPicker"
import { useMapId } from "../Map"
import { RecipeEditor } from "../recipe/editor/RecipeEditor"
import SchemaEntry from "../schema/SchemaEntry"

export function LibrarySchemaDetail({
    librarySchema,
    classes,
    closeDetail,
}: {
    librarySchema: LibrarySchema
    classes: { [key: string]: Class }
    closeDetail: () => void
}) {
    const dispatch = useAppDispatch()
    const mapId = useMapId()
    const firestore = useFirestore()
    const uid = useUserId()

    const editable = librarySchema.creator === uid

    const thisLibrarySchemaClasses = librarySchema.classIds.map((classId) => classes[classId])

    const classesInMapSchema: Class[] = useSchema(schema => schema.classes)

    const classesNotAdded: Class[] = thisLibrarySchemaClasses.filter(cls => !classesInMapSchema.some(c => c.name === cls.name))

    const batchedNameInput = useBatchedTextInput(
        librarySchema.name,
        (newName) => updateLibrarySchema(firestore, { id: librarySchema.id, name: newName })
    )

    // const batchedDescriptionInput = useBatchedTextInput(
    //     librarySchema.description,
    //     (newDescription) => updateLibrarySchema(firestore, { id: librarySchema.id, description: newDescription }),
    //     false,
    // )

    const batchedRecipeInput = useBatchedTextInput(
        librarySchema?.recipe?.content || "",
        (newRecipe) => updateLibrarySchema(firestore, {
            id: librarySchema.id, recipe: {
                ...librarySchema.recipe, content: newRecipe
            }
        })
    )

    const nodeTypes = thisLibrarySchemaClasses.filter((theClass) => theClass.element === "node")
    const arrowTypes = thisLibrarySchemaClasses.filter((theClass) => theClass.element === "arrow")

    return (
        <div className="absolute right-9 top-20 z-40 bg-peachpuff w-64 m-auto 
            text-black rounded-lg py-6 px-4 text-left text-sm flex flex-col overflow-auto"
            style={{ maxHeight: "calc(100% - 90px)" }}>
            {editable ?
                <Textarea
                    autosize
                    size="lg"
                    mb={5}
                    styles={{
                        input: {
                            background: "transparent",
                            border: "none",
                            color: "black",
                            padding: 0,
                            fontWeight: "bolder",
                        },
                    }}
                    value={batchedNameInput.value}
                    onChange={batchedNameInput.onChange}
                    onBlur={batchedNameInput.onBlur}
                    onFocus={batchedNameInput.onFocus}
                />
                :
                <h3
                    className="font-bold pb-2 text-lg"
                >{librarySchema.name}</h3>
            }

            <h4 className="font-bold text-center m-1" key="descriptionlabel">Description</h4>
            {editable ?
                <BatchedTextArea
                    content={librarySchema.description}
                    onUpdate={(newDescription) =>
                        updateLibrarySchema(firestore, { id: librarySchema.id, description: newDescription })
                    }
                    textareaProps={{
                        className: "bg-seashell",
                    }}
                />
                :
                <p className="opacity-80">{librarySchema.description}</p>
            }

            {(editable || librarySchema.recipe?.content) &&
                <div className="mt-4 flex flex-col">
                    <h4 className="font-bold text-center m-1" key="recipelabel">Recipe</h4>
                    <div className="bg-seashell border-melon border-x border-t rounded-t-md text-black">
                        <RecipeEditor
                            content={librarySchema.recipe?.content || ""}
                            onUpdate={(newRecipe) => updateLibrarySchema(firestore, {
                                id: librarySchema.id, recipe: {
                                    ...(librarySchema.recipe || {}), content: newRecipe
                                }
                            })}
                            inLibrary
                            editable={editable}
                        />
                    </div>
                    <CopyButton value={"\n" + (librarySchema.recipe?.content || "")}>
                        {({ copied, copy }) => (
                            <Button
                                className={clsx("rounded-t-none text-black",
                                    copied ? "bg-darkplatinum" : "bg-peachcrayon")}
                                onClick={copy}
                                color={copied ? "green" : "grey"}
                            >
                                {copied ? 'Copied' : 'Copy recipe to clipboard'}
                            </Button>
                        )}
                    </CopyButton>
                </div>
            }

            {(editable || thisLibrarySchemaClasses.length > 0) && <div className="flex flex-col space-y-2 mt-4">
                <h4 className="font-bold text-center" key="schema">Schema</h4>
                {[["node", nodeTypes], ["arrow", arrowTypes]].map(([elementType, elementTypes]) =>
                    elementTypes && <div className="flex flex-col gap-2" key={elementType as string}>
                        <h5 className="font-bold text-center capitalize" key={elementType as string}>
                            {elementType as string} types
                        </h5>
                        {thisLibrarySchemaClasses.map((theClass) =>
                            (theClass && theClass.element === elementType) &&
                            <div key={theClass.id} className="m-auto flex">
                                <SchemaEntry key={theClass.id} inLibrary={true} theClass={theClass} editable={editable} />
                                {editable && <ActionIcon onClick={() =>
                                    updateLibrarySchema(firestore, {
                                        id: librarySchema.id,
                                        classIds: librarySchema.classIds.filter(id => id !== theClass.id)
                                    })
                                }>
                                    <IconTrash size={16} />
                                </ActionIcon>}
                            </div>
                        )}
                    </div>
                )}
            </div>}

            {classesNotAdded.length > 0 ?
                <>
                    <Button
                        className="bg-peachcrayon text-black m-auto mt-4"
                        variant="filled"
                        onClick={() => {
                            enact(dispatch, mapId, createClassesCommand(firestore, mapId,
                                classesNotAdded.map(cls => ({ ...cls, id: generateId() })),
                                classesInMapSchema
                            ))
                        }}
                    >
                        Add all to schema
                    </Button>
                    <p className="mx-4 mt-2 italic text-xs text-darkplatinum text-center">Or drag individual classes into your schema</p>
                </>
                :
                librarySchema.classIds && librarySchema.classIds.length > 0 &&
                <p className="opacity-80 m-auto mt-4">All classes added</p>
            }

            {editable &&
                <>
                    <Button className="bg-peachcrayon text-black m-auto mt-4" variant="filled" size="xs" onClick={() =>
                        createLibraryClassAndAddToSchema(firestore, librarySchema.id,
                            {
                                id: generateId(),
                                name: "New node type",
                                content: "",
                                element: "node",
                                colour: sample(ELEMENT_COLOURS.node) as string,
                            })
                    }>
                        Add node type
                    </Button>
                    <Button className="bg-peachcrayon text-black m-auto mt-4" variant="filled" size="xs" onClick={() =>
                        createLibraryClassAndAddToSchema(firestore, librarySchema.id,
                            {
                                id: generateId(),
                                name: "New arrow type",
                                content: "",
                                element: "arrow",
                                colour: sample(ELEMENT_COLOURS.arrow) as string,
                            })
                    }>
                        Add arrow type
                    </Button>
                    <Button
                        className="bg-peachcrayon text-black m-auto mt-4"
                        variant="filled"
                        size="xs"
                        onClick={() => {
                            if (window.confirm("Are you sure you want to delete this schema?")) {
                                deleteLibrarySchema(firestore, librarySchema.id)
                                closeDetail()
                            }
                        }}
                    >
                        Delete schema
                    </Button>
                </>
            }
        </div>
    )
}