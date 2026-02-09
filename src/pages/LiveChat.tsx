import React from 'react';
import SupportInbox from '@/components/SupportInbox';

const LiveChat: React.FC = () => {
    return (
        <div className="container mx-auto p-6">
            <div className="mb-6">
                <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-brand-gradient">Live Chat Support</h1>
                <p className="text-gray-600 mt-2">
                    Manage customer support tickets and respond to live chat messages
                </p>
            </div>

            <div className="h-[calc(100vh-200px)] overflow-hidden">
                <SupportInbox />
            </div>
        </div>
    );
};

export default LiveChat;
