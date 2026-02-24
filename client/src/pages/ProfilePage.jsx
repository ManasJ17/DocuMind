import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { changePassword } from '../services/api';
import toast from 'react-hot-toast';

export default function ProfilePage() {
    const { user } = useAuth();
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChangePassword = async (e) => {
        e.preventDefault();

        if (newPassword !== confirmPassword) {
            return toast.error('New passwords do not match');
        }

        if (newPassword.length < 6) {
            return toast.error('Password must be at least 6 characters');
        }

        setLoading(true);
        try {
            await changePassword({ currentPassword, newPassword });
            toast.success('Password changed successfully!');
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to change password');
        } finally {
            setLoading(false);
        }
    };

    const inputClass = "w-full h-[48px] px-4 rounded-2xl border border-gray-200 bg-[#F9FAFB] text-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-sm";

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <div>
                <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Profile</h1>
                <p className="text-gray-500 mt-1">Manage your account settings</p>
            </div>

            {/* Profile Info */}
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                <div className="flex items-center gap-4 mb-6">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#4F46E5] to-[#3B82F6] flex items-center justify-center text-white text-2xl font-bold shadow-lg shadow-blue-500/20">
                        {user?.username?.charAt(0)?.toUpperCase()}
                    </div>
                    <div>
                        <h2 className="text-lg font-semibold text-gray-900">{user?.username}</h2>
                        <p className="text-sm text-gray-500">{user?.email}</p>
                    </div>
                </div>

                <div className="grid gap-4">
                    <div className="flex justify-between py-3 border-b border-gray-100">
                        <span className="text-sm text-gray-500">Username</span>
                        <span className="text-sm font-medium text-gray-900">{user?.username}</span>
                    </div>
                    <div className="flex justify-between py-3 border-b border-gray-100">
                        <span className="text-sm text-gray-500">Email</span>
                        <span className="text-sm font-medium text-gray-900">{user?.email}</span>
                    </div>
                    <div className="flex justify-between py-3">
                        <span className="text-sm text-gray-500">Member since</span>
                        <span className="text-sm font-medium text-gray-900">
                            {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                        </span>
                    </div>
                </div>
            </div>

            {/* Change Password */}
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Change Password</h2>

                <form onSubmit={handleChangePassword} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-500 mb-1.5">Current Password</label>
                        <input
                            type="password"
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            required
                            className={inputClass}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-500 mb-1.5">New Password</label>
                        <input
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            required
                            minLength={6}
                            className={inputClass}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-500 mb-1.5">Confirm New Password</label>
                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                            className={inputClass}
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="px-6 py-3 bg-gradient-to-r from-[#4F46E5] to-[#3B82F6] text-white font-medium rounded-2xl shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 disabled:opacity-50 transition-all text-sm"
                    >
                        {loading ? 'Updating...' : 'Update Password'}
                    </button>
                </form>
            </div>
        </div>
    );
}
