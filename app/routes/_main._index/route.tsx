import type { MetaFunction } from "@remix-run/node";
import Intro from "./Intro";
import Techstack from "./TectStack";

export const meta: MetaFunction = () => {
    return [
        { title: "Salty Project" },
        { name: "description", content: "Daniyal's personal site with a sprinkle of salt." },
    ];
};

const dailyTechStack = [
    "Typescript/Javascript",
    "ReactJS",
    "Next.JS",
    "Remix",
    "ExpressJS",
    "Hono",
    "Rust",
    "Tailwindcss"
]

const recentTechStack = [
    "Postgres",
    "SQLite",
    "MySQL/MariaDB",
    "MongoDB",
    "Firebase",
    "Docker",
    "Vue.js",
    "GraphQL",
    "GraphQL Yoga",
    "Hasura",
    "WebRTC",
    "Websocket"
]

export default function Index() {
    return (
        <div className="pt-[10rem]">
            <div className="container mx-auto">
                <Intro />

                <div className="mt-10">
                    <div>
                        <h2 className="text-3xl font-bold uppercase mb-2">Tech Stack</h2>
                        <Techstack items={dailyTechStack} />
                    </div>
                    <div className="mt-4">
                        <h3 className="text-2xl font-bold uppercase mb-2">Recent Tech stack</h3>
                        <Techstack items={recentTechStack} />
                    </div>
                </div>
            </div>
        </div>
    );
}
