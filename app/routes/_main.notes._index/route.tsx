import {
    Await,
    MetaFunction,
    useLoaderData,
    useNavigation,
} from "@remix-run/react";
import { notes as notesSchema } from "~/db/sqlite/schema.server";
import NoteList from "./NoteList";
import Header from "./Header";
import { LoaderFunctionArgs, defer } from "@remix-run/node";
import { getCursorPaginatedNotes } from "~/services/notes.server";
import { Suspense } from "react";
import { Skeleton } from "~/components/ui/skeleton";
import { AnimatePresence, motion } from "framer-motion";
import { authenticator } from "~/services/auth.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
    let notes: Promise<(typeof notesSchema.$inferSelect)[]> = new Promise(
        (resolve) => resolve([])
    );
    const isAuthenticated = await authenticator.isAuthenticated(request);

    const urlSearchParams = new URL(request.url).searchParams;
    const limitParamString = urlSearchParams.get("limit");
    const q = urlSearchParams.get("q");
    let limit: number | null = null;
    const withDraft = Boolean(isAuthenticated);
    if (limitParamString) {
        limit = parseInt(limitParamString);
    }

    notes = getCursorPaginatedNotes({
        lastItemId: urlSearchParams.get("last_item_id"),
        limit,
        q,
        withDraft,
    });

    return defer({ notes });
};

export const meta: MetaFunction = () => {
    return [{ title: "Notes" }];
};

export default function NotesIndex() {
    const { notes } = useLoaderData<typeof loader>();
    const navigation = useNavigation();
    const isProcessing = navigation.state !== "idle";

    return (
        <div className="container flex flex-col gap-2 pt-[5rem]">
            <Header className="mb-4" />
            <AnimatePresence>
                <Suspense
                    fallback={
                        <div className="flex flex-col gap-y-2">
                            <Skeleton className="h-[50px] w-full rounded-md" />
                            <Skeleton className="h-[50px] w-full rounded-md" />
                            <Skeleton className="h-[50px] w-full rounded-md" />
                            <Skeleton className="h-[50px] w-full rounded-md" />
                            <Skeleton className="h-[50px] w-full rounded-md" />
                        </div>
                    }
                >
                    <Await resolve={notes}>
                        {(value) => (
                            <motion.div
                                initial={{ y: 25, opacity: 0 }}
                                animate={{
                                    y: 0,
                                    opacity: 1,
                                    transition: {
                                        damping: 300,
                                        stiffness: 50,
                                    },
                                }}
                            >
                                <NoteList items={value} />
                            </motion.div>
                        )}
                    </Await>
                </Suspense>
            </AnimatePresence>

            <AnimatePresence>
                {isProcessing ? (
                    <motion.div className="fixed inset-0 bg-white bg-opacity-80 backdrop-blur-md flex items-center justify-center">
                        Loading...
                    </motion.div>
                ) : null}
            </AnimatePresence>
        </div>
    );
}
