import {
    FormFieldProvider,
    FormItem,
    FormLabel,
    FormControl,
    FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { FormType } from "../CreateForm.type";

interface IdentitySectionProps {
    form: FormType;
}

export default function IdentitySection({ form }: IdentitySectionProps) {
    return (
        <div className="border rounded-lg p-4">
            <h3 className="text-lg font-semibold mb-4">Identity</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormFieldProvider name="identity.name">
                    <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                            <Input
                                {...form.register("identity.name")}
                                placeholder="Your full name"
                            />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                </FormFieldProvider>

                <FormFieldProvider name="identity.role">
                    <FormItem>
                        <FormLabel>Role</FormLabel>
                        <FormControl>
                            <Input
                                {...form.register("identity.role")}
                                placeholder="Your professional role"
                            />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                </FormFieldProvider>
            </div>
        </div>
    );
}
