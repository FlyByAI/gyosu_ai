import { useToaster } from "react-hot-toast/headless";
import { useScreenSize } from "../contexts/ScreenSizeContext";

const Notifications = () => {
    const { toasts, handlers } = useToaster();
    const { startPause, endPause, calculateOffset, updateHeight } = handlers;

    const { isDesktop } = useScreenSize();

    return (
        <div
            className={isDesktop ? `fixed top-36 left-72 transform -translate-x-1/2 z-50` : "transform top-36 fixed z-50"}
            onMouseEnter={startPause}
            onMouseLeave={endPause}
        >
            {toasts.map((toast: any) => {
                toast.duration = 3000;
                const offset = calculateOffset(toast, {
                    reverseOrder: false
                });
                const ref = (el: any) => {
                    if (el && typeof toast.height !== "number") {
                        const height = el.getBoundingClientRect().height;
                        updateHeight(toast.id, height);
                    }
                };

                const bgColorClass = toast.id === 'error-toast' ? 'bg-red-500' : 'bg-green-500';

                return (
                    <div
                        key={toast.id}
                        ref={ref}
                        className={`flex items-center text-lg font-bold animate-bounce z-80 p-4 rounded-md ${bgColorClass} border-2 text-white fixed z-70 ${isDesktop ? "w-96" : "w-80"} transition-all duration-400 ease-out ${toast.visible ? 'opacity-100' : 'opacity-0'}`}
                    >
                        {toast.message}
                    </div>
                );
            })}
        </div>
    );
};

export default Notifications;
