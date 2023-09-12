import { useToaster } from "react-hot-toast/headless";

const Notifications = () => {
    const { toasts, handlers } = useToaster();
    const { startPause, endPause, calculateOffset, updateHeight } = handlers;

    return (
        <div
            className="fixed top-30 left-64 transform -translate-x-1/2 z-99"
            onMouseEnter={startPause}
            onMouseLeave={endPause}
        >
            {toasts.map((toast: any) => {
                const offset = calculateOffset(toast, {
                    reverseOrder: false
                });
                const ref = (el: any) => {
                    if (el && typeof toast.height !== "number") {
                        const height = el.getBoundingClientRect().height;
                        updateHeight(toast.id, height);
                    }
                };

                return (
                    <div
                        key={toast.id}
                        ref={ref}
                        className={`z-99 p-1 rounded-md bg-white absolute w-96 bg-papayawhip transition-all duration-200 ease-out ${toast.visible ? 'opacity-100' : 'opacity-0'}`}
                        style={{ transform: `translateY(${offset}px)` }}
                    >
                        {toast.message}
                    </div>
                );
            })}
        </div>
    );
};

export default Notifications;
