interface MessageSuggestionProps {
    onClick: (text: string) => void;
}

const MessageSuggestion: React.FC<MessageSuggestionProps> = ({ onClick }) => {
    const suggestions = [
        {
            header: "Homework on Inverse Functions",
            text: "Please create a homework for learning inverse functions for calc 1. Please provide an example with steps to help the students recall about what we did in class so they can complete the problems successfully at home. Add key terms at the top like 'one to one' that are helpful for understanding the work.",
        },
        {
            header: "Write a Lesson Plan about Unit Circle",
            text: "Please create a lesson plan for me to teach about the unit circle?",
        },
        {
            header: "Create a Quiz on Polynomials",
            text: "Can you create me a quiz on Polynomials from Elementary Algebra?",
        },
        {
            header: "I'm New",
            text: "What subjects do you have? What are your capabilities?",
        },
    ];

    return (
        <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            {suggestions.map((suggestion, index) => (
                <div
                    key={index}
                    onClick={() => onClick(`${suggestion.header}: ${suggestion.text}`)}
                    className="flex flex-col p-4 bg-base-300 rounded-lg shadow hover:bg-base-200 cursor-pointer transition-colors duration-200 ease-in-out text-sm text-default"
                >
                    <h3 className="font-semibold">{suggestion.header}</h3>
                    <p className="text-xs md:text-sm mt-2">{suggestion.text}</p>
                </div>
            ))}

            {/* <p className="text-sm font-bold">Try one of these or type your own message.</p> */}
        </div>
    );
};

export default MessageSuggestion;
