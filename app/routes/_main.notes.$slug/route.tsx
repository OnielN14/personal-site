import { LoaderFunctionArgs } from "@remix-run/node";
import { MetaFunction, useLoaderData } from "@remix-run/react";
import { z } from "zod";
import { db } from "~/db/sqlite/connection.server";
import { notFound } from "~/http/bad-request";
import { bundleMDX } from "./mdx.server"
import { getMDXComponent } from "mdx-bundler/client/index.js"
import { useMemo } from "react";
import { getPageUrl } from "~/lib/utils";
import { getTextContentFromHtmlString } from "~/lib/utils.server"

export const paramsSchema = z.object({
    slug: z.string()
})

export const loader = async ({ params, request }: LoaderFunctionArgs) => {
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

    const url = getPageUrl(request)
    const ogImageApi = `${url.origin}/api/og/notes/${note.slug}`
    let ogDescription = getTextContentFromHtmlString(note.content)?.trim()
    if (ogDescription && ogDescription?.length > 40) {
        ogDescription = ogDescription.substring(0, 40) + "..."
    }

    return { note, code: result.code, frontmatter: result.frontmatter, ogUrl: url, ogImage: ogImageApi, ogDescription }
}

export const meta: MetaFunction<typeof loader> = ({ data }) => {
    const note = data!.note

    return [
        { title: `Notes - ${note.title}` },
        { name: "description", content: data?.ogDescription },
        { property: "og:title", content: note.title },
        { property: "og:image", content: data?.ogImage },
        { property: "og:type", content: 'website' },
        { property: "og:url", content: data?.ogUrl },
        { property: "og:description", content: data?.ogDescription },
        { property: "twitter:title", content: note.title },
        { property: "twitter:image", content: data?.ogImage },
        { property: "twitter:description", content: data?.ogDescription },
        { property: "twitter:card", content: "summary_large_image" },
    ]
}

export default function ArticleItemPage() {
    const { code, note } = useLoaderData<typeof loader>()
    const Component = useMemo(() => getMDXComponent(code), [code])

    return (
        <div className="prose prose-main lg:prose-xl flex-grow mx-auto self-center w-full relative">
            <div className="h-[300px] w-full bg-foreground !-mt-[5rem] relative">
                {note.thumbnail_url ? <img alt="thumbnail" src={note.thumbnail_url} className="w-full h-full object-cover !m-0" /> : null}
            </div>
            <div className="px-4 sm:px-0">
                <h1 className="!mt-4 relative">{note.title}</h1>
                <Component />
            </div>
        </div>
    )
}