import Hamburger from 'hamburger-react';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import XIcon from '../svg/XIcon';

const HamburgerWrapperX = ({ children, mobileOrDesktop = "both"}: { children: React.ReactNode, mobileOrDesktop: string }) => {
    const [isOpen, setOpen] = useState<boolean>(true);

    const { sessionId } = useParams();

    useEffect(() => {
        setOpen(false)
    }, [sessionId])

    const closeButtonClick = () => {
        setOpen(false);
    };

    const showClass = getShowClass();

    function getShowClass() {
        if (mobileOrDesktop === "desktop") {
            return "hidden md:block";
        }
        if (mobileOrDesktop === "mobile") {
            return "block md:hidden";
        }
        return "block";
    }

    return (
        <div className={"relative " + getShowClass()}>
            {/* Hamburger Menu */}
            <Hamburger toggled={isOpen} toggle={setOpen} />
            {/* Mini Nav */}
            <div className={`${mobileOrDesktop != "desktop" && "backdrop-blur-sm"} absolute left-0 top-0 z-50 w-auto h-auto transition-transform duration-300 transform ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <div className='flex flex-row'>
                    {isOpen && children}
                    <div>
                        <button className='m-2 p-2 btn btn-secondary rounded' onClick={closeButtonClick}>
                            <XIcon />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HamburgerWrapperX;
