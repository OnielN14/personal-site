import { Button, type ButtonProps } from "~/components/ui/button";
import { useFormHandlers } from "./FormHandlersContext";
import { PUBLISH_TYPE } from "~/services/util";

export interface FormButtonProps extends Omit<ButtonProps, "type" | "onClick"> {
    children: React.ReactNode;
}

export const CancelButton = ({ children, ...props }: FormButtonProps) => {
    const { handleCancel } = useFormHandlers();
    return (
        <Button
            variant="secondary"
            type="button"
            onClick={handleCancel}
            {...props}
        >
            {children}
        </Button>
    );
};

export const SaveDraftButton = ({ children, ...props }: FormButtonProps) => {
    const { handleSubmitterClick } = useFormHandlers();
    return (
        <Button
            onClick={handleSubmitterClick}
            variant="secondary"
            type="button"
            name="is_published"
            value={PUBLISH_TYPE.SAVE}
            {...props}
        >
            {children}
        </Button>
    );
};

export const PublishButton = ({ children, ...props }: FormButtonProps) => {
    const { handleSubmitterClick } = useFormHandlers();
    return (
        <Button
            onClick={handleSubmitterClick}
            type="submit"
            name="is_published"
            value={PUBLISH_TYPE.PUBLISH}
            {...props}
        >
            {children}
        </Button>
    );
};
