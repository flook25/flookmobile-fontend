'use client'

import { useEffect, useRef } from 'react';

interface ModalProps {
    title: string;
    children: React.ReactNode;
    isOpen: boolean;
    onClose: () => void;
    size: 'sm' | 'md' | 'lg';
}

const sizeClass = {
    sm: 'w-80 max-w-sm',
    md: 'w-96 max-w-md',
    lg: 'w-[600px] max-w-2xl'
}

export default function Modal({ title, children, isOpen, onClose, size }: ModalProps) {
    const modalRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && isOpen) {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener('keydown', handleEscape);
            document.body.style.overflow = 'hidden'; // Prevent background scroll
        }

        return () => {
            document.removeEventListener('keydown', handleEscape);
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, onClose]);

    const handleBackdropClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    if (!isOpen) return null;

    return (
        // --- THIS IS THE ONLY CHANGE: `bg-transparent` is now `bg-black/60` ---
        <div 
            className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60"
            onClick={handleBackdropClick}
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
        >
			<div 
                ref={modalRef}
                className={`bg-white rounded-lg shadow-xl ${sizeClass[size]} max-h-[90vh] flex flex-col`}
            >
				<div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
                    <h2 id="modal-title" className="text-lg font-semibold text-gray-800">
                        {title}
                    </h2>
                    <button 
                        onClick={onClose}
                        className="p-1 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100"
                        aria-label="Close modal"
                    >
                        <i className="fa-solid fa-xmark text-xl"></i>
                    </button>
                </div>

                <div className="px-6 py-5">
                    {/* The form from sidebar.tsx will be passed in here */}
                    {children}
                </div>
            </div>
        </div>
    )
}