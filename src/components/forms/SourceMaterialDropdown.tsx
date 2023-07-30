import React from 'react';

interface SectionProps {
    value: string;
    handleChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
    className: string;
    disabled?: boolean;
}

const SourceMaterialDropdown: React.FC<SectionProps> = ({ value, handleChange, className, disabled }) => (
    <>
        <h2 className="text-xl font-bold mb-2 text-white text-left">Select Source Material: {value}</h2>
        <select disabled={disabled} value={value} onChange={handleChange} className={className + " form-select block w-full mt-1"}>
            <option value="precalc-2e-textbook">Precalculus 2e</option>
            <option value="pre-algebra-2e-textbook">Pre-Algebra 2e</option>
            <option value="college-algebra-2e-textbook">College-Algebra 2e</option>
        </select>
    </>
);

export default SourceMaterialDropdown;
