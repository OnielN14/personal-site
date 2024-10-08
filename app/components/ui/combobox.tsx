import {
    Combobox as HeadlessCombobox,
    ComboboxProps as HeadlessComboboxProps,
} from "@headlessui/react";
import React, { useState } from "react";

type SimplifiedHeadlessComboboxProps<TValue> = HeadlessComboboxProps<
    TValue,
    boolean,
    boolean,
    React.ExoticComponent
>;

type ExtractedOption<TValue> = {
    value: TValue;
    label: React.ReactNode;
    disabled?: boolean;
};

type ComboboxProps<TValue, TOption> = Omit<
    SimplifiedHeadlessComboboxProps<TValue>,
    "children"
> & {
    options: TOption[];
    displayValue?: (value: TValue) => string;
    optionExtract: (value: TOption) => ExtractedOption<TOption>;
    optionFilter: (
        query: string,
        value: TOption,
        index: number,
        array: TOption[]
    ) => boolean;
};

function Combobox<TValue, TOption = TValue>({
    options,
    optionExtract,
    optionFilter,
    ...props
}: ComboboxProps<TValue, TOption>) {
    const [query, setQuery] = useState("");

    const filteredOption =
        query === ""
            ? options
            : options.filter((...args) => optionFilter(query, ...args));

    return (
        <HeadlessCombobox
            as="div"
            value={props.value}
            defaultValue={props.defaultValue}
            onChange={props.onChange}
            name={props.name}
            form={props.form}
            // @ts-expect-error fix passing boolean
            multiple={props.multiple}
            // @ts-expect-error fix passing boolean
            nullable={props.nullable}
            disabled={props.disabled}
        >
            <div className="">
                <div>
                    {props.value instanceof Array
                        ? props.value.map((v) => props.displayValue?.(v) ?? v)
                        : // eslint-disable-next-line @typescript-eslint/no-explicit-any
                          (props.value as any)}
                </div>

                <HeadlessCombobox.Input
                    className="py-2 px-3 text-sm"
                    value={query}
                    onChange={(ev) => setQuery(ev.target.value)}
                />
            </div>
            <HeadlessCombobox.Options>
                {filteredOption.map((v, i) => {
                    const { label, value, disabled } = optionExtract(v);

                    return (
                        <HeadlessCombobox.Option
                            key={i}
                            value={value}
                            disabled={disabled}
                        >
                            {label}
                        </HeadlessCombobox.Option>
                    );
                })}
            </HeadlessCombobox.Options>
        </HeadlessCombobox>
    );
}

export default Combobox;
