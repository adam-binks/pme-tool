import { ActionIcon, ScrollArea, Title } from "@mantine/core";
import { IconArrowRight } from "@tabler/icons";
import React from "react";
import { useRef } from "react";

export function LibrarySection({
    title,
    children,
}: {
    title: string,
    children: React.ReactNode,
}) {
    const viewport = useRef<HTMLDivElement>(null)

    const scroll = (offset: number) =>
        viewport.current && viewport.current.scrollBy({ left: offset, behavior: 'smooth' })

    return (
        <div>
            <Title order={5} align="left" className="mb-2 text-slate-200 select-none">
                {title}
            </Title>
            <div className="flex">
                <ScrollArea viewportRef={viewport}>
                    <div className="flex gap-4 p-1">
                        {children}
                    </div>
                </ScrollArea>
                {React.Children.count(children) > 1 &&
                    <ActionIcon
                        className="bg-slate-700 rounded-full -mx-2 my-auto"
                        onClick={() => scroll(120)}
                    >
                        <IconArrowRight />
                    </ActionIcon>
                }
            </div>
        </div>
    )
}