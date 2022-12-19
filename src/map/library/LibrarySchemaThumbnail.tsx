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
            className="bg-slate-400 rounded-lg p-2 w-40 text-left text-sm hover:scale-105 transition-transform select-none"
            onClick={() => onViewDetail(librarySchema)}
        >
            <div className="flex">
                <h3 className="font-semibold">{librarySchema.name}</h3>
                <ActionIcon size={"xs"}>
                    <IconStar color="white" opacity={0.5} />
                </ActionIcon>
            </div>
            <p className="text-xs opacity-80">
                {librarySchema.description.substring(0, 140)}{librarySchema.description.length > 140 && "..."}
            </p>
            
        </div>
    )
}