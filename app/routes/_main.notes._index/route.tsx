import { MetaFunction, useLoaderData } from "@remix-run/react"
import { notes as notesSchema } from "~/db/sqlite/schema.server"
import NoteList from "./NoteList"
import Header from "./Header"
import { isNotesEnabled as checkNotesEnabled } from "~/services/feature.server"
import UnderConstruction from "~/components/UnderConstruction"
import { LoaderFunctionArgs } from "@remix-run/node"
import { getCursorPaginatedNotes } from "~/services/notes.server"

export const loader = async ({ request }: LoaderFunctionArgs) => {
    let notes: typeof notesSchema.$inferSelect[] = []
    const isNotesEnabled = await checkNotesEnabled()
    if (isNotesEnabled) {
        const urlSearchParams = new URL(request.url).searchParams
        const limitParamString = urlSearchParams.get("limit")
        let limit: number | null = null
        if (limitParamString) {
            limit = parseInt(limitParamString)
        }

        notes = await getCursorPaginatedNotes({
            lastItemId: urlSearchParams.get("last_item_id"),
            limit,
        })

    }

    return { notes, isNotesEnabled }
}

export const meta: MetaFunction = () => {
    return [
        { title: "Notes" }
    ]
}

export default function NotesIndex() {
    const { notes, isNotesEnabled } = useLoaderData<typeof loader>()

    if (!isNotesEnabled) {
        return (
            <div className="flex items-center justify-center h-[calc(100dvh-5rem)]">
                <UnderConstruction />
            </div>
        )
    }

    return (
        <div className="container flex flex-col gap-2  pt-[10rem">
            <Header />
            <NoteList items={notes} />
            <div>

            </div>
        </div>
    )
}
