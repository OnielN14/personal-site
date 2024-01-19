import { AiFillGithub, AiOutlineTwitter, AiFillLinkedin } from "react-icons/ai"


interface SocialLinkProps {
    socialIcon: React.ReactNode
    link: string
    label: string
}

const SocialLink = ({ label, link, socialIcon }: SocialLinkProps) => {
    return (
        <a href={link} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2">
            {socialIcon}
            <span>{label}</span>
        </a>
    )
}

export default function Intro() {
    return (
        <div className="flex">
            <div className="flex-grow">
                <h1 className="text-5xl font-bold mb-2">{"Hi, I'm Daniyal."}</h1>
                <h2 className="text-4xl">Frontend Developer</h2>

                <div className="flex flex-col items-start gap-2 mt-5">
                    <SocialLink link="https://github.com/OnielN14" label="OnielN14" socialIcon={<AiFillGithub size="1.5rem" />} />
                    <SocialLink link="https://x.com/daniyal_ar" label="@daniyal_ar" socialIcon={<AiOutlineTwitter size="1.5rem" />} />
                    <SocialLink link="https://www.linkedin.com/in/daniyal-ahmad-r/" label="in/daniyal-ahmad-r" socialIcon={<AiFillLinkedin size="1.5rem" />} />
                </div>
            </div>
            <div className="hidden md:flex -mt-8">
                <img className="object-contain w-full" alt="avatar" src="/favicon.png" />
            </div>
        </div>
    )
}