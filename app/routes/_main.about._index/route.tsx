import { MetaFunction, defer, json } from "@remix-run/node";
import { Await, useLoaderData } from "@remix-run/react";
import {
    getAboutSummary,
    getEmploymentInfo,
    getSocials,
} from "~/services/personal-info.server";
import { SocialLinkList } from "../_main._index/Intro";
import EmploymentInfo from "./EmploymentInfo";
import { Suspense } from "react";
import { Skeleton } from "~/components/ui/skeleton";

export const loader = async () => {
    const employment = getEmploymentInfo()
        .then((value) => value.map((v) => ({ ...v })))
        .then((value) =>
            value.sort((a, b) => {
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
            })
        );

    return defer({
        about: getAboutSummary(),
        socials: getSocials(),
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
            <Suspense
                fallback={
                    <div className="grid md:grid-cols-3 gap-3">
                        <Skeleton className="h-[250px] w-full rounded-md" />
                        <Skeleton className="h-[250px] w-full rounded-md" />
                        <Skeleton className="h-[250px] w-full rounded-md" />
                        <Skeleton className="h-[250px] w-full rounded-md" />
                        <Skeleton className="h-[250px] w-full rounded-md" />
                        <Skeleton className="h-[250px] w-full rounded-md" />
                    </div>
                }
            >
                <Await resolve={Promise.all([about, socials, employment])}>
                    {([about, socials, employment]) => (
                        <>
                            <h1 className="text-5xl font-bold mb-10">
                                About Me
                            </h1>
                            {about.map((v, i) => (
                                <p
                                    key={i}
                                    className="[&:not(:last-child)]:mb-8"
                                >
                                    {v}
                                </p>
                            ))}

                            <SocialLinkList items={socials} />

                            <EmploymentInfo
                                items={employment}
                                className="mt-8"
                            />
                        </>
                    )}
                </Await>
            </Suspense>
        </div>
    );
}
