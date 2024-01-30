import { ImageResponse } from "@vercel/og"
import path from "node:path"
import url from "node:url"
import { getIdentity, getSocials } from "~/services/personal-info.server"

const iconPaths: Record<string, string> = {
    github: "M511.6 76.3C264.3 76.2 64 276.4 64 523.5 64 718.9 189.3 885 363.8 946c23.5 5.9 19.9-10.8 19.9-22.2v-77.5c-135.7 15.9-141.2-73.9-150.3-88.9C215 726 171.5 718 184.5 703c30.9-15.9 62.4 4 98.9 57.9 26.4 39.1 77.9 32.5 104 26 5.7-23.5 17.9-44.5 34.7-60.8-140.6-25.2-199.2-111-199.2-213 0-49.5 16.3-95 48.3-131.7-20.4-60.5 1.9-112.3 4.9-120 58.1-5.2 118.5 41.6 123.2 45.3 33-8.9 70.7-13.6 112.9-13.6 42.4 0 80.2 4.9 113.5 13.9 11.3-8.6 67.3-48.8 121.3-43.9 2.9 7.7 24.7 58.3 5.5 118 32.4 36.8 48.9 82.7 48.9 132.3 0 102.2-59 188.1-200 212.9a127.5 127.5 0 0 1 38.1 91v112.5c.8 9 0 17.9 15 17.9 177.1-59.7 304.6-227 304.6-424.1 0-247.2-200.4-447.3-447.5-447.3z",
    twitter: "M928 254.3c-30.6 13.2-63.9 22.7-98.2 26.4a170.1 170.1 0 0 0 75-94 336.64 336.64 0 0 1-108.2 41.2A170.1 170.1 0 0 0 672 174c-94.5 0-170.5 76.6-170.5 170.6 0 13.2 1.6 26.4 4.2 39.1-141.5-7.4-267.7-75-351.6-178.5a169.32 169.32 0 0 0-23.2 86.1c0 59.2 30.1 111.4 76 142.1a172 172 0 0 1-77.1-21.7v2.1c0 82.9 58.6 151.6 136.7 167.4a180.6 180.6 0 0 1-44.9 5.8c-11.1 0-21.6-1.1-32.2-2.6C211 652 273.9 701.1 348.8 702.7c-58.6 45.9-132 72.9-211.7 72.9-14.3 0-27.5-.5-41.2-2.1C171.5 822 261.2 850 357.8 850 671.4 850 843 590.2 843 364.7c0-7.4 0-14.8-.5-22.2 33.2-24.3 62.3-54.4 85.5-88.2z",
    linkedin: "M880 112H144c-17.7 0-32 14.3-32 32v736c0 17.7 14.3 32 32 32h736c17.7 0 32-14.3 32-32V144c0-17.7-14.3-32-32-32zM349.3 793.7H230.6V411.9h118.7v381.8zm-59.3-434a68.8 68.8 0 1 1 68.8-68.8c-.1 38-30.9 68.8-68.8 68.8zm503.7 434H675.1V608c0-44.3-.8-101.2-61.7-101.2-61.7 0-71.2 48.2-71.2 98v188.9H423.7V411.9h113.8v52.2h1.6c15.8-30 54.5-61.7 112.3-61.7 120.2 0 142.3 79.1 142.3 181.9v209.4z",
    default: "M779.3 196.6c-94.2-94.2-247.6-94.2-341.7 0l-261 260.8c-1.7 1.7-2.6 4-2.6 6.4s.9 4.7 2.6 6.4l36.9 36.9a9 9 0 0 0 12.7 0l261-260.8c32.4-32.4 75.5-50.2 121.3-50.2s88.9 17.8 121.2 50.2c32.4 32.4 50.2 75.5 50.2 121.2 0 45.8-17.8 88.8-50.2 121.2l-266 265.9-43.1 43.1c-40.3 40.3-105.8 40.3-146.1 0-19.5-19.5-30.2-45.4-30.2-73s10.7-53.5 30.2-73l263.9-263.8c6.7-6.6 15.5-10.3 24.9-10.3h.1c9.4 0 18.1 3.7 24.7 10.3 6.7 6.7 10.3 15.5 10.3 24.9 0 9.3-3.7 18.1-10.3 24.7L372.4 653c-1.7 1.7-2.6 4-2.6 6.4s.9 4.7 2.6 6.4l36.9 36.9a9 9 0 0 0 12.7 0l215.6-215.6c19.9-19.9 30.8-46.3 30.8-74.4s-11-54.6-30.8-74.4c-41.1-41.1-107.9-41-149 0L463 364 224.8 602.1A172.22 172.22 0 0 0 174 724.8c0 46.3 18.1 89.8 50.8 122.5 33.9 33.8 78.3 50.7 122.7 50.7 44.4 0 88.8-16.9 122.6-50.7l309.2-309C824.8 492.7 850 432 850 367.5c.1-64.6-25.1-125.3-70.7-170.9z"
}

interface SocialIconProps {
    width: number
    height: number
    icon: 'twitter' | 'github' | 'linkedin' | (string & NonNullable<unknown>)
}

const SocialIcon = ({ height, width, icon }: SocialIconProps) => {
    const iconPath = iconPaths[icon] ?? iconPaths.default

    return <svg viewBox="0 0 1024 1024" stroke="currentColor" fill="currentColor" width={width} height={height}>
        <path d={iconPath} />
    </svg>
}

export const loader = async () => {
    const root = process.cwd()
    const fontPathRegular = path.join(root, "/node_modules/@fontsource/inter/files/inter-latin-400-normal.woff")
    const fontPathBold = path.join(root, "/node_modules/@fontsource/inter/files/inter-latin-800-normal.woff")
    const avatarPath = path.join(root, "/public/favicon.png")

    const [
        interFontRegularData,
        interFontBoldData,
        avatar
    ] = (await Promise.all([
        fetch(url.pathToFileURL(fontPathRegular)).then(res => res.arrayBuffer()),
        fetch(url.pathToFileURL(fontPathBold)).then(res => res.arrayBuffer()),
        fetch(url.pathToFileURL(avatarPath)).then(res => res.arrayBuffer()),
    ]))


    const socials = await getSocials()
    const identity = await getIdentity()

    return new ImageResponse(
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
                color: "hsl(0 0% 35%)",
                position: 'relative'
            }}
        >
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                fontSize: 32,
                gap: 8
            }}>
                <h1 style={{ fontWeight: "bold", margin: 0 }}>{`Hi, I'm ${identity.name}.`}</h1>
                <h2 style={{ fontWeight: "normal", margin: 0 }}>{identity.role}</h2>
            </div>
            {/* @ts-expect-error Using satori img.src type */}
            <img alt="avatar" src={avatar} width={300} height={300} />

            <div style={{
                width: '100%',
                position: "absolute",
                bottom: 0,
                display: "flex",
                justifyContent: 'center',
                alignItems: 'center',
                gap: 16,
            }}>
                {
                    socials.map((v) => (
                        <div key={v.label} style={{
                            display: 'flex',
                            gap: 4,
                            alignItems: 'center',
                            justifyContent: 'center',
                            paddingBottom: 16,
                        }}>
                            <SocialIcon height={24} width={24} icon={v.icon} />
                            <h3 style={{ fontWeight: 'normal', margin: 0 }}>{v.label}</h3>
                        </div>
                    ))
                }
            </div>
        </div>
        ,
        {
            fonts: [
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
        }
    )
}