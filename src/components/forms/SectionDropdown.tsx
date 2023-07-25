import React from 'react';
import { Section } from '../../interfaces';

interface SectionProps {
    data: Sections | CourseDescription;
    value: string;
    handleChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
    className: string;
    disabled?: boolean;
}

export interface Sections {
    [key: string]: string;
}

export interface CourseDescription {
    name: string;
    sections: Section[];
}

const SectionDropdown: React.FC<SectionProps> = ({ data, value, handleChange, className, disabled }) => {
    let options: JSX.Element[] = [];

    if ('sections' in data) {
        // If data is of type CourseDescription
        const sections = data.sections;
        options = Object.entries(sections).map(([key, val]) => (
            <option key={key} value={key}>
                {key}: {val["Concept"]}
            </option>
        ));
    } else {
        // If data is of type Record<string, string>
        options = Object.entries(data).map(([key, val]) => (
            <option key={key} value={key}>
                {key}: {val as string}
            </option>
        ));
    }

    return (
        <>
            <h2 className="text-xl font-bold mb-2 text-white text-left">Select Section: {value}</h2>
            <select disabled={disabled} value={value} onChange={handleChange} className={className + " form-select block w-full mt-1"}>
                {options}
            </select>
        </>
    );
};

export default SectionDropdown;
