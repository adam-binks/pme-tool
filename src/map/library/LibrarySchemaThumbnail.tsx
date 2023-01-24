import { ActionIcon } from "@mantine/core"
import { IconStar } from "@tabler/icons"
import { LibrarySchema } from "../../app/schema"

export function LibrarySchemaThumbnail({
    librarySchema,
    onViewDetail,
}: {
    librarySchema: LibrarySchema
    onViewDetail: (librarySchema: LibrarySchema) => void
}) {
    return (
        <div
            className="bg-peachpuff text-black rounded-lg p-2 w-40 text-left text-sm hover:scale-105 transition-transform select-none"
            onClick={() => onViewDetail(librarySchema)}
        >
            <div className="flex">
                <h3 className="font-semibold opacity-80">{librarySchema.name}</h3>
                <ActionIcon size={"xs"}>
                    <IconStar color="black" opacity={0.5} />
                </ActionIcon>
            </div>
            <p className="text-xs opacity-60 text-black">
                {librarySchema.description.substring(0, 140)}{librarySchema.description.length > 140 && "..."}
            </p>
            
        </div>
    )
}