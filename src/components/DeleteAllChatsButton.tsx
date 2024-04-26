import useChatSessions from "../hooks/tools/math/useChatSessions";
import useEnvironment from "../hooks/useEnvironment";

const DeleteAllChatsButton = () => {
    const { mathAppApiUrl } = useEnvironment();
    const chatSessionsEndpoint = `${mathAppApiUrl}/chat/`;

    const { deleteAllChatSessions } = useChatSessions(chatSessionsEndpoint);

    const handleDeleteAllClick = () => {
        if (window.confirm("Are you sure you want to delete all chat sessions? This will completely remove all chat sessions for your user from our application. This action cannot be undone.")) {
            deleteAllChatSessions();
        }
    };

    return (
        <button onClick={handleDeleteAllClick} className="btn btn-error bg-transparent px-2 py-2 text-white rounded w-3/4">
            Delete All Chats
        </button>
    );
};

export default DeleteAllChatsButton;