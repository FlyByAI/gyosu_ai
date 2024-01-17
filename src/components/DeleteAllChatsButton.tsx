import useChatSessions from "../hooks/tools/math/useChatSessions";
import useEnvironment from "../hooks/useEnvironment";

const DeleteAllChatsButton = () => {
    const { apiUrl } = useEnvironment();
    const chatSessionsEndpoint = `${apiUrl}/math_app/chat/`;

    const { deleteAllChatSessions } = useChatSessions(chatSessionsEndpoint);

    const handleDeleteAllClick = () => {
        if (window.confirm("Are you sure you want to delete all chat sessions? This action cannot be undone.")) {
            deleteAllChatSessions();
        }
    };

    return (
        <button onClick={handleDeleteAllClick} className="px-2 py-2 border border-red-500 text-white rounded">
            Delete All Chats
        </button>
    );
};

export default DeleteAllChatsButton;