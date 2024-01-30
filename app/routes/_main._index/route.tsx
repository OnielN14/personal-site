import { json, LoaderFunctionArgs, type MetaFunction } from "@remix-run/node";
import Intro from "./Intro";
import Techstack from "./TectStack";
import { getIdentity, getSiteInfo, getSocials, getTechStack } from "~/services/personal-info.server";
import { useLoaderData } from "@remix-run/react";

export const loader = async ({ request }: LoaderFunctionArgs) => {

    const url = new URL(request.url)
    const api = `${url.origin}/api/og`

    return json({
        socials: await getSocials(),
        identity: await getIdentity(),
        techstack: await getTechStack(),
        siteInfo: await getSiteInfo(),
        ogImage: api,
        ogUrl: url.origin
    })
}

export const meta: MetaFunction<typeof loader> = ({ data }) => {
    const siteInfo = data!.siteInfo

    return [
        { title: siteInfo.name },
        { name: "description", content: siteInfo.description },
        { property: "og:title", content: siteInfo.name },
        { property: "og:image", content: data?.ogImage },
        { property: "og:type", content: 'website' },
        { property: "og:url", content: data?.ogUrl },
        { property: "og:description", content: siteInfo.description },
        { property: "twitter:title", content: siteInfo.name },
        { property: "twitter:image", content: data?.ogImage },
        { property: "twitter:description", content: siteInfo.description },
        { property: "twitter:card", content: "summary_large_image" },
    ];
};

export default function Index() {
    const { socials, identity, techstack } = useLoaderData<typeof loader>()

    return (
        <div className="pt-[10rem]">
            <div className="container mx-auto">
                <Intro {...identity} socials={socials} />

                <div className="mt-10">
                    <div>
                        <h2 className="text-3xl font-bold uppercase mb-2">Tech Stack</h2>
                        <Techstack items={techstack.main} />
                    </div>
                    <div className="mt-4">
                        <h3 className="text-2xl font-bold uppercase mb-2">Recent Tech stack</h3>
                        <Techstack items={techstack.recent} />
                    </div>
                </div>
            </div>
        </div>
    );
}
