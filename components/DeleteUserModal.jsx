"use client";

import { useState } from "react";
import { authApi, cookieUtils } from "@/lib/api";

export default function DeleteUserModal({ user, onClose, onDelete }) {
    const [isDeleting, setIsDeleting] = useState(false);
    const [error, setError] = useState("");

    const handleDelete = async () => {
        setIsDeleting(true);
        setError("");

        try {
            const token = cookieUtils.get('token');

            if (!token) {
                setError("Not authenticated. Please login.");
                setIsDeleting(false);
                return;
            }

            const response = await authApi.deleteUser(user.id, token);

            if (response.success) {
                onDelete(user.id);
                onClose();
            } else {
                setError(response.message || "Failed to delete user");
                setIsDeleting(false);
            }
        } catch (err) {
            setError(err.message || "Failed to delete user. Please try again.");
            setIsDeleting(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 animate-fadeIn p-4">
            <div className="bg-gradient-to-br from-[#1a1a1a] to-[#2a2a2a] rounded-xl p-8 border border-red-500/30 max-w-md w-full animate-slideUp shadow-2xl shadow-red-500/20">
                {/* Icon */}
                <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center mx-auto mb-4">
                    <span className="text-4xl">⚠️</span>
                </div>

                {/* Title */}
                <h2 className="text-2xl font-bold text-white text-center mb-2">
                    Delete User
                </h2>

                {/* Message */}
                <p className="text-[#9a9a9a] text-center mb-6">
                    Are you sure you want to delete <span className="text-white font-medium">{user.name}</span>?
                    This action cannot be undone.
                </p>

                {/* User Info */}
                <div className="bg-[#0a0a0a]/50 rounded-lg p-4 mb-6 border border-[#3a3a3a]">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center text-white text-sm font-bold">
                            {user.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                            <p className="text-white font-medium">{user.name}</p>
                            <p className="text-[#9a9a9a] text-sm">{user.email}</p>
                        </div>
                    </div>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="bg-red-500/10 border border-red-500 rounded-lg p-3 mb-4">
                        <p className="text-red-400 text-sm">{error}</p>
                    </div>
                )}

                {/* Buttons */}
                <div className="flex gap-3">
                    <button
                        onClick={onClose}
                        disabled={isDeleting}
                        className="flex-1 px-4 py-3 bg-[#2a2a2a] hover:bg-[#3a3a3a] text-white rounded-lg smooth-transition font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleDelete}
                        disabled={isDeleting}
                        className="flex-1 px-4 py-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white rounded-lg smooth-transition font-medium hover:shadow-lg hover:shadow-red-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isDeleting ? "Deleting..." : "Delete User"}
                    </button>
                </div>
            </div>
        </div>
    );
}
