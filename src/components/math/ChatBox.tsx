import { useState } from "react";

interface ChatBoxProps {
    value: string;
    handleChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
    className: string;
    onFocusChange: (focus: boolean) => void;
}

const ChatBox: React.FC<ChatBoxProps> = ({ value, handleChange, className, onFocusChange }) => {
    const [isFocused, setIsFocused] = useState(false);

    const rows = isFocused && value ? Math.min(value.split('\n').length, 10) : 1;

    const handleFocus = (focus: boolean) => {
        setIsFocused(focus);
        onFocusChange(focus);  // Notify parent component when focus state changes
    }
    return (
        <textarea
            value={value}
            onChange={handleChange}
            onFocus={() => handleFocus(true)}
            onBlur={() => handleFocus(false)}
            className={className + " m-0 p-2 my-0 bg-gray-100 dark:bg-gray-800 rounded dark:text-gray-300 flex-grow form-textarea mt-1 block w-full"}
            placeholder="Example: Change problem 3 and problem 4 to teach the students about...."
            rows={rows}
        />
    )
};

export default ChatBox;