import Hamburger from 'hamburger-react';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const HamburgerWrapperX = ({ children }: { children: React.ReactNode }) => {
    const [isOpen, setOpen] = useState(true);
    const navigate = useNavigate();

    const {sessionId} = useParams();

    useEffect(() => {
        setOpen(false)
    }, [sessionId])

    const closeOnScroll = () => {
        setOpen(false);
    };

    useEffect(() => {
        window.addEventListener('scroll', closeOnScroll);
        return () => {
            window.removeEventListener('scroll', closeOnScroll);
        };
    }, []);

    const navigateToNewChat = () => {
        navigate('/math-app/chat');
    };

    return (
        <div className="relative">
            {/* Hamburger Menu */}
            <Hamburger toggled={isOpen} toggle={setOpen} />

            {/* Mini Nav */}
            <div className={`fixed left-0 z-100 w-auto h-auto transition-transform duration-300 transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:hidden`}>
                {isOpen &&
                    <div className='bg-gray-900 p-4'>
                        <button onClick={navigateToNewChat}>New Chat</button>
                    </div>
                }
                {isOpen && children}
            </div>
        </div>
    );
};

export default HamburgerWrapperX;
