import React, { useState, useEffect } from 'react';
import { Save, AlertCircle, CheckCircle } from 'lucide-react';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import staticPagesApi from '../api/staticPages';

const StaticPages = () => {
    const [pages, setPages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedPage, setSelectedPage] = useState(null);
    const [content, setContent] = useState('');
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState(null);

    useEffect(() => {
        loadPages();
    }, []);

    const loadPages = async () => {
        try {
            setLoading(true);
            const response = await staticPagesApi.getAll();
            if (response.success) {
                // Filter out Contact Us as requested
                const filteredPages = response.data.filter(page => page.slug !== 'contact-us');
                setPages(filteredPages);
                if (filteredPages.length > 0) {
                    setSelectedPage(filteredPages[0]);
                    setContent(filteredPages[0].content);
                }
            } else {
                setError('Failed to load static pages');
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handlePageSelect = (page) => {
        setSelectedPage(page);
        setContent(page.content);
        setMessage(null);
    };

    const handleSave = async () => {
        if (!selectedPage) return;
        try {
            setSaving(true);
            setMessage(null);
            const response = await staticPagesApi.update(selectedPage.id, { content });
            if (response.success) {
                setPages(pages.map(p => p.id === selectedPage.id ? response.data : p));
                setMessage({ type: 'success', text: 'Page content updated successfully' });
            } else {
                setMessage({ type: 'error', text: response.message || 'Failed to update content' });
            }
        } catch (err) {
            setMessage({ type: 'error', text: err.message });
        } finally {
            setSaving(false);
        }
    };

    const modules = {
        toolbar: [
            [{ 'header': [1, 2, 3, false] }],
            ['bold', 'italic', 'underline', 'strike'],
            [{ 'list': 'ordered' }, { 'list': 'bullet' }],
            ['link', 'image'],
            ['clean']
        ],
    };

    if (loading) return <div className="p-4 text-center">Loading pages...</div>;
    if (error) return <div className="p-4 text-center text-red-600">Error: {error}</div>;

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Static Pages</h1>
                <p className="text-gray-600 mt-1">Manage content for About Us, FAQs, and Delivery & Return</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Sidebar - Page List */}
                <div className="lg:col-span-1 space-y-2">
                    {pages.map((page) => (
                        <button
                            key={page.id}
                            onClick={() => handlePageSelect(page)}
                            className={`w-full text-left px-4 py-3 rounded-lg transition-colors font-medium ${selectedPage?.id === page.id
                                ? 'bg-blue-600 text-white shadow-md'
                                : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                                }`}
                        >
                            {page.title}
                        </button>
                    ))}
                </div>

                {/* Main Content - Editor */}
                <div className="lg:col-span-3">
                    {selectedPage ? (
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                            <div className="p-4 border-b flex items-center justify-between bg-gray-50">
                                <h2 className="font-bold text-lg text-gray-900">{selectedPage.title}</h2>
                                <button
                                    onClick={handleSave}
                                    disabled={saving}
                                    className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors font-semibold"
                                >
                                    {saving ? 'Saving...' : (
                                        <>
                                            <Save size={20} />
                                            Save Changes
                                        </>
                                    )}
                                </button>
                            </div>

                            {message && (
                                <div className={`p-4 mx-4 mt-4 rounded-lg flex items-center gap-3 ${message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'
                                    }`}>
                                    {message.type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
                                    {message.text}
                                </div>
                            )}

                            <div className="p-6">
                                <div className="bg-white h-[500px] mb-12">
                                    <ReactQuill
                                        theme="snow"
                                        value={content}
                                        onChange={setContent}
                                        modules={modules}
                                        className="h-full"
                                        placeholder="Start typing your content here..."
                                    />
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="bg-white rounded-xl p-12 text-center text-gray-500 border border-dashed border-gray-300">
                            Select a page from the list to edit its content
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default StaticPages;
