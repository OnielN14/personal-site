import { createContext, useContext } from "react";

export interface FormHandlersContextType {
    handleCancel: () => void;
    handleSubmitterClick: (ev: React.PointerEvent<HTMLButtonElement>) => void;
}

export const FormHandlersContext = createContext<
    FormHandlersContextType | undefined
>(undefined);

export const useFormHandlers = () => {
    const context = useContext(FormHandlersContext);
    if (!context) {
        throw new Error(
            "useFormHandlers must be used within a FormHandlersProvider",
        );
    }
    return context;
};

export const FormHandlersProvider: React.FC<{
    children: React.ReactNode;
    value: FormHandlersContextType;
}> = ({ children, value }) => {
    return (
        <FormHandlersContext.Provider value={value}>
            {children}
        </FormHandlersContext.Provider>
    );
};
