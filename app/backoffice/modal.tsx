// modal component
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
		        <div 
            className="fixed inset-0 z-50 flex items-center justify-center bg-transparent"
            onClick={handleBackdropClick}
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
        >
			            <div 
                ref={modalRef}
                className={`bg-white rounded-2xl shadow-2xl ring-1 ring-gray-900/10 ${sizeClass[size]} max-h-[90vh] overflow-y-auto transition-all duration-300 transform`}
            >
				                <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 bg-gray-50/50 rounded-t-2xl">
                    <h2 id="modal-title" className="text-xl font-semibold text-gray-800">
                        {title}
                    </h2>
                    <button 
                        onClick={onClose}
                        className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 transition-all duration-200"
                        aria-label="Close modal"
                    >
                        <i className="fa-solid fa-xmark text-lg"></i>
                    </button>
                </div>

                <div className="px-6 py-6">
                    {children}
                </div>
            </div>
        </div>
    )
}