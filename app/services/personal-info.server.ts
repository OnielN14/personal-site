import type { PersonalInfo } from "./personal-info.schema";
import { db } from "~/db/sqlite/connection.server";
import { about } from "~/db/sqlite/schema.server";

export type PersonalData = PersonalInfo;
export type SocialLink = PersonalData["socials"][0];
export type Identity = PersonalData["identity"];
export type EmploymentInfo = PersonalData["about"]["employment"][0];
export type TechStack = PersonalData["techstack"];
export type Summary = PersonalData["about"]["summary"];
export type SiteInfo = PersonalData["siteInfo"];

export type UpdatePersonalInfoDto = PersonalInfo & {
    id?: string;
};

export const getIdentity = async (): Promise<Identity | undefined> => {
    const data = await getPersonalInfo();
    return data?.value?.identity;
};

export const getTechStack = async (): Promise<TechStack | undefined> => {
    const data = await getPersonalInfo();
    return data?.value?.techstack;
};

export const getSocials = async (): Promise<SocialLink[] | undefined> => {
    const data = await getPersonalInfo();
    return data?.value?.socials;
};

export const getAboutSummary = async (): Promise<Summary | undefined> => {
    const data = await getPersonalInfo();
    return data?.value?.about.summary;
};

export const getEmploymentInfo = async (): Promise<
    EmploymentInfo[] | undefined
> => {
    const data = await getPersonalInfo();
    return data?.value?.about.employment;
};

export const getSiteInfo = async (): Promise<SiteInfo | undefined> => {
    const data = await getPersonalInfo();
    return data?.value?.siteInfo;
};

export const getPersonalInfo = async () => {
    const result = await db.query.about.findFirst();

    return result;
};

export const updatePersonalInfo = async ({
    id,
    ...payload
}: UpdatePersonalInfoDto) => {
    return await db
        .insert(about)
        .values({
            id,
            value: payload,
        })
        .onConflictDoUpdate({
            target: about.id,
            set: {
                value: payload,
            },
        })
        .returning();
};
