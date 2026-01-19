import data from "~/../data/personal-info.json";
import type { PersonalInfo } from "./personal-info.schema";
import { db } from "~/db/sqlite/connection.server";

export type PersonalData = PersonalInfo;
export type SocialLink = PersonalData["socials"][0];
export type Identity = PersonalData["identity"];
export type EmploymentInfo = PersonalData["about"]["employment"][0];
export type TechStack = PersonalData["techstack"];
export type Summary = PersonalData["about"]["summary"];
export type SiteInfo = PersonalData["siteInfo"];

export const getIdentity = async (): Promise<Identity> => {
    return data.identity;
};

export const getTechStack = async (): Promise<TechStack> => {
    return data.techstack;
};

export const getSocials = async (): Promise<SocialLink[]> => {
    return data.socials;
};

export const getAboutSummary = async (): Promise<Summary> => {
    return data.about.summary;
};

export const getEmploymentInfo = async (): Promise<EmploymentInfo[]> => {
    return data.about.employment;
};

export const getSiteInfo = async (): Promise<SiteInfo> => {
    return data.siteInfo;
};

export const getPersonalInfo = async () => {
    const result = await db.query.about.findFirst();

    return result;
};
