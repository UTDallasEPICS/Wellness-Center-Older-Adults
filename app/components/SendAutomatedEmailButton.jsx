import React, { useState } from 'react';
import { Minus, X, CheckCircle, AlertCircle } from 'lucide-react';

// hardcoded data required by your API (name, email, message)
const AUTOMATED_EMAIL_DATA = {
    name: "System Tester (Automated)",
    message: "This is a successful automated test email triggered by a frontend button. This confirms that the contact form API route and Nodemailer service are operational.",
};

// Modal Component
const StatusModal = ({ isOpen, title, message, onClose, type }) => {
    if (!isOpen) return null;

    const isSuccess = type === 'success';

    const borderColor = isSuccess ? 'border-green-500' : 'border-red-500';
    const backgroundColor = isSuccess ? 'bg-green-50' : 'bg-red-50';
    const iconColor = isSuccess ? 'text-green-500' : 'text-red-500';
    const Icon = isSuccess ? CheckCircle : AlertCircle;

    return (
        // Modal Backdrop
        <div 
            className="fixed inset-0 flex items-center justify-center z-[1000] bg-black bg-opacity-50" 
            onClick={onClose}
        >
            {/* Modal Content */}
            <div 
                className={`bg-white p-5 rounded-lg max-w-sm w-[90%] shadow-2xl border-2 ${borderColor} ${backgroundColor} transform scale-100 transition-transform duration-300 ease-out`}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Modal Header */}
                <div className="flex items-center justify-between pb-4 border-b border-gray-200">
                    <div className="flex items-center">
                        <Icon size={24} className={`mr-2 ${iconColor}`} />
                        <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
                    </div>
                    
                    <button 
                        className="p-1 text-gray-500 hover:text-gray-700 ml-auto" 
                        onClick={onClose}
                    >
                        <X size={20} />
                    </button>
                </div>
                
                {/* Modal Body */}
                <div className="py-5">
                    <p className="text-gray-700">{message}</p>
                </div>
                
                {/* Modal Footer */}
                <div className="pt-4 border-t border-gray-200 text-right">
                    <button 
                        className="px-4 py-2 text-white rounded-md transition-colors duration-200 
                                   bg-[#419902] hover:bg-[#378300]" 
                        onClick={onClose}
                    >
                        OK
                    </button>
                </div>
            </div>
        </div>
    );
};


// Main Component
const SendAutomatedEmailButton = () => {
    const [loading, setLoading] = useState(false);
    const [statusMessage, setStatusMessage] = useState('');
    const [modalOpen, setModalOpen] = useState(false);
    const [modalTitle, setModalTitle] = useState('');
    const [modalType, setModalType] = useState('success'); // 'success' or 'error'

    const handleSendEmail = async () => {
        setLoading(true);
        setStatusMessage('Sending email...');
        setModalOpen(false); 

        try {
            const response = await fetch('/api/email', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(AUTOMATED_EMAIL_DATA),
            });

            const result = await response.json();

            if (response.ok) {
                setModalTitle('Success!');
                setModalType('success');
                setStatusMessage(`Email successfully sent! Details: ${result.message}`);
            } else {
                setModalTitle('Server Error');
                setModalType('error');
                setStatusMessage(`Error: ${result.error || 'Unknown server error.'}`);
            }
        } catch (error) {
            console.error('Fetch error:', error);
            setModalTitle('Network Error');
            setModalType('error');
            setStatusMessage('A network error occurred. Please check your connection.');
        } finally {
            setLoading(false);
            setModalOpen(true); 
        }
    };

    const handleCloseModal = () => {
        setModalOpen(false);
        setStatusMessage('');
    };

    return (
        <div className="relative">
            <button
                onClick={handleSendEmail}
                disabled={loading}
                className={`
                    h-12 w-12 rounded-full text-white flex items-center justify-center shadow-lg
                    transition-all duration-300 ease-in-out border-none
                    ${loading 
                        ? 'bg-[#378300] cursor-not-allowed' 
                        : 'bg-[#419902] hover:bg-[#378300] cursor-pointer'
                    }
                `}
            >
                {/* ellipsis '...' when loading */}
                {loading ? (
                    <span className="text-xl leading-none">...</span>
                ) : (
                    <Minus size={28} />
                )}
            </button>

            {/* The Modal Component */}
            <StatusModal
                isOpen={modalOpen}
                title={modalTitle}
                message={statusMessage}
                onClose={handleCloseModal}
                type={modalType}
            />
        </div>
    );
};

export default SendAutomatedEmailButton;