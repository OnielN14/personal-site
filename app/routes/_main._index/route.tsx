import type { MetaFunction } from "@remix-run/node";
import Intro from "./Intro";

export const meta: MetaFunction = () => {
    return [
        { title: "Salty Project" },
        { name: "description", content: "The World Is Saltier Than You Thought" },
    ];
};

export default function Index() {
    return (
        <div className="pt-[10rem]">
            <div className="container mx-auto">
                <Intro />
            </div>
            <div className="h-dvh flex flex-col text-slate-600">
                <div className="flex-grow flex flex-col items-center justify-center place-self-center text-center">

                    <h1 className="text-6xl font-bold tracking-widest leading-tight">THE WORLD IS SALTIER</h1>
                    <h1 className="text-6xl font-bold tracking-widest leading-tight">THAN YOU THOUGHT</h1>
                    <h3 className="text-2xl font-light tracking-[2rem]">SALTY PROJECT</h3>
                </div>
                <p className="text-center tracking-[1rem] leading-[1_75] font-light text-lg p-4">MINDLESS CREATURE IN THE WORLD OF MADNESS</p>
            </div>
        </div>
    );
}
