"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { audioCategoryApi } from "@/lib/api";
import { cookieUtils } from "@/lib/api";

export default function AudioCategoriesPage() {
    const [categories, setCategories] = useState([]);
    const [formData, setFormData] = useState({
        name: "",
        icon: "🎵",
    });

    const [editingId, setEditingId] = useState(null);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        const token = cookieUtils.get('token');
        if (!token) {
            setError("Authentication required. Please login.");
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            setError("");
            const response = await audioCategoryApi.getAll(token);
            if (response.success && response.data.categories) {
                setCategories(response.data.categories);
            }
        } catch (err) {
            console.error("Error fetching categories:", err);
            setError(err.message || "Failed to load categories");
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");
        setSubmitting(true);

        const token = cookieUtils.get('token');
        if (!token) {
            setError("Authentication required. Please login.");
            setSubmitting(false);
            return;
        }

        if (!formData.name.trim()) {
            setError("Category name is required");
            setSubmitting(false);
            return;
        }

        try {
            if (editingId) {
                // Update existing category
                const response = await audioCategoryApi.update(editingId, {
                    name: formData.name,
                    icon: formData.icon
                }, token);

                if (response.success) {
                    setSuccess("Category updated successfully!");
                    setEditingId(null);
                    fetchCategories(); // Refresh list
                }
            } else {
                // Add new category
                const response = await audioCategoryApi.create({
                    name: formData.name,
                    icon: formData.icon
                }, token);

                if (response.success) {
                    setSuccess("Category added successfully!");
                    fetchCategories(); // Refresh list
                }
            }

            setFormData({ name: "", icon: "🎵" });
        } catch (err) {
            console.error("Error saving category:", err);
            setError(err.message || "Failed to save category");
        } finally {
            setSubmitting(false);
        }
    };

    const handleEdit = (category) => {
        setFormData({
            name: category.name,
            icon: category.icon
        });
        setEditingId(category.id);
        setError("");
        setSuccess("");
    };

    const handleDelete = async (categoryId) => {
        const category = categories.find(c => c.id === categoryId);
        if (!category) return;

        const trackCount = category.tracks_count || 0;
        if (trackCount > 0) {
            if (!confirm(`This category has ${trackCount} tracks. Are you sure you want to delete it? All tracks will be deleted.`)) {
                return;
            }
        } else {
            if (!confirm(`Are you sure you want to delete "${category.name}"?`)) {
                return;
            }
        }

        const token = cookieUtils.get('token');
        if (!token) {
            setError("Authentication required. Please login.");
            return;
        }

        try {
            const response = await audioCategoryApi.delete(categoryId, token);
            if (response.success) {
                setSuccess("Category deleted successfully!");
                fetchCategories(); // Refresh list
            }
        } catch (err) {
            console.error("Error deleting category:", err);
            setError(err.message || "Failed to delete category");
        }
    };

    const handleCancel = () => {
        setFormData({ name: "", icon: "🎵" });
        setEditingId(null);
        setError("");
        setSuccess("");
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="text-white text-lg">Loading categories...</div>
            </div>
        );
    }

    const commonIcons = ["🎵", "🎙️", "📚", "🌊", "🧘", "🌲", "🎻", "🎷", "🎸", "🎹", "🎤", "🥁", "🎺", "🎬", "📖", "📰", "💃", "🌍", "😂", "❤️", "💻", "⚽", "💼"];

    return (
        <div className="space-y-6 animate-fadeIn">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-1 flex items-center gap-3">
                        <span className="text-4xl">📁</span>
                        Audio Categories
                    </h1>
                    <p className="text-[#9a9a9a] text-sm">Manage audio categories for your library</p>
                </div>
                <Link
                    href="/admin/settings"
                    className="px-4 py-2 bg-[#2a2a2a] hover:bg-[#3a3a3a] text-white rounded-lg smooth-transition text-sm"
                >
                    ← Back to Settings
                </Link>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Add/Edit Category Form */}
                <div className="lg:col-span-1">
                    <div className="bg-gradient-to-br from-[#1a1a1a] to-[#2a2a2a] rounded-xl p-6 border border-[#3a3a3a] sticky top-6">
                        <h2 className="text-xl font-bold text-white mb-4">
                            {editingId ? 'Edit Category' : 'Add New Category'}
                        </h2>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            {/* Error Message */}
                            {error && (
                                <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3">
                                    <p className="text-red-400 text-sm">⚠️ {error}</p>
                                </div>
                            )}

                            {/* Success Message */}
                            {success && (
                                <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-3">
                                    <p className="text-green-400 text-sm">✓ {success}</p>
                                </div>
                            )}

                            {/* Category Name */}
                            <div>
                                <label className="block text-sm font-medium text-[#9a9a9a] mb-2">
                                    Category Name *
                                </label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    placeholder="e.g., Hip Hop"
                                    className="w-full bg-[#0a0a0a] border border-[#3a3a3a] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 smooth-transition"
                                />
                            </div>

                            {/* Icon Selector */}
                            <div>
                                <label className="block text-sm font-medium text-[#9a9a9a] mb-2">
                                    Select Icon
                                </label>
                                <div className="grid grid-cols-6 gap-2 max-h-48 overflow-y-auto bg-[#0a0a0a] border border-[#3a3a3a] rounded-lg p-2">
                                    {commonIcons.map(icon => (
                                        <button
                                            key={icon}
                                            type="button"
                                            onClick={() => setFormData({ ...formData, icon })}
                                            className={`text-2xl p-2 rounded hover:bg-[#2a2a2a] smooth-transition flex items-center justify-center ${formData.icon === icon ? 'bg-blue-600' : 'bg-[#1a1a1a]'
                                                }`}
                                        >
                                            {icon}
                                        </button>
                                    ))}
                                </div>
                                <p className="text-[#6a6a6a] text-xs mt-1">Selected: {formData.icon}</p>
                            </div>

                            {/* Submit Buttons */}
                            <div className="flex gap-2 pt-2">
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2.5 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 smooth-transition text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {submitting ? (editingId ? 'Updating...' : 'Adding...') : (editingId ? 'Update' : 'Add') + ' Category'}
                                </button>
                                {editingId && (
                                    <button
                                        type="button"
                                        onClick={handleCancel}
                                        disabled={submitting}
                                        className="px-4 py-2.5 bg-[#2a2a2a] hover:bg-[#3a3a3a] text-white rounded-lg smooth-transition text-sm disabled:opacity-50"
                                    >
                                        Cancel
                                    </button>
                                )}
                            </div>
                        </form>
                    </div>
                </div>

                {/* Categories List */}
                <div className="lg:col-span-2">
                    <div className="bg-gradient-to-br from-[#1a1a1a] to-[#2a2a2a] rounded-xl border border-[#3a3a3a]">
                        <div className="p-6 border-b border-[#3a3a3a]">
                            <h2 className="text-xl font-bold text-white">
                                All Categories ({categories.length})
                            </h2>
                        </div>

                        <div className="p-4 space-y-2 max-h-[600px] overflow-y-auto">
                            {categories.map(category => (
                                <div
                                    key={category.id}
                                    className="flex items-center justify-between p-4 bg-[#0a0a0a]/50 hover:bg-[#2a2a2a] rounded-lg smooth-transition border border-[#3a3a3a]"
                                >
                                    <div className="flex items-center gap-4">
                                        <span className="text-3xl">{category.icon}</span>
                                        <div>
                                            <p className="text-white font-medium">{category.name}</p>
                                            <p className="text-[#6a6a6a] text-sm">{category.tracks_count || 0} tracks</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => handleEdit(category)}
                                            className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm smooth-transition"
                                        >
                                            ✏️ Edit
                                        </button>
                                        <button
                                            onClick={() => handleDelete(category.id)}
                                            className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded text-sm smooth-transition"
                                        >
                                            🗑️ Delete
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
