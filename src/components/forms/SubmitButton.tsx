interface SubmitButtonProps {
    handleClick: () => void;
    className: string;
    buttonText: string;
    disabled?: boolean;
}

// Component for SubmitButton
const SubmitButton: React.FC<SubmitButtonProps> = ({ handleClick, className, buttonText, disabled }) => (
    <button disabled={disabled} onClick={handleClick} className={className + " btn btn-primary py-2 px-4 rounded"}>
        {buttonText}
    </button>
);

export default SubmitButton;