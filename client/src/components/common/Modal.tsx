import React, { ReactNode } from "react";
import { AiFillCloseCircle } from "react-icons/ai";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  title?: string;
  width?: string;
  bgColor?: string;
  variant?: "primary" | "secondary";
}

const Modal = ({
  isOpen,
  onClose,
  children,
  title,
  bgColor,
  variant = "primary",
}: ModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed mx-auto md:w-1/2 lg:w-1/3 flex inset-0 bg-gray-900 bg-opacity-75 items-center justify-center z-50 p-2">
      <div
        className={`flex flex-col gap-4 ${
          variant === "primary" ? "bg-primary-purple" : bgColor
        } p-4 rounded-xl w-full ${
          variant === "secondary" ? "md:w-1/3 lg:w-1/4" : ""
        }`}
      >
        <div className="flex justify-end">
          <AiFillCloseCircle
            size={24}
            onClick={onClose}
            className="cursor-pointer hover:opacity-80"
          />
        </div>

        {title && (
          <h2
            className={`text-center ${
              variant === "primary"
                ? "text-4xl text-secondary-gold font-bold mb-4"
                : "text-lg text-gray-800 font-semibold mb-2"
            }`}
          >
            {title}
          </h2>
        )}

        {children}
      </div>
    </div>
  );
};

export default Modal;
