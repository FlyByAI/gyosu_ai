interface TypeProps {
    options: string[];
    value: string;
    handleChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
    className: string;
    disabled?: boolean;
}

const TypeDropdown = ({ options, value, handleChange, className, disabled }: TypeProps) => (
    <>
        <h2 className="text-xl font-bold mb-2 text-white text-left">Problem Type: {value}</h2>
        <select disabled={disabled} value={value} onChange={handleChange} className={className + " form-select block w-full mt-1"}>
            {
                options.map((option) => <option key={option}>{option}</option>)
            }
        </select>
    </>
);

export default TypeDropdown