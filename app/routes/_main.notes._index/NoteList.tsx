import { Link } from "@remix-run/react"
import { Note } from "~/services/notes.server"

interface NoteListProps {
    items: Note[]
}

export default function NoteList({ items }: NoteListProps) {
    return (
        <div>
            <h2 className="text-3xl font-bold mb-2">Recent</h2>
            <div className="grid grid-cols-3 gap-4">
                {
                    items.map((v) => (
                        <Link className="flex flex-col relative border border-gray-200 hover:shadow-lg transition-shadow" key={v.id} to={`/notes/${v.slug}`}>
                            <div className="h-[200px] flex">
                                {
                                    v.thumbnail_url ? (
                                        <img className="flex-grow" src={v.thumbnail_url} alt={`thumbnail ${v.title}`} />
                                    ) : <div className="flex-grow bg-foreground" />
                                }
                            </div>
                            <div className="p-2">
                                <h3 className="text-xl font-bold">{v.title}</h3>
                            </div>
                        </Link>
                    ))
                }
            </div>
        </div>
    )
}