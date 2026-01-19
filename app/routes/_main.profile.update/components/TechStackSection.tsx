import {
    FormField,
    FormItem,
    FormLabel,
    FormControl,
    FormMessage,
} from "~/components/ui/form";
import TagInput from "~/routes/_main.projects.create/TagInput";
import { FormType } from "../CreateForm.type";

interface TechStackSectionProps {
    form: FormType;
}

export default function TechStackSection({ form }: TechStackSectionProps) {
    return (
        <div className="border rounded-lg p-4">
            <h3 className="text-lg font-semibold mb-4">Tech Stack</h3>

            <div className="mb-6">
                <h4 className="font-medium mb-2">Main Technologies</h4>
                <FormField
                    name="techstack.main"
                    render={({ field }) => (
                        <FormItem>
                            <FormControl>
                                <TagInput
                                    value={field.value || []}
                                    onChange={field.onChange}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            </div>

            <div>
                <h4 className="font-medium mb-2">Recent Technologies</h4>
                <FormField
                    name="techstack.recent"
                    render={({ field }) => (
                        <FormItem>
                            <FormControl>
                                <TagInput
                                    value={field.value || []}
                                    onChange={field.onChange}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            </div>
        </div>
    );
}
