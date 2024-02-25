import { LoaderFunctionArgs } from "@remix-run/node";
import { Link, MetaFunction, useLoaderData } from "@remix-run/react";
import { bundleMDX } from "./mdx.server"
import { getMDXComponent } from "mdx-bundler/client/index.js"
import { useMemo } from "react";
import { getPageUrl } from "~/lib/utils";
import { getTextContentFromHtmlString } from "~/lib/utils.server"
import { useIsAuthenticated } from "~/services/auth.util";
import { Button } from "~/components/ui/button";
import { LuPencil } from "react-icons/lu"
import { getNoteBySlugParam } from "./service.server";

export const loader = async ({ params, request }: LoaderFunctionArgs) => {
    const note = await getNoteBySlugParam(params)
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

export default function Component() {
    const { code, note } = useLoaderData<typeof loader>()
    const Component = useMemo(() => getMDXComponent(code), [code])


    const isAuthenticated = useIsAuthenticated()

    return (
        <div className="prose prose-main lg:prose-xl flex-grow mx-auto self-center w-full relative">
            <div className="h-[300px] w-full bg-foreground !-mt-[5rem] relative">
                {note.thumbnail_url ? <img alt="thumbnail" src={note.thumbnail_url} className="w-full h-full object-cover !m-0" /> : null}

                {
                    isAuthenticated ? (
                        <div className="absolute right-0 bottom-0 p-4 ">
                            <Button asChild variant="outline" className="flex gap-2 no-underline">
                                <Link to={`/notes/edit/${note.slug}`}>
                                    <LuPencil /> Edit
                                </Link>
                            </Button>
                        </div>
                    ) : null
                }
            </div>
            <div className="px-4 sm:px-0">
                <h1 className="!mt-4 relative">{note.title}</h1>
                <Component />
            </div>
        </div>
    )
}