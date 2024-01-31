import { AiFillGithub, AiOutlineTwitter, AiFillLinkedin, AiOutlinePaperClip } from "react-icons/ai"
import type { SocialLink } from "~/services/personal-info.server"


interface SocialLinkProps {
    socialIcon: React.ReactNode
    link: string
    label: string
}

const SocialLinkComponent = ({ label, link, socialIcon }: SocialLinkProps) => {
    return (
        <a href={link} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2">
            {socialIcon}
            <span>{label}</span>
        </a>
    )
}


export const socialIconMap: Record<string, JSX.Element> = {
    'github': <AiFillGithub />,
    'twitter': <AiOutlineTwitter />,
    'linkedin': <AiFillLinkedin />,
    'default': <AiOutlinePaperClip />
}

export const getSocialIcon = (socialName: string) => socialIconMap[socialName] ?? socialIconMap.default

interface SocialLinkList {
    items: SocialLink[]
}
export const SocialLinkList = ({ items }: SocialLinkList) => {
    return (
        <div className="flex flex-col items-start gap-2 mt-5">
            {
                items.map(v => (
                    <SocialLinkComponent key={v.link} link={v.link} label={v.label} socialIcon={getSocialIcon(v.icon)} />
                ))
            }
        </div>
    )
}


interface IntroProps {
    name: string
    role: string
    socials: SocialLink[]
}

export default function Intro({ name, role, socials }: IntroProps) {
    return (
        <div className="flex">
            <div className="flex-grow">
                <h1 className="text-5xl font-bold mb-2">{`Hi, I'm ${name}.`}</h1>
                <h2 className="text-4xl">{role}</h2>

                <SocialLinkList items={socials} />
            </div>
            <div className="hidden md:flex -mt-8">
                <img className="object-contain aspect-square w-[281px]" alt="avatar" src="/favicon.png" />
            </div>
        </div>
    )
}