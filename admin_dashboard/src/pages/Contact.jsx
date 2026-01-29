import { useEffect, useState } from 'react';
import { fetchContactMessages, deleteContactMessage } from '../api/contact';

const ContactMessages = () => {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [selectedMessage, setSelectedMessage] = useState(null);

    const loadMessages = async () => {
        try {
            setLoading(true);
            const res = await fetchContactMessages();
            if (res.success) {
                setMessages(res.data);
            }
        } catch (err) {
            console.error('Failed to load messages:', err);
            setError('Failed to load messages');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadMessages();
    }, []);

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this message?')) return;
        try {
            const res = await deleteContactMessage(id);
            if (res.success) {
                setMessages(messages.filter((m) => m.id !== id));
                if (selectedMessage?.id === id) setSelectedMessage(null);
            }
        } catch (err) {
            console.error('Failed to delete message:', err);
            alert('Failed to delete message');
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64 text-gray-500">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mr-3"></div>
                Loading messages...
            </div>
        );
    }

    return (
        <div className="p-6">
            {/* Page Title */}
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">
                Contact Messages
            </h2>

            {messages.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-xl shadow text-gray-500">
                    No messages found
                </div>
            ) : (
                <div className="overflow-x-auto bg-white rounded-xl shadow">
                    <table className="min-w-full">
                        <thead className="bg-gray-50 border-b">
                            <tr>
                                <th className="px-6 py-3 text-left text-sm font-medium text-gray-600 uppercase tracking-wider">
                                    Name
                                </th>
                                <th className="px-6 py-3 text-left text-sm font-medium text-gray-600 uppercase tracking-wider">
                                    Email
                                </th>
                                <th className="px-6 py-3 text-left text-sm font-medium text-gray-600 uppercase tracking-wider">
                                    Subject
                                </th>
                                <th className="px-6 py-3 text-left text-sm font-medium text-gray-600 uppercase tracking-wider">
                                    Message
                                </th>
                                <th className="px-6 py-3 text-center text-sm font-medium text-gray-600 uppercase tracking-wider">
                                    Action
                                </th>
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-gray-200">
                            {messages.map((msg) => (
                                <tr
                                    key={msg.id}
                                    className="hover:bg-gray-50 transition"
                                >
                                    <td className="px-6 py-4 text-sm text-gray-800 font-medium">
                                        {msg.name}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-600">
                                        {msg.email}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-700">
                                        {msg.subject}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-600 max-w-xs truncate">
                                        {msg.message}
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <div className="flex justify-center items-center space-x-4">
                                            <button
                                                onClick={() => setSelectedMessage(msg)}
                                                className="text-blue-600 hover:text-blue-800 font-medium text-sm border border-blue-600 px-3 py-1 rounded-md hover:bg-blue-50 transition-colors"
                                            >
                                                View
                                            </button>
                                            <button
                                                onClick={() => handleDelete(msg.id)}
                                                className="text-red-600 hover:text-red-800 font-medium text-sm border border-red-600 px-3 py-1 rounded-md hover:bg-red-50 transition-colors"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Message Detail Modal */}
            {selectedMessage && (
                <div className="fixed inset-0 z-50 overflow-y-auto">
                    <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
                        <div
                            className="fixed inset-0 transition-opacity"
                            aria-hidden="true"
                            onClick={() => setSelectedMessage(null)}
                        >
                            <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
                        </div>

                        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

                        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                <div className="sm:flex sm:items-start">
                                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                                        <div className="flex justify-between items-center mb-4">
                                            <h3 className="text-lg leading-6 font-bold text-gray-900">
                                                Message Details
                                            </h3>
                                            <button
                                                onClick={() => setSelectedMessage(null)}
                                                className="text-gray-400 hover:text-gray-500"
                                            >
                                                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                                </svg>
                                            </button>
                                        </div>

                                        <div className="space-y-4">
                                            <div>
                                                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">From</p>
                                                <p className="text-gray-900 font-medium">{selectedMessage.name} &lt;{selectedMessage.email}&gt;</p>
                                            </div>
                                            <div>
                                                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Subject</p>
                                                <p className="text-gray-900 font-medium">{selectedMessage.subject}</p>
                                            </div>
                                            <div>
                                                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Message</p>
                                                <div className="mt-1 bg-gray-50 p-4 rounded-lg text-gray-700 whitespace-pre-wrap leading-relaxed">
                                                    {selectedMessage.message}
                                                </div>
                                            </div>
                                            <div className="text-xs text-gray-400">
                                                Received: {new Date(selectedMessage.createdAt).toLocaleString()}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                                <button
                                    type="button"
                                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none sm:ml-3 sm:w-auto sm:text-sm transition-colors"
                                    onClick={() => handleDelete(selectedMessage.id)}
                                >
                                    Delete Message
                                </button>
                                <button
                                    type="button"
                                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm transition-colors"
                                    onClick={() => setSelectedMessage(null)}
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ContactMessages;
