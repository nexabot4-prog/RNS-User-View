import React, { createContext, useContext, useState, useCallback } from 'react';

const ToastContext = createContext(null);
const LayoutContext = createContext(null);

export const ToastProvider = ({ children }) => {
    const [toasts, setToasts] = useState([]);

    const showToast = useCallback((message, type = 'info', duration = 3000) => {
        const id = Date.now().toString() + Math.random().toString(36).substr(2, 9);
        setToasts((prev) => [...prev, { id, message, type }]);
        setTimeout(() => {
            setToasts((prev) => prev.filter((t) => t.id !== id));
        }, duration);
    }, []);

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}
            <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
                {toasts.map((toast) => (
                    <div
                        key={toast.id}
                        className={`p-4 rounded-lg shadow-lg text-white ${toast.type === 'success' ? 'bg-green-500' :
                            toast.type === 'error' ? 'bg-red-500' :
                                toast.type === 'warning' ? 'bg-yellow-500' : 'bg-blue-500'
                            }`}
                    >
                        {toast.message}
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    );
};

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) return { showToast: () => console.log('Toast not provided') };
    return context;
};

// Layout Context Implementation
export const LayoutProvider = ({ children }) => {
    const [hasSidebar, setHasSidebar] = useState(true);

    const setLayoutContext = (value) => {
        setHasSidebar(value);
    }

    return (
        <LayoutContext.Provider value={setLayoutContext}>
            {children}
        </LayoutContext.Provider>
    )
}

export const useLayoutContext = () => {
    const context = useContext(LayoutContext);
    // Return a dummy function if context is missing or just the context setter
    if (!context) return () => { };
    return context;
}
