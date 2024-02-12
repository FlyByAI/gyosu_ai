interface MessageSuggestionProps {
    onClick: (text: string) => void;
}

const MessageSuggestion: React.FC<MessageSuggestionProps> = ({ onClick }) => {

    const suggestions = ["I'm new to using GyosuChat. What subjects do you have? What are your capabilities?", "Please create a homework for learning inverse functions for calc 1. Please provide an example with steps to help the students recall about what we did in class so they can complete the problems successfully at home. Add key terms at the top like 'one to one' that are helpful for understanding the work.", "Please create a lesson plan for me to teach about the unit circle?", "Can you create me a quiz on Polynomials from Elementary Algebra?"];


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
