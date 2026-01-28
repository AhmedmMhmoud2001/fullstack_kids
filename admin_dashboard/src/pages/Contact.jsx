import { useEffect, useState } from 'react';

const ContactMessages = () => {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const mockMessages = [
            {
                id: 1,
                name: 'Ahmed Ali',
                email: 'ahmed@email.com',
                subject: 'Order Inquiry',
                message: 'I want to ask about my order status.'
            },
            {
                id: 2,
                name: 'Sara Mohamed',
                email: 'sara@email.com',
                subject: 'Product Question',
                message: 'Is this product available in more sizes?'
            },
            {
                id: 3,
                name: 'Omar Hassan',
                email: 'omar@email.com',
                subject: 'Shipping',
                message: 'How long does shipping take?'
            },
            {
                id: 4,
                name: 'Omar Hassan',
                email: 'omar@email.com',
                subject: 'Shipping',
                message: 'How long does shipping take?'
            },
            {
                id: 5,
                name: 'Omar Hassan',
                email: 'omar@email.com',
                subject: 'Shipping',
                message: 'How long does shipping take?'
            }, {
                id: 6,
                name: 'Omar Hassan',
                email: 'omar@email.com',
                subject: 'Shipping',
                message: 'How long does shipping take?'
            }
        ];

        setTimeout(() => {
            setMessages(mockMessages);
            setLoading(false);
        }, 500);
    }, []);

    const deleteMessage = (id) => {
        if (!window.confirm('Delete this message?')) return;
        setMessages(messages.filter((m) => m.id !== id));
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64 text-gray-500">
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
                <div className="text-center text-gray-500">
                    No messages found
                </div>
            ) : (
                <div className="overflow-x-auto bg-white rounded-xl shadow">
                    <table className="min-w-full">
                        <thead className="bg-gray-50 border-b">
                            <tr>
                                <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                                    Name
                                </th>
                                <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                                    Email
                                </th>
                                <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                                    Subject
                                </th>
                                <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                                    Message
                                </th>
                                <th className="px-6 py-3 text-center text-sm font-medium text-gray-600">
                                    Action
                                </th>
                            </tr>
                        </thead>

                        <tbody className="divide-y">
                            {messages.map((msg) => (
                                <tr
                                    key={msg.id}
                                    className="hover:bg-gray-50 transition"
                                >
                                    <td className="px-6 py-4 text-sm text-gray-800">
                                        {msg.name}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-600">
                                        {msg.email}
                                    </td>
                                    <td className="px-6 py-4 text-sm font-medium text-gray-700">
                                        {msg.subject}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-600 max-w-md truncate">
                                        {msg.message}
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <button
                                            onClick={() => deleteMessage(msg.id)}
                                            className="text-red-600 hover:text-red-800 font-medium"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default ContactMessages;
