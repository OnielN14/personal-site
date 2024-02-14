import { MetaFunction, useLoaderData } from "@remix-run/react"
import { db } from "~/db/sqlite/connection.server"
import { notes as notesSchema } from "~/db/sqlite/schema.server"
import NoteList from "./NoteList"
import Header from "./Header"
import { isNotesEnabled as checkNotesEnabled } from "~/services/feature.server"
import UnderConstruction from "~/components/UnderConstruction"

export const loader = async () => {
    let notes: typeof notesSchema.$inferSelect[] = []
    const isNotesEnabled = await checkNotesEnabled()
    if (isNotesEnabled) {
        notes = await db.query.notes.findMany({
            orderBy: (schema, ord) => [ord.desc(schema.updated_at)]
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
