import { ActionIcon, clsx, Select } from "@mantine/core"
import { IconCheck, IconChevronLeft, IconChevronRight } from "@tabler/icons"
import { useEffect, useState } from "react"
import { Project } from "../../app/schema"
import { useProjectId } from "../../pages/ProjectView"
import { useFirestoreData } from "../../state/mapSelectors"
import { useProject } from "../../state/projectFunctions"
import { AutoAdvanceCheck, whatsNextDecks } from "../../state/whatsNextDecks"

export function WhatsNextPanel({

}: {

    }) {
    const [deck, setDeck] = useState(whatsNextDecks[0])
    const projectId = useProjectId()

    const [cardIndexByDeck, setCardIndexByDeck] = useState<{ [deck: string]: number }>(
        whatsNextDecks.reduce((acc, deck) => ({ ...acc, [deck.name]: 0 }), {}
        ))
    const cardIndex = cardIndexByDeck[deck.name]
    const card = deck.cards[cardIndex]

    const [completedCards, setCompletedCards] = useState<{ [deck: string]: number[] }>({})
    const cardIsCompleted = completedCards[deck.name] && completedCards[deck.name].includes(cardIndex)

    const [autoAdvanceTimer, setAutoAdvanceTimer] = useState<NodeJS.Timeout | undefined>(undefined)

    const [timeOpened, setTimeOpened] = useState(new Date())
    useEffect(() => setTimeOpened(new Date()), [projectId]) // whenever projectId changes, reset timeOpened

    const moveToCard = (newIndex: number, setCardIndex = true) => {
        if (setCardIndex) {
            // use length (not length - 1) to show the "deck complete" at the end
            const boundedNewIndex = Math.min(Math.max(newIndex, 0), deck.cards.length)
            setCardIndexByDeck({ ...cardIndexByDeck, [deck.name]: boundedNewIndex })
        }
        if (autoAdvanceTimer) {
            clearTimeout(autoAdvanceTimer)
            setAutoAdvanceTimer(undefined)
        }
    }

    return (
        <div className="bg-slate-400 rounded-t-lg text-white p-2">
            <Select
                data={whatsNextDecks.map(deck => deck.name)}
                value={deck.name}
                onChange={(value) => {
                    if (!value) return
                    setDeck(whatsNextDecks.find(deck => deck.name === value) || deck)
                    moveToCard(cardIndexByDeck[value], false)
                }}
                size={"xs"}
                mx={4}
                styles={{
                    input: {
                        opacity: "0.7",
                    }
                }}
            />
            <div className={clsx("flex   text-left py-2  m-1 mb-2 rounded-lg",
                cardIsCompleted && "bg-green-100",
                cardIndex === deck.cards.length ?
                    "bg-slate-500 text-white shadow-none"
                    : "text-black shadow-lg bg-white")}>
                <ActionIcon
                    onClick={() => moveToCard(cardIndex - 1)}
                    disabled={cardIndex === 0}
                    className={clsx("bg-white -ml-2 mr-2 my-auto")} size={18} color={"white"} radius={100}>
                    <IconChevronLeft size={16} className={clsx(cardIndex !== 0 && "stroke-slate-500")} />
                </ActionIcon>
                <div className="flex-grow">
                    <div className="flex justify-between">
                        <p className="text-sm select-none">
                            {card ? card.title : "You've completed this deck!"}
                        </p>
                        {cardIsCompleted && <IconCheck size={20} className="stroke-green-900" />}
                    </div>
                    <p className="text-xs select-none mr-2">
                        {card ? card.description : "Explore other decks using the dropdown above."}
                    </p>
                </div>
                <ActionIcon
                    onClick={() => moveToCard(cardIndex + 1)}
                    className={clsx("bg-white ml-2 -mr-2 my-auto", cardIndex === deck.cards.length && "hidden")}
                    size={18} color={"white"} radius={100}>
                    <IconChevronRight size={16} className="stroke-slate-500" />
                </ActionIcon>
                {card?.autoAdvance && !cardIsCompleted &&
                    <AutoAdvanceChecker
                        autoAdvanceCheck={card.autoAdvance}
                        executeAutoAdvance={() => {
                            setCompletedCards({
                                ...completedCards, [deck.name]:
                                    [...(completedCards?.[deck.name] || []), cardIndex]
                            })
                            setAutoAdvanceTimer(setTimeout(
                                () => { moveToCard(cardIndex + 1) }, 
                                ((new Date().getTime() - timeOpened.getTime()) > 1000) ? 2000 : 0
                            ))
                        }}
                    />
                }
            </div>
        </div>
    )
}

function AutoAdvanceChecker({
    autoAdvanceCheck,
    executeAutoAdvance,
}: {
    autoAdvanceCheck: AutoAdvanceCheck
    executeAutoAdvance: () => void
}) {
    const project: Project = useProject(project => project)
    const maps = useFirestoreData(data => {
        if (!data || !data.maps) return

        const maps = project.mapIds.map(mapId => data.maps[mapId])
        return maps
            .filter(map => map != undefined)
            .map(map => {
                const mapCopy = { ...map }
                mapCopy.nodes = data[`nodes.${map.id}`]
                mapCopy.arrows = data[`arrows.${map.id}`]
                return mapCopy
            })
    })

    useEffect(() => {
        if (maps && project && autoAdvanceCheck({ maps, project })) {
            executeAutoAdvance()
        }
    }, [maps, project, autoAdvanceCheck, executeAutoAdvance])

    return (
        <></>
    )
}