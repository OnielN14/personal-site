import { zodResolver } from "@hookform/resolvers/zod";
import { Form, useNavigate } from "react-router";
import { RemixFormProvider, useRemixForm } from "remix-hook-form";
import PersonalInfoSchema from "~/services/personal-info.schema";

// Components
import IdentitySection from "./components/IdentitySection";
import SiteInfoSection from "./components/SiteInfoSection";
import SocialLinksSection from "./components/SocialLinksSection";
import TechStackSection from "./components/TechStackSection";
import AboutSection from "./components/AboutSection";
import FormActions from "./components/FormActions";
import { FormFieldValues } from "./CreateForm.type";

const resolver = zodResolver(PersonalInfoSchema);

interface CreateFormProps {
    action: string;
    data?: Partial<FormFieldValues>;
}

export default function CreateForm({ action, data }: CreateFormProps) {
    const form = useRemixForm<FormFieldValues>({
        resolver,
        values: {
            identity: {
                name: data?.identity?.name || "",
                role: data?.identity?.role || "",
            },
            socials: data?.socials || [{ link: "", label: "", icon: "" }],
            techstack: {
                main: data?.techstack?.main || [""],
                recent: data?.techstack?.recent || [""],
            },
            about: {
                summary: data?.about?.summary || [{ value: "" }],
                employment: data?.about?.employment || [
                    {
                        companyName: "",
                        role: "",
                        employmentInformation: {
                            startDate: "",
                            endDate: "",
                            isCurrentCompany: false,
                        },
                        description: [
                            {
                                type: "",
                                value: [""],
                            },
                        ],
                    },
                ],
            },
            siteInfo: {
                name: data?.siteInfo?.name || "",
                description: data?.siteInfo?.description || "",
            },
        },
        stringifyAllValues: false,
        mode: "onSubmit",
        submitConfig: {
            action,
            encType: "multipart/form-data",
        },
    });

    const navigate = useNavigate();
    const handleCancel = () => navigate(-1);

    return (
        <RemixFormProvider {...form}>
            <Form
                method="post"
                className="flex flex-col gap-y-4"
                onSubmit={(ev) => {
                    ev.preventDefault();

                    console.log(form.getValues());

                    // form.handleSubmit(ev)
                }}
            >
                <IdentitySection form={form} />
                <SiteInfoSection form={form} />
                <SocialLinksSection form={form} />
                <TechStackSection form={form} />
                <AboutSection form={form} />
                <FormActions handleCancel={handleCancel} />
            </Form>
        </RemixFormProvider>
    );
}
