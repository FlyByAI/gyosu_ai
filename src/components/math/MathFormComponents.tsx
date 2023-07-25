
interface NumQuestionsProps {
    value: number;
    handleChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    disabled?: boolean;
    min?: number;
    max?: number;
}

const NumQuestionsInput: React.FC<NumQuestionsProps> = ({ value, handleChange, disabled, min = 1, max = 10 }) => (
    <div>
        <h2 className="text-xl mt-6 font-bold mb-2 text-white text-left">Number of Questions: {value}</h2>
        <input
            type="range"
            disabled={disabled}
            min={min}
            max={max}
            id="numQuestions"
            className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            value={value}
            onChange={handleChange}
        />
    </div>
);
export default NumQuestionsInput;