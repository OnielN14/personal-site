import { ImageResponse } from "@vercel/og"
import path from "node:path"
import url from "node:url"

type ImageCreationParam = ConstructorParameters<typeof ImageResponse>
type FontOption = Exclude<Exclude<ImageCreationParam[1], undefined>['fonts'], undefined>[0]

const ogImageCreator = async (element: ImageCreationParam[0], options?: ImageCreationParam[1]) => {
    const root = process.cwd()
    const fontPathRegular = path.join(root, "/node_modules/@fontsource/inter/files/inter-latin-400-normal.woff")
    const fontPathBold = path.join(root, "/node_modules/@fontsource/inter/files/inter-latin-800-normal.woff")

    const [
        interFontRegularData,
        interFontBoldData,
    ] = (await Promise.all([
        fetch(url.pathToFileURL(fontPathRegular)).then(res => res.arrayBuffer()),
        fetch(url.pathToFileURL(fontPathBold)).then(res => res.arrayBuffer()),
    ]))

    let fonts: FontOption[] = [
        {
            data: interFontRegularData,
            name: 'inter',
            weight: 400,
            style: 'normal'
        },
        {
            data: interFontBoldData,
            name: 'inter',
            weight: 800,
            style: 'normal'
        },
    ]

    if (options?.fonts) {
        fonts = [...fonts, ...options.fonts]
    }

    return new ImageResponse(element, { ...options, fonts })
}

export default ogImageCreator