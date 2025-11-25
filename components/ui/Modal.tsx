'use client';

import {useEffect, useState} from 'react';
import { X } from 'lucide-react';
import {createPortal} from "react-dom";

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    children: React.ReactNode;
    maxWidth?: string;
}

export default function Modal({
                                  isOpen,
                                  onClose,
                                  title,
                                  children,
                                  maxWidth = 'max-w-lg'
                              }: ModalProps) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };

        if (isOpen) {
            window.addEventListener('keydown', handleKeyDown);
            // Prevent body scrolling when modal is open
            document.body.style.overflow = 'hidden';
        }

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, onClose]);

    if (!mounted || !isOpen) return null;

    const modalContent = (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200"
            onClick={onClose} // Clicking here closes the modal
        >
            <div
                className={`bg-white rounded-lg shadow-xl w-full ${maxWidth} relative flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200`}
                onClick={(e) => e.stopPropagation()} // Clicking here STOPS the close event
            >
                <div className="flex justify-between items-center p-4 border-b border-gray-100">
                    <h3 className="font-semibold text-lg text-gray-800">
                        {title || 'Dialog'}
                    </h3>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-700 transition-colors p-1 rounded-md hover:bg-gray-100"
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="p-6 overflow-y-auto">
                    {children}
                </div>
            </div>
        </div>
    );

    return createPortal(modalContent, document.body)
}