import { useLoaderData } from "@remix-run/react"
import { db } from "~/db/sqlite/connection.server"
import NoteList from "./NoteList"
import Header from "./Header"

export const loader = async () => {
    const notes = await db.query.notes.findMany({
        orderBy: (schema, ord) => [ord.desc(schema.updated_at)]
    })

    return { notes }
}

export default function NotesIndex() {
    const { notes } = useLoaderData<typeof loader>()

    return (
        <div className="flex flex-col gap-2">
            <Header />
            <NoteList items={notes} />
            <div>

            </div>
        </div>
    )
}