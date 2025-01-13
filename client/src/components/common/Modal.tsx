import React, { ReactNode } from "react";
import { AiFillCloseCircle } from "react-icons/ai";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  title?: string;
  width?: string;
  variant?: 'primary' | 'secondary';
}

const Modal = ({ 
  isOpen, 
  onClose, 
  children, 
  title, 
  variant = 'primary' 
}: ModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="absolute w-full flex inset-0 bg-gray-900 bg-opacity-75 items-center justify-center z-50 p-2">
      <div 
        className={`flex flex-col gap-4 bg-primary-purple p-4 rounded-xl w-full`}
      >
        <div className="flex justify-end">
            <AiFillCloseCircle 
              size={24} 
              onClick={onClose}
              className="cursor-pointer hover:opacity-80" 
            />
        </div>

        {title && (
          <h2 className={`text-3xl font-bold text-center mb-4 ${
            variant === 'primary' ? 'text-4xl text-secondary-gold' : 'text-white'
          }`}>
            {title}
          </h2>
        )}

        {children}
      </div>
    </div>
  );
};

export default Modal; 