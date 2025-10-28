import React, { useState } from 'react';
import { Minus, X, CheckCircle, AlertCircle } from 'lucide-react';

const AUTOMATED_EMAIL_DATA = {
    name: "System Tester (Automated)",
    email: "djanjanam@gmail.com",
    message: "This is a successful automated test email triggered by a frontend button. This confirms that the contact form API route and Nodemailer service are operational.",
};


const StatusModal = ({ isOpen, title, message, onClose, type }) => {
    if (!isOpen) return null;

    const isSuccess = type === 'success';

    const statusClasses = {
        success: 'text-[#00cc00] border-[#00cc00] bg-[#e6ffe6]', 
        error: 'text-[#cc0000] border-[#cc0000] bg-[#ffe6e6]',
    };

    const modalColorClasses = statusClasses[type] || statusClasses.error; // Default to error
    const Icon = isSuccess ? CheckCircle : AlertCircle;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={onClose}>
            <div
                className={`bg-white p-5 rounded-lg max-w-sm w-[90%] shadow-xl border-2 transition-all duration-300 transform scale-100 ${modalColorClasses}`}
                onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the content
            >
                <div className="flex items-center justify-between pb-4 border-b border-gray-200">
                    <div className="flex items-center">
                        <Icon size={24} className={`mr-2 ${isSuccess ? 'text-[#00cc00]' : 'text-[#cc0000]'}`} />
                        <h2 className="text-xl font-semibold m-0">{title}</h2>
                    </div>
                    <button 
                        className="p-1 text-gray-700 hover:text-gray-900 transition ml-auto border-none bg-transparent cursor-pointer" 
                        onClick={onClose}
                    >
                        <X size={20} />
                    </button>
                </div>
                <div className="py-5">
                    <p className="m-0">{message}</p>
                </div>
                <div className="pt-4 border-t border-gray-200 text-right">
                    <button 
                        className="bg-[#419902] hover:bg-[#378300] text-white font-medium py-2 px-4 rounded transition" 
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
    const [modalType, setModalType] = useState('success'); 

    const handleSendEmail = async () => {
        setLoading(true);
        setStatusMessage('Sending email...');
        setModalOpen(false); 

        try {
            const response = await fetch('/api/email', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
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
                    h-12 w-12 rounded-full text-white flex items-center justify-center shadow-lg transition-all 
                    ${loading 
                        ? 'bg-[#378300] cursor-not-allowed' 
                        : 'bg-[#419902] hover:bg-[#378300] active:shadow-none cursor-pointer'
                    }
                `}
            >
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