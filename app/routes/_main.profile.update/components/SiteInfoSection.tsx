import {
    FormFieldProvider,
    FormItem,
    FormLabel,
    FormControl,
    FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { FormType } from "../CreateForm.type";
import { Textarea } from "~/components/ui/textarea";

interface SiteInfoSectionProps {
    form: FormType;
}

export default function SiteInfoSection({ form }: SiteInfoSectionProps) {
    return (
        <div className="border rounded-lg p-4">
            <h3 className="text-lg font-semibold mb-4">Site Information</h3>
            <div className="grid grid-cols-1 gap-4">
                <FormFieldProvider name="siteInfo.name">
                    <FormItem>
                        <FormLabel>Site Name</FormLabel>
                        <FormControl>
                            <Input
                                {...form.register("siteInfo.name")}
                                placeholder="Your site name"
                            />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                </FormFieldProvider>

                <FormFieldProvider name="siteInfo.description">
                    <FormItem>
                        <FormLabel>Site Description</FormLabel>
                        <FormControl>
                            <Textarea
                                {...form.register("siteInfo.description")}
                                placeholder="Brief description of your site"
                            />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                </FormFieldProvider>
            </div>
        </div>
    );
}
