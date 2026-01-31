import React, { useState, useEffect } from 'react';
import { Save, Truck, Info, CheckCircle2 } from 'lucide-react';
import { fetchSettings, updateSetting } from '../api/settings';

const Settings = () => {
    const [shippingFee, setShippingFee] = useState('');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState(null);

    useEffect(() => {
        loadSettings();
    }, []);

    const loadSettings = async () => {
        try {
            setLoading(true);
            const response = await fetchSettings();
            if (response.success) {
                const shipping = response.data.find(s => s.key === 'shipping_fee');
                if (shipping) setShippingFee(shipping.value);
            }
        } catch (error) {
            console.error('Error loading settings:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async (e) => {
        e.preventDefault();
        try {
            setSaving(true);
            setMessage(null);
            const response = await updateSetting('shipping_fee', shippingFee);
            if (response.success) {
                setMessage({ type: 'success', text: 'Shipping fee updated successfully!' });
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

    if (loading) return <div className="p-8 text-center text-gray-500">Loading Configuration...</div>;

    return (
        <div className="space-y-6 max-w-4xl mx-auto">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 tracking-tight">System Configuration</h1>
                    <p className="text-gray-500 mt-1 text-base">Global settings control for the entire platform</p>
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-2xl">
                <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-8 py-6">
                    <div className="flex items-center gap-3 text-white">
                        <Truck size={28} className="animate-bounce" />
                        <h2 className="text-xl font-bold">Delivery & Logistics</h2>
                    </div>
                </div>

                <div className="p-8">
                    <form onSubmit={handleSave} className="space-y-8">
                        <div>
                            <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-3 uppercase tracking-wider">
                                Global Shipping Fee (EE)
                                <Info size={14} className="text-blue-500 cursor-help" />
                            </label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <span className="text-gray-400 font-bold">EE</span>
                                </div>
                                <input
                                    type="number"
                                    step="0.01"
                                    value={shippingFee}
                                    onChange={(e) => setShippingFee(e.target.value)}
                                    placeholder="Enter amount (e.g. 150.00)"
                                    className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-gray-100 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all text-lg font-semibold text-gray-800 group-hover:bg-white"
                                    required
                                />
                            </div>
                            <p className="mt-3 text-sm text-gray-400 italic flex items-center gap-1">
                                <Info size={14} />
                                This fee will be automatically applied to all new orders during checkout.
                            </p>
                        </div>

                        {message && (
                            <div className={`p-4 rounded-xl flex items-center gap-3 animate-in fade-in slide-in-from-top-2 duration-300 ${message.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-red-50 text-red-700 border border-red-100'
                                }`}>
                                {message.type === 'success' ? <CheckCircle2 size={20} /> : <Info size={20} />}
                                <span className="font-semibold">{message.text}</span>
                            </div>
                        )}

                        <div className="pt-4">
                            <button
                                type="submit"
                                disabled={saving}
                                className="w-full sm:w-auto flex items-center justify-center gap-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 px-10 rounded-xl transition-all shadow-lg shadow-indigo-200 active:scale-95 disabled:opacity-50"
                            >
                                {saving ? (
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                ) : (
                                    <Save size={20} />
                                )}
                                {saving ? 'Propagating Changes...' : 'Save Configuration'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            {/* Quick Preview Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                    <p className="text-xs font-bold text-gray-400 uppercase mb-2">Current Rate</p>
                    <p className="text-2xl font-black text-blue-600 font-primary">{shippingFee || '0.00'} EE</p>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                    <p className="text-xs font-bold text-gray-400 uppercase mb-2">Scope</p>
                    <p className="text-sm font-semibold text-gray-700">All Audiences (Kids & Next)</p>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                    <p className="text-xs font-bold text-gray-400 uppercase mb-2">Status</p>
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                        <span className="text-sm font-semibold text-gray-700">Live on Production</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Settings;
