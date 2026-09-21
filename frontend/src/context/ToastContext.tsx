"use client";

import React, { createContext, useContext, useState, useCallback, ReactNode } from "react";
import { FaCheckCircle, FaExclamationCircle, FaInfoCircle, FaTimes } from "react-icons/fa";

type ToastType = "success" | "error" | "info" | "warning";

interface Toast {
    id: string;
    message: string;
    type: ToastType;
}

interface ToastContextType {
    showToast: (message: string, type?: ToastType, duration?: number) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error("useToast must be used within a ToastProvider");
    }
    return context;
};

export const ToastProvider = ({ children }: { children: ReactNode }) => {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const removeToast = useCallback((id: string) => {
        setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, []);

    const showToast = useCallback((message: string, type: ToastType = "info", duration: number = 3000) => {
        const id = Math.random().toString(36).substring(2, 9);
        const newToast = { id, message, type };
        setToasts((prev) => [...prev, newToast]);

        setTimeout(() => {
            removeToast(id);
        }, duration);
    }, [removeToast]);

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}
            <div className="fixed top-24 right-5 flex flex-col gap-3 z-[9999]">
                {toasts.map((toast) => (
                    <div
                        key={toast.id}
                        className={`flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg text-white min-w-[300px] animate-slide-in transition-all opacity-95 hover:opacity-100 ${toast.type === "success" ? "bg-green-600" :
                            toast.type === "error" ? "bg-red-600" :
                                toast.type === "warning" ? "bg-yellow-600" :
                                    "bg-blue-600"
                            }`}
                    >
                        <span className="text-xl">
                            {toast.type === "success" && <FaCheckCircle />}
                            {toast.type === "error" && <FaExclamationCircle />}
                            {toast.type === "warning" && <FaExclamationCircle />}
                            {toast.type === "info" && <FaInfoCircle />}
                        </span>
                        <p className="flex-1 text-sm font-medium">{toast.message}</p>
                        <button onClick={() => removeToast(toast.id)} className="text-white/80 hover:text-white">
                            <FaTimes />
                        </button>
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    );
};
