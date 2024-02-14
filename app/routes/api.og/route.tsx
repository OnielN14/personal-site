import path from "node:path"
import url from "node:url"
import { getIdentity, getSocials } from "~/services/personal-info.server"
import SocialIcon from "./SocialIcon"
import ogImageCreator from "./ogImageCreator"

export const loader = async () => {
    const root = process.cwd()
    const avatarPath = path.join(root, "/public/favicon.png")

    const avatar = await fetch(url.pathToFileURL(avatarPath)).then(res => res.arrayBuffer())

    const socials = await getSocials()
    const identity = await getIdentity()

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
    )
}