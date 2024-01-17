import { GridLoader } from 'react-spinners'; // Import the spinner you prefer

const ChatActions = ({ actions }: {actions: string}) => {
    if (!actions || actions.length === 0) return null;

    return (
        <div className="p-2 chat-action-container flex flex-row items-center bg-green-100 border border-green-100 rounded">
            <div>
                <GridLoader color="#4A90E2" size={4} margin={4} speedMultiplier={.75} className='mr-2'/> 
            </div>
            <div className="chat-action-text">{actions}</div>
        </div>
    );
};

export default ChatActions;
