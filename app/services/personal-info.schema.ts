import { z } from "zod/v4";

// Schema for Social Link
export const SocialLinkSchema = z.object({
    link: z.url(),
    label: z.string(),
    icon: z.string(),
});

// Schema for Employment Information
export const EmploymentInformationSchema = z.object({
    startDate: z.iso.date(),
    endDate: z.iso.date().optional(),
    isCurrentCompany: z.boolean(),
});

// Schema for Description Item
export const DescriptionItemSchema = z.object({
    type: z.string(),
    value: z.array(z.string()),
});

// Schema for Employment
export const EmploymentSchema = z.object({
    companyName: z.string(),
    role: z.string(),
    employmentInformation: EmploymentInformationSchema,
    description: z.array(DescriptionItemSchema),
});

// Schema for Techstack
export const TechstackSchema = z.object({
    main: z.array(z.string()),
    recent: z.array(z.string()),
});

export const SummarySchema = z.object({
    value: z.string(),
});

// Schema for About
export const AboutSchema = z.object({
    summary: z.array(SummarySchema),
    employment: z.array(EmploymentSchema),
});

// Schema for Site Info
export const SiteInfoSchema = z.object({
    name: z.string(),
    description: z.string(),
});

// Schema for Identity
export const IdentitySchema = z.object({
    name: z.string(),
    role: z.string(),
});

// Main Personal Info Schema
export const PersonalInfoSchema = z.object({
    identity: IdentitySchema,
    socials: z.array(SocialLinkSchema),
    techstack: TechstackSchema,
    about: AboutSchema,
    siteInfo: SiteInfoSchema,
});

export type PersonalInfo = z.infer<typeof PersonalInfoSchema>;
export default PersonalInfoSchema;
