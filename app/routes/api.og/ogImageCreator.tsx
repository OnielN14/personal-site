import { ImageResponse } from "@vercel/og";

type ImageCreationParam = ConstructorParameters<typeof ImageResponse>;
type FontOption = Exclude<
    Exclude<ImageCreationParam[1], undefined>["fonts"],
    undefined
>[0];

import interFontRegularData from "@fontsource/inter/files/inter-latin-400-normal.woff?arraybuffer";
import interFontBoldData from "@fontsource/inter/files/inter-latin-800-normal.woff?arraybuffer";

const ogImageCreator = async (
    element: ImageCreationParam[0],
    options?: ImageCreationParam[1]
) => {
    let fonts: FontOption[] = [
        {
            data: interFontRegularData,
            name: "inter",
            weight: 400,
            style: "normal",
        },
        {
            data: interFontBoldData,
            name: "inter",
            weight: 800,
            style: "normal",
        },
    ];

    if (options?.fonts) {
        fonts = [...fonts, ...options.fonts];
    }

    return new ImageResponse(element, { ...options, fonts });
};

export default ogImageCreator;
