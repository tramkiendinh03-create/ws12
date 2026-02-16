import React from 'react';
import { X } from 'lucide-react';
import MetalContainer from '../UI/MetalContainer';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="w-full max-w-2xl animate-in fade-in zoom-in duration-300">
                <MetalContainer title={title} glowColor="blue">
                    <button 
                        onClick={onClose}
                        className="absolute top-2 right-2 p-1 text-gray-500 hover:text-white transition-colors z-30"
                    >
                        <X size={20} />
                    </button>
                    <div className="mt-2">
                        {children}
                    </div>
                </MetalContainer>
            </div>
        </div>
    );
};

export default Modal;