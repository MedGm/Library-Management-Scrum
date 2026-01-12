import { useState, useEffect } from 'react';
import api from '../api';
import { Save, Settings as SettingsIcon } from 'lucide-react';

const Settings = () => {
    const [settings, setSettings] = useState({
        MAX_LOANS: '',
        LOAN_DAYS: '',
        PENALTY_PER_DAY: ''
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState(null);

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            const { data } = await api.get('/settings');
            setSettings(data);
        } catch (error) {
            console.error('Failed to load settings', error);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setSettings({ ...settings, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setMessage(null);
        try {
            await api.put('/settings', settings);
            setMessage({ type: 'success', text: 'Settings updated successfully' });
        } catch (error) {
            setMessage({ type: 'error', text: 'Failed to update settings' });
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="p-8 text-center">Loading settings...</div>;

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            <div className="flex items-center gap-3 mb-8">
                <div className="p-3 bg-primary-100 rounded-lg text-primary-600">
                    <SettingsIcon className="h-6 w-6" />
                </div>
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">System Configuration</h1>
                    <p className="text-gray-500">Manage global borrowing rules and penalties.</p>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-soft border border-gray-100 overflow-hidden">
                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {message && (
                        <div className={`p-4 rounded-lg text-sm font-medium ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                            {message.text}
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Max Active Loans per User</label>
                            <input
                                type="number"
                                name="MAX_LOANS"
                                value={settings.MAX_LOANS}
                                onChange={handleChange}
                                className="w-full rounded-lg border-gray-300 focus:ring-primary-500 focus:border-primary-500"
                                required
                            />
                            <p className="mt-1 text-xs text-gray-500">Limit how many books a user can hold at once.</p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Loan Duration (Days)</label>
                            <input
                                type="number"
                                name="LOAN_DAYS"
                                value={settings.LOAN_DAYS}
                                onChange={handleChange}
                                className="w-full rounded-lg border-gray-300 focus:ring-primary-500 focus:border-primary-500"
                                required
                            />
                            <p className="mt-1 text-xs text-gray-500">Standard borrowing period before overdue.</p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Late Penalty (per Day)</label>
                            <div className="relative rounded-md shadow-sm">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <span className="text-gray-500 sm:text-sm">MAD</span>
                                </div>
                                <input
                                    type="number"
                                    step="0.1"
                                    name="PENALTY_PER_DAY"
                                    value={settings.PENALTY_PER_DAY}
                                    onChange={handleChange}
                                    className="w-full pl-12 rounded-lg border-gray-300 focus:ring-primary-500 focus:border-primary-500"
                                    required
                                />
                            </div>
                            <p className="mt-1 text-xs text-gray-500">Amount charged for each day overdue.</p>
                        </div>
                    </div>

                    <div className="pt-6 border-t border-gray-100 flex justify-end">
                        <button
                            type="submit"
                            disabled={saving}
                            className="flex items-center gap-2 bg-primary-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-primary-700 focus:ring-4 focus:ring-primary-200 transition-all disabled:opacity-50"
                        >
                            <Save className="h-5 w-5" />
                            {saving ? 'Saving...' : 'Save Configuration'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Settings;
