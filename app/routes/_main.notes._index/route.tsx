import { Await, MetaFunction, useLoaderData } from "@remix-run/react"
import { notes as notesSchema } from "~/db/sqlite/schema.server"
import NoteList from "./NoteList"
import Header from "./Header"
import { isNotesEnabled as checkNotesEnabled } from "~/services/feature.server"
import UnderConstruction from "~/components/UnderConstruction"
import { LoaderFunctionArgs, defer } from "@remix-run/node"
import { getCursorPaginatedNotes } from "~/services/notes.server"
import { Suspense } from "react"
import { Skeleton } from "~/components/ui/skeleton"
import { AnimatePresence, motion } from "framer-motion"

export const loader = async ({ request }: LoaderFunctionArgs) => {
    let notes: Promise<typeof notesSchema.$inferSelect[]> = new Promise((resolve) => resolve([]))
    const isNotesEnabled = await checkNotesEnabled()
    if (isNotesEnabled) {
        const urlSearchParams = new URL(request.url).searchParams
        const limitParamString = urlSearchParams.get("limit")
        const q = urlSearchParams.get("q")
        let limit: number | null = null
        if (limitParamString) {
            limit = parseInt(limitParamString)
        }

        notes = getCursorPaginatedNotes({
            lastItemId: urlSearchParams.get("last_item_id"),
            limit,
            q
        })

    }

    return defer({ notes, isNotesEnabled })
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
        <div className="container flex flex-col gap-2 pt-[5rem]">
            <Header className="mb-4" />
            <AnimatePresence>
                <Suspense fallback={(
                    <div className="flex flex-col gap-y-2">
                        <Skeleton className="h-[50px] w-full rounded-md" />
                        <Skeleton className="h-[50px] w-full rounded-md" />
                        <Skeleton className="h-[50px] w-full rounded-md" />
                        <Skeleton className="h-[50px] w-full rounded-md" />
                        <Skeleton className="h-[50px] w-full rounded-md" />
                    </div>
                )} >
                    <Await resolve={notes} >
                        {(value) => (
                            <motion.div initial={{ y: 25, opacity: 0 }} animate={{
                                y: 0, opacity: 1, transition: {
                                    damping: 300,
                                    stiffness: 50
                                }
                            }}>
                                <NoteList items={value} />
                            </motion.div>
                        )}
                    </Await>
                </Suspense>

            </AnimatePresence>
        </div>
    )
}
