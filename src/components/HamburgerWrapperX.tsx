import Hamburger from 'hamburger-react';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import XIcon from '../svg/XIcon';

const HamburgerWrapperX = ({ children }: { children: React.ReactNode }) => {
    const [isOpen, setOpen] = useState(true);
    const navigate = useNavigate();

    const { sessionId } = useParams();

    useEffect(() => {
        setOpen(false)
    }, [sessionId])

    const closeOnScroll = () => {
        setOpen(false);
    };

    const closeButtonClick = () => {
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
            <div className={`fixed left-0 top-0 z-100 w-auto h-auto transition-transform duration-300 transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:hidden`}>
                <div className='flex flex-row'>
                    {isOpen && children}
                    <div>
                        <button className='m-2 p-2 bg-blue-500' onClick={closeButtonClick}>
                            <XIcon />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HamburgerWrapperX;
