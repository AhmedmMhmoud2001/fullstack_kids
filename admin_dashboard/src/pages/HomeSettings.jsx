import React, { useState, useEffect } from 'react';
import { Save, Video, Info, CheckCircle2, Loader2, Play, ExternalLink } from 'lucide-react';
import { fetchSettings, updateSetting } from '../api/settings';

const HomeSettings = () => {
    const [videoUrl, setVideoUrl] = useState('');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState(null);

    const SETTING_KEY = 'home2_hero_video';

    useEffect(() => {
        loadSettings();
    }, []);

    const loadSettings = async () => {
        try {
            setLoading(true);
            const response = await fetchSettings();
            if (response.success) {
                const videoSetting = response.data.find(s => s.key === SETTING_KEY);
                if (videoSetting) setVideoUrl(videoSetting.value);
            }
        } catch (error) {
            console.error('Error loading home settings:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async (e) => {
        e.preventDefault();
        try {
            setSaving(true);
            setMessage(null);
            const response = await updateSetting(SETTING_KEY, videoUrl);
            if (response.success) {
                setMessage({ type: 'success', text: 'Home2 Hero Video updated successfully!' });
                setTimeout(() => setMessage(null), 3000);
            } else {
                setMessage({ type: 'error', text: response.message || 'Failed to update' });
            }
        } catch (error) {
            setMessage({ type: 'error', text: 'An error occurred' });
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center p-20 space-y-4">
                <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
                <p className="text-gray-500 font-medium tracking-wide">Retrieving homepage configuration...</p>
            </div>
        );
    }

    return (
        <div className="space-y-8 max-w-5xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Homepage Settings</h1>
                    <p className="text-gray-500 mt-1 text-base">Customize the Hero section and main media for Home2 (NEXT)</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Form Section */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden transition-all duration-300">
                        <div className="bg-gradient-to-r from-indigo-600 to-blue-700 px-8 py-6">
                            <div className="flex items-center gap-3 text-white">
                                <Video size={28} className="animate-pulse" />
                                <h2 className="text-xl font-bold tracking-wide">Hero Video Content</h2>
                            </div>
                        </div>

                        <div className="p-8">
                            <form onSubmit={handleSave} className="space-y-8">
                                <div className="space-y-4">
                                    <label className="flex items-center gap-2 text-sm font-bold text-gray-700 uppercase tracking-widest">
                                        Hero Video URL
                                        <Info size={14} className="text-blue-500 cursor-help" />
                                    </label>

                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <Play size={20} className="text-gray-300 group-focus-within:text-blue-500 transition-colors" />
                                        </div>
                                        <input
                                            type="url"
                                            value={videoUrl}
                                            onChange={(e) => setVideoUrl(e.target.value)}
                                            placeholder="https://example.com/video.mp4"
                                            className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-gray-100 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all text-base font-medium text-gray-800"
                                            required
                                        />
                                    </div>

                                    <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 flex gap-3">
                                        <Info size={20} className="text-blue-500 shrink-0 mt-0.5" />
                                        <div className="text-sm text-blue-700 space-y-1">
                                            <p className="font-semibold italic">Pro Tip:</p>
                                            <p>Use a direct link to a video file (.mp4, .webm). Recommended resolution is HD (1920x1080) with a reasonable file size for faster loading.</p>
                                        </div>
                                    </div>
                                </div>

                                {message && (
                                    <div className={`p-4 rounded-xl flex items-center gap-3 animate-in fade-in slide-in-from-top-2 duration-300 ${message.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-red-50 text-red-700 border border-red-100'
                                        }`}>
                                        {message.type === 'success' ? <CheckCircle2 size={20} /> : <Info size={20} />}
                                        <span className="font-semibold">{message.text}</span>
                                    </div>
                                )}

                                <div className="pt-2">
                                    <button
                                        type="submit"
                                        disabled={saving}
                                        className="w-full sm:w-auto flex items-center justify-center gap-3 bg-slate-900 hover:bg-slate-800 text-white font-bold py-4 px-10 rounded-xl transition-all shadow-lg hover:shadow-slate-200 active:scale-[0.98] disabled:opacity-50"
                                    >
                                        {saving ? (
                                            <Loader2 className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                        ) : (
                                            <Save size={20} />
                                        )}
                                        {saving ? 'Updating System...' : 'Update Hero Video'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>

                {/* Preview Section */}
                <div className="lg:col-span-1">
                    <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6 space-y-4">
                        <div className="flex items-center justify-between mb-2">
                            <h3 className="font-bold text-gray-900 uppercase tracking-wider text-sm italic">Live Preview</h3>
                            {videoUrl && (
                                <a
                                    href={videoUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-500 hover:text-blue-700 p-1 rounded-lg hover:bg-blue-50 transition-colors"
                                    title="Open video in new tab"
                                >
                                    <ExternalLink size={18} />
                                </a>
                            )}
                        </div>

                        <div className="aspect-[9/16] md:aspect-video rounded-xl bg-slate-900 overflow-hidden relative shadow-inner group">
                            {videoUrl ? (
                                <video
                                    key={videoUrl}
                                    src={videoUrl}
                                    className="w-full h-full object-cover"
                                    autoPlay
                                    muted
                                    loop
                                    playsInline
                                />
                            ) : (
                                <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-500 p-6 text-center">
                                    <Video size={48} className="mb-4 opacity-20" />
                                    <p className="text-sm font-medium">Add a URL to see a preview of how the video appears to customers.</p>
                                </div>
                            )}

                            {/* Overlay simulator */}
                            <div className="absolute inset-0 bg-black/30 pointer-events-none flex items-center justify-center p-4">
                                <div className="text-center opacity-60">
                                    <div className="h-4 w-32 bg-white/20 rounded-full mx-auto mb-2" />
                                    <div className="h-2 w-48 bg-white/10 rounded-full mx-auto" />
                                </div>
                            </div>
                        </div>

                        <div className="pt-4 border-t border-gray-50">
                            <h4 className="font-bold text-sm text-gray-700 mb-2">Technical Specs</h4>
                            <ul className="text-xs text-gray-500 space-y-2">
                                <li className="flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 bg-blue-400 rounded-full" />
                                    <span>Format: MP4, WebM, or AV1</span>
                                </li>
                                <li className="flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 bg-blue-400 rounded-full" />
                                    <span>Ratio: 16:9 recommended</span>
                                </li>
                                <li className="flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 bg-blue-400 rounded-full" />
                                    <span>Sound: Muted by default</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HomeSettings;
