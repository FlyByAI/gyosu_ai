import React from 'react';

interface DropdownProps {
    data: string[];
    value: string;
    handleChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
    disabled?: boolean;
    className?: string;
}

const Dropdown: React.FC<DropdownProps> = ({ data, value, handleChange, disabled = false, className }) => {


    return (
        <>
            <h2 className="text-xl font-bold mb-2 text-white text-left">Select Problem Type: {value}</h2>
            <select
                disabled={disabled}
                value={value}
                onChange={handleChange}
                className={className + " form-select block w-full mt-1"}
            >
                {data.map((option, index) => (
                    <option key={index} value={option}>
                        {option}
                    </option>
                ))}
            </select>
        </>
    );
};

export default Dropdown;
