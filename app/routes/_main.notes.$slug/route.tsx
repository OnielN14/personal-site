import { LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { z } from "zod";
import { db } from "~/db/sqlite/connection.server";
import { notFound } from "~/http/bad-request";
import { bundleMDX } from "./mdx.server"
import { getMDXComponent } from "mdx-bundler/client/index.js"
import { useMemo } from "react";

const paramsSchema = z.object({
    slug: z.string()
})

export const loader = async ({ params }: LoaderFunctionArgs) => {
    const validationResult = await paramsSchema.safeParseAsync(params)

    if (!validationResult.success) {
        throw notFound()
    }


    const note = await db.query.notes.findFirst({
        where: (schema, clauses) => clauses.eq(schema.slug, validationResult.data.slug)
    })

    if (!note) throw notFound()

    const result = await bundleMDX({
        source: note.content
    })


    return { note, code: result.code, frontmatter: result.frontmatter }
}

export default function ArticleItemPage() {
    const { code, note } = useLoaderData<typeof loader>()
    const Component = useMemo(() => getMDXComponent(code), [code])

    return (
        <div className="prose prose-main lg:prose-xl flex-grow mx-auto self-center w-full">
            <div className="h-[300px] w-full bg-foreground !-mt-[5rem]" />
            <h1 className="!mt-4">{note.title}</h1>
            <Component />
        </div>
    )
}