import React, { useEffect } from 'react';
import { X } from 'lucide-react';

/**
 * Modal Component
 * Renders a standard modal overlay with a title, close button, and custom content.
 * * Props:
 * - title: The text displayed in the modal header.
 * - children: The content to be placed inside the modal body (e.g., your forms or confirmation messages).
 * - onClose: A function to close the modal, typically used by the close button or clicking outside.
 */
export default function Modal({ title, children, onClose }) {

    // Effect to disable scrolling on the body when the modal is open
    useEffect(() => {
        document.body.style.overflow = 'hidden';
        
        // Cleanup function: re-enable scrolling when the component unmounts
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, []);

    // Handler for pressing the Escape key
    const handleKeyDown = (event) => {
        if (event.key === 'Escape') {
            onClose();
        }
    };

    // Attach keydown listener when the component mounts
    useEffect(() => {
        document.addEventListener('keydown', handleKeyDown);
        
        // Cleanup function: remove event listener when the component unmounts
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [onClose]); // Dependency array includes onClose to keep handler current

    return (
        // Modal Backdrop: Fixed full screen, semi-transparent black
        <div 
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm p-4"
            onClick={onClose} // Close the modal if the backdrop is clicked
        >
            {/* Modal Container: Prevents click on the content from closing the modal */}
            <div 
                className="bg-white rounded-xl shadow-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto transform transition-all duration-300 scale-100"
                onClick={(e) => e.stopPropagation()} // Stop click propagation to prevent closing
                role="dialog"
                aria-modal="true"
                aria-labelledby="modal-title"
            >
                {/* Modal Header */}
                <div className="flex justify-between items-center p-6 border-b border-gray-200 sticky top-0 bg-white z-10">
                    <h2 id="modal-title" className="text-2xl font-semibold text-gray-800">
                        {title}
                    </h2>
                    {/* Close Button */}
                    <button
                        type="button"
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 p-2 rounded-full transition-colors"
                        aria-label="Close modal"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Modal Body */}
                <div className="p-6">
                    {children}
                </div>
            </div>
        </div>
    );
}