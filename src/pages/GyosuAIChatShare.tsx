import { useClerk } from '@clerk/clerk-react';
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { GridLoader } from 'react-spinners'; // Import the spinner you prefer
import useChatSessions from '../hooks/tools/math/useChatSessions';
import useEnvironment from '../hooks/useEnvironment';


const GyosuAIChatShare = () => {

    const { apiUrl } = useEnvironment();
    const { acceptShareChatSession } = useChatSessions(`${apiUrl}/math_app/chat/`);
    const { token } = useParams();
    const {session} = useClerk();

    useEffect(() => {
        if (token && session){
            acceptShareChatSession(token)
        }
    }, [acceptShareChatSession, session, token])
    return (
        <div className="text-white items-center justify-center flex my-4 py-4 flex-grow h-75vh">
            <GridLoader color="#4A90E2" size={8} margin={4} speedMultiplier={.75} className='mr-2' />
            Creating chat session
        </div>
    );

};

export default GyosuAIChatShare;
