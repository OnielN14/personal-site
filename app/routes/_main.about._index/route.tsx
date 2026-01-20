import { MetaFunction, data } from "react-router";
import { Await, useLoaderData } from "react-router";
import {
    getAboutSummary,
    getEmploymentInfo,
    getSocials,
} from "~/services/personal-info.server";
import { SocialLinkList } from "../_main._index/Intro";
import EmploymentInfo from "./EmploymentInfo";
import { Suspense } from "react";
import { Skeleton } from "~/components/ui/skeleton";
import Redirect from "~/components/Redirect";

export const loader = async () => {
    const employment = getEmploymentInfo().then((value) => {
        const newVal = value?.map((v) => ({ ...v }));
        newVal?.sort((a, b) => {
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

        return newVal;
    });

    return data({
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
                    {([about, socials, employment]) => {
                        if (!about || !socials || !employment) {
                            return (
                                <Redirect to="/login?redirect=/profile/update" />
                            );
                        }

                        return (
                            <>
                                <h1 className="text-5xl font-bold mb-10">
                                    About Me
                                </h1>
                                {about.map((v, i) => (
                                    <p
                                        key={i}
                                        className="[&:not(:last-child)]:mb-8"
                                    >
                                        {v.value}
                                    </p>
                                ))}

                                <SocialLinkList items={socials} />

                                <EmploymentInfo
                                    items={employment}
                                    className="mt-8"
                                />
                            </>
                        );
                    }}
                </Await>
            </Suspense>
        </div>
    );
}
