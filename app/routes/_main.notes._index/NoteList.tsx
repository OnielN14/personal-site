import { Link } from "@remix-run/react";
import { getTextContentFromHtmlString } from "~/lib/utils";
import { Note } from "~/services/notes.server";

interface NoteListProps {
    items: Note[];
}

export default function NoteList({ items }: NoteListProps) {
    if (items.length === 0) {
        return (
            <div className="flex justify-center items-center">
                <h3>There is nothing here</h3>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-y-3">
            {items.map((v) => (
                <SimpleNoteItem key={v.id} {...v} />
            ))}
        </div>
    );
}

const SimpleNoteItem = (props: Note) => (
    <Link
        className="flex flex-col relative p-2 rounded-md border border-gray-200  hover:border-gray-400 transition-colors"
        to={`/notes/${props.slug}`}
    >
        <h3 className="relative text-xl font-bold">
            {props.is_published ? null : (
                <span className="italic text-gray-400 font-normal">
                    (Draft){" "}
                </span>
            )}
            {props.title}
        </h3>
        <p className="relative">
            {getTextContentFromHtmlString(props.content)
                ?.substring(0, 40)
                .trim()}
        </p>
    </Link>
);
