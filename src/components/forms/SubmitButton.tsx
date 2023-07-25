interface SubmitButtonProps {
    handleClick: () => void;
    className: string;
    buttonText: string;
}

// Component for SubmitButton
const SubmitButton: React.FC<SubmitButtonProps> = ({ handleClick, className, buttonText }) => (
    <button onClick={handleClick} className={className + " bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"}>
        {buttonText}
    </button>
);

export default SubmitButton;