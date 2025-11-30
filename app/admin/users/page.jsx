"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { authApi, cookieUtils } from "@/lib/api";
import DeleteUserModal from "@/components/DeleteUserModal";

export default function UsersPage() {
    const [users, setUsers] = useState([]);
    const [deleteModal, setDeleteModal] = useState({ show: false, user: null });
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        // Load users on mount
        loadUsers();
    }, []);

    const loadUsers = async () => {
        setIsLoading(true);
        setError("");

        try {
            const token = cookieUtils.get('token');

            if (!token) {
                setError("Not authenticated. Please login.");
                setIsLoading(false);
                return;
            }

            const response = await authApi.getAllUsers(token);

            if (response.success) {
                setUsers(response.data.users);
            } else {
                setError(response.message || "Failed to load users");
            }
        } catch (err) {
            setError(err.message || "Failed to load users. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeleteClick = (user) => {
        setDeleteModal({ show: true, user });
    };

    const handleDeleteConfirm = () => {
        // Reload users after deletion
        loadUsers();
    };

    const handleCloseModal = () => {
        setDeleteModal({ show: false, user: null });
    };

    return (
        <div className="space-y-6 animate-fadeIn">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Users Management</h1>
                    <p className="text-[#9a9a9a]">Manage and monitor all user accounts</p>
                </div>
                <Link
                    href="/admin/users/add"
                    className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:shadow-lg hover:shadow-blue-500/20 smooth-transition hover:scale-105"
                >
                    + Add New User
                </Link>
            </div>

            {/* Error Message */}
            {error && (
                <div className="bg-red-500/10 border border-red-500 rounded-lg p-4">
                    <p className="text-red-400">{error}</p>
                </div>
            )}

            {/* Stats Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gradient-to-br from-[#1a1a1a] to-[#2a2a2a] rounded-lg p-4 border border-[#3a3a3a]">
                    <p className="text-[#9a9a9a] text-sm">Total Users</p>
                    <p className="text-2xl font-bold text-white mt-1">
                        {isLoading ? "..." : users.length}
                    </p>
                </div>
                <div className="bg-gradient-to-br from-[#1a1a1a] to-[#2a2a2a] rounded-lg p-4 border border-[#3a3a3a]">
                    <p className="text-[#9a9a9a] text-sm">Administrators</p>
                    <p className="text-2xl font-bold text-blue-400 mt-1">
                        {isLoading ? "..." : users.filter(u => u.role === 'admin').length}
                    </p>
                </div>
                <div className="bg-gradient-to-br from-[#1a1a1a] to-[#2a2a2a] rounded-lg p-4 border border-[#3a3a3a]">
                    <p className="text-[#9a9a9a] text-sm">Subscribers</p>
                    <p className="text-2xl font-bold text-green-400 mt-1">
                        {isLoading ? "..." : users.filter(u => u.role === 'subscriber').length}
                    </p>
                </div>
            </div>

            {/* Users Table */}
            <div className="bg-gradient-to-br from-[#1a1a1a] to-[#2a2a2a] rounded-xl border border-[#3a3a3a] overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-[#0a0a0a] border-b border-[#3a3a3a]">
                                <th className="text-left p-4 text-[#9a9a9a] font-medium text-sm">Name</th>
                                <th className="text-left p-4 text-[#9a9a9a] font-medium text-sm">Email</th>
                                <th className="text-left p-4 text-[#9a9a9a] font-medium text-sm">Role</th>
                                <th className="text-left p-4 text-[#9a9a9a] font-medium text-sm">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {isLoading ? (
                                <tr>
                                    <td colSpan="4" className="p-8 text-center text-[#9a9a9a]">
                                        <div className="flex items-center justify-center gap-2">
                                            <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                                            Loading users...
                                        </div>
                                    </td>
                                </tr>
                            ) : users.length === 0 ? (
                                <tr>
                                    <td colSpan="4" className="p-8 text-center text-[#9a9a9a]">
                                        No users found. Click "Add New User" to create one.
                                    </td>
                                </tr>
                            ) : (
                                users.map((user, index) => (
                                    <tr
                                        key={user.id}
                                        className="border-b border-[#3a3a3a] hover:bg-[#2a2a2a] smooth-transition animate-slideUp"
                                        style={{ animationDelay: `${index * 0.05}s` }}
                                    >
                                        <td className="p-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-sm font-bold">
                                                    {user.name.split(' ').map(n => n[0]).join('')}
                                                </div>
                                                <span className="text-white font-medium">{user.name}</span>
                                            </div>
                                        </td>
                                        <td className="p-4 text-[#9a9a9a]">{user.email}</td>
                                        <td className="p-4">
                                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${user.role === 'admin' ? 'bg-blue-500/20 text-blue-400' : 'bg-green-500/20 text-green-400'
                                                }`}>
                                                {user.role === 'admin' ? 'Administrator' : 'Subscriber'}
                                            </span>
                                        </td>
                                        <td className="p-4">
                                            <div className="flex gap-2">
                                                <Link
                                                    href={`/admin/users/edit/${user.id}`}
                                                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg smooth-transition font-medium"
                                                >
                                                    ✏️ Edit
                                                </Link>
                                                <button
                                                    onClick={() => handleDeleteClick(user)}
                                                    className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm rounded-lg smooth-transition font-medium"
                                                >
                                                    🗑️ Delete
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Delete Modal */}
            {deleteModal.show && (
                <DeleteUserModal
                    user={deleteModal.user}
                    onClose={handleCloseModal}
                    onDelete={handleDeleteConfirm}
                />
            )}
        </div>
    );
}