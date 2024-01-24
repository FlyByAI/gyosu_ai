interface MessageSuggestionProps {
    onClick: (text: string) => void;
}

const MessageSuggestion: React.FC<MessageSuggestionProps> = ({ onClick }) => {
    const suggestions = ["Can you create me a quiz on Polynomials from Elementary Algebra, Chapter 6.1?", "I'm new to using GyosuChat, can you help guide me through the process?"];

    const isTwoSuggestions = suggestions.length === 2;
    const buttonClass = isTwoSuggestions
        ? "w-1/2"
        : "w-full"; // Full width for more than two suggestions

    return (
        <div className={`${isTwoSuggestions ? "flex" : "grid grid-cols-2 gap-2"} p-2`}>
            {suggestions.map((suggestion, index) => (
                <button
                    key={index}
                    className={`bg-transparent border-2 hover:border-blue-500 text-white font-semibold py-2 px-4 rounded shadow m-2 ${buttonClass}`}
                    onClick={() => onClick(suggestion)}
                >
                    {suggestion}
                </button>
            ))}
        </div>
    );
};


export default MessageSuggestion;
