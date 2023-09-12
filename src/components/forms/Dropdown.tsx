import React, { useEffect } from 'react';

interface DropdownProps {
    options: (string | { option_text: string } | { label: string, value: string })[] | { [key: string]: { option_text: string } };
    handleChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
    disabled?: boolean;
    className?: string;
    defaultValue?: string;
    label: string;
    showSelected: boolean;
}

const mapOptions = (options: DropdownProps['options']) => {
    if (Array.isArray(options)) {
        return options.map((option, index) => {
            if (typeof option === 'string') {
                return { value: option, label: option };
            } else if ('option_text' in option) {
                return { value: option.option_text, label: option.option_text };
            } else if ('label' in option && 'value' in option) {
                return { value: option.value, label: option.label };
            } else {
                return { value: `${index}`, label: 'Invalid Option' };
            }
        });
    } else {
        return Object.entries(options).map(([key, value]) => ({
            value: key,
            label: value.option_text,
        }));
    }
};


const Dropdown: React.FC<DropdownProps> = ({ options, handleChange, disabled = false, className, defaultValue, label, showSelected }) => {
    const optionsArray = mapOptions(options).filter(key => key.value !== 'option_text');
    const selectedValue = defaultValue ? defaultValue : optionsArray[0]?.value || '';

    return (
        <div className={className}>
            <h2 className="h-6 text-lg mb-2 text-white text-left">{label + (showSelected ? ": " + selectedValue : "")}</h2>
            <select
                disabled={disabled}
                value={selectedValue}
                onChange={handleChange}
                className={"form-select block w-full mt-1"}
            >
                {optionsArray.map((option, index) => (
                    <option key={index} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
        </div>
    );
};

export default Dropdown;
