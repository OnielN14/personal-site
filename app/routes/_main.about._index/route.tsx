import { MetaFunction, json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import {
    getAboutSummary,
    getEmploymentInfo,
    getSocials,
} from "~/services/personal-info.server";
import { SocialLinkList } from "../_main._index/Intro";
import EmploymentInfo from "./EmploymentInfo";

export const loader = async () => {
    const employment = (await getEmploymentInfo()).map((v) => ({ ...v }));

    employment.sort((a, b) => {
        if (
            a.employmentInformation.startDate <
            b.employmentInformation.startDate
        )
            return 1;
        else if (
            a.employmentInformation.startDate >
            b.employmentInformation.startDate
        )
            return -1;
        return 0;
    });

    return json({
        about: await getAboutSummary(),
        socials: await getSocials(),
        employment,
    });
};

export const meta: MetaFunction = () => {
    return [
        { title: "About" },
        {
            name: "description",
            content: "A glimpse about me",
        },
    ];
};

export default function AboutPage() {
    const { about, socials, employment } = useLoaderData<typeof loader>();

    return (
        <div className="container pt-[10rem]">
            <h1 className="text-5xl font-bold mb-10">About Me</h1>
            {about.map((v, i) => (
                <p key={i} className="[&:not(:last-child)]:mb-8">
                    {v}
                </p>
            ))}

            <SocialLinkList items={socials} />

            <EmploymentInfo items={employment} className="mt-8" />
        </div>
    );
}
