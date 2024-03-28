import { useToaster } from "react-hot-toast/headless";
import { useScreenSize } from "../contexts/ScreenSizeContext";

const Notifications = () => {
    const { toasts, handlers } = useToaster();
    const { startPause, endPause, calculateOffset, updateHeight } = handlers;

    const { isDesktop } = useScreenSize();

    return (
        <div
            className={`fixed top-36 ${isDesktop ? 'left-1/2' : 'left-0 right-0 mx-auto'} transform -translate-x-1/2 z-50`}
            onMouseEnter={startPause}
            onMouseLeave={endPause}
        >
            {toasts.map((toast: any) => {
                toast.duration = 3000;
                const offset = calculateOffset(toast, {
                    reverseOrder: false,
                });
                const ref = (el: any) => {
                    if (el && typeof toast.height !== "number") {
                        const height = el.getBoundingClientRect().height;
                        updateHeight(toast.id, height);
                    }
                };

                const bgColorClass = toast.id === 'error-toast' ? 'alert-error' : 'alert-success';

                return (
                    <div
                        key={toast.id}
                        ref={ref}
                        style={{ top: `${offset}px` }}
                        className={`alert shadow-lg font-bold animate-bounce ${bgColorClass} fixed ${isDesktop ? "w-96" : "w-80"} transition-all duration-400 ease-out ${toast.visible ? 'opacity-100' : 'opacity-0'}`}
                    >
                        <div>
                            <span>{toast.message}</span>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default Notifications;
