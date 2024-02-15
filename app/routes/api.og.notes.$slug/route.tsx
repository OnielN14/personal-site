import path from "node:path"
import url from "node:url"
import ogImageCreator from "../api.og/ogImageCreator"
import { LoaderFunctionArgs } from "@remix-run/node"
import { getSiteInfo } from "~/services/personal-info.server"
import { getTextContentFromHtmlString } from "~/lib/utils.server"
import { getNoteBySlugParam } from "../_main.notes.$slug/service.server"

export const loader = async ({ params }: LoaderFunctionArgs) => {
    const note = await getNoteBySlugParam(params)

    const root = process.cwd()
    const thumbnailPath = note.thumbnail_url && path.join(root, "/public/", note.thumbnail_url)
    const thumbnail = thumbnailPath && await fetch(url.pathToFileURL(thumbnailPath)).then(res => res.arrayBuffer())

    const siteInfo = await getSiteInfo()
    const sanitizedDescription = getTextContentFromHtmlString(note.content)

    return ogImageCreator(
        <div
            style={{
                fontFamily: 'inter',
                height: '100%',
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#fff',
                gap: 16,
                color: "hsl(0 0% 25%)",
                position: 'relative'
            }}
        >
            {/* @ts-expect-error Using satori img.src type */}
            {thumbnail ? (<img src={thumbnail} alt="thumbnail" style={{
                width: "100%",
                height: "100%",
                objectFit: 'cover',
                filter: "blur(50px)"
            }} />) : null}

            <div style={{
                display: 'flex',
                flexDirection: "column",
                justifyContent: "space-between",
                position: 'absolute',
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                padding: '32px',
                backgroundColor: "rgb(255 255 255 / 0.5)"
            }}>
                <h3 style={{
                    fontWeight: "normal",
                    margin: 0,
                    textTransform: "uppercase",
                    letterSpacing: 3
                }}>{siteInfo.name}</h3>


                <div style={{
                    display: "flex",
                    flexDirection: "column",
                    position: "relative",
                    paddingLeft: 14
                }}>
                    <div style={{
                        position: "absolute",
                        display: "flex",
                        backgroundColor: "hsl(0 0% 50%)",
                        left: 0,
                        top: 0,
                        bottom: 0,
                        width: 2
                    }}>

                    </div>
                    <h1 style={{
                        display: "block",
                        margin: 0,
                        fontSize: "42px",
                        textTransform: "uppercase",
                        letterSpacing: 3,
                        lineClamp: 2
                    }}>{note.title}</h1>

                    {
                        sanitizedDescription ? <p style={{
                            display: "block",
                            lineHeight: 1.5,
                            lineClamp: 3
                        }}>{sanitizedDescription}</p>
                            : null
                    }
                </div>
            </div>
        </div>,
        {
            width: 720,
            height: 377.57
        }
    )
}