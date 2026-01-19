import { Button } from "~/components/ui/button";

interface FormActionsProps {
    handleCancel: () => void;
}

export default function FormActions({ handleCancel }: FormActionsProps) {
    return (
        <div className="flex gap-x-2 mt-6">
            <Button variant="secondary" type="button" onClick={handleCancel}>
                Cancel
            </Button>
            <Button type="submit">Save</Button>
        </div>
    );
}
