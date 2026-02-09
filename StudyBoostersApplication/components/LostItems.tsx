import React, { useState } from 'react';
import { LostItem } from '../types';

interface LostItemsProps {
    lostItems: LostItem[];
    onReportItem: (item: Omit<LostItem, 'id' | 'timestamp' | 'dateReported'>) => void;
    onUpdateStatus: (id: string, status: 'Lost' | 'Found') => void;
    userRole: 'Student' | 'Admin' | 'Mentor';
    userRoll: string;
    onDelete?: (id: string) => void;
}

const LostItems: React.FC<LostItemsProps> = ({
    lostItems,
    onReportItem,
    onUpdateStatus,
    userRole,
    userRoll,
    onDelete
}) => {
    const [showForm, setShowForm] = useState(false);
    const [filterStatus, setFilterStatus] = useState<'All' | 'Lost' | 'Found'>('All');
    const [filterCategory, setFilterCategory] = useState<string>('All');

    const [formData, setFormData] = useState({
        itemName: '',
        description: '',
        category: 'Other' as LostItem['category'],
        location: '',
        status: 'Lost' as LostItem['status'],
        contactInfo: '',
        reportedBy: userRoll
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.itemName || !formData.description || !formData.location) {
            alert('Please fill in all required fields');
            return;
        }

        onReportItem(formData);
        setFormData({
            itemName: '',
            description: '',
            category: 'Other',
            location: '',
            status: 'Lost',
            contactInfo: '',
            reportedBy: userRoll
        });
        setShowForm(false);
        alert('Item reported successfully!');
    };

    const filteredItems = lostItems.filter(item => {
        const statusMatch = filterStatus === 'All' || item.status === filterStatus;
        const categoryMatch = filterCategory === 'All' || item.category === filterCategory;
        return statusMatch && categoryMatch;
    });

    const categories = ['Electronics', 'Books', 'ID Card', 'Keys', 'Clothing', 'Other'];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                        <span className="text-2xl">🔍</span>
                        Lost & Found
                    </h1>
                    <p className="text-slate-400 mt-2">Report or find lost items on campus</p>
                </div>
                <button
                    onClick={() => setShowForm(!showForm)}
                    className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-xl font-semibold shadow-lg shadow-purple-500/30 transition-all hover:scale-105"
                >
                    {showForm ? '✕ Cancel' : '+ Report Item'}
                </button>
            </div>

            {/* Report Form */}
            {showForm && (
                <div className="bg-slate-800/50 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-xl">
                    <h2 className="text-xl font-bold text-white mb-4">Report Lost/Found Item</h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-semibold text-slate-300 mb-2">
                                    Item Name *
                                </label>
                                <input
                                    type="text"
                                    value={formData.itemName}
                                    onChange={(e) => setFormData({ ...formData, itemName: e.target.value })}
                                    className="w-full px-4 py-3 bg-slate-900/50 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
                                    placeholder="e.g., Black iPhone 13"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-slate-300 mb-2">
                                    Category *
                                </label>
                                <select
                                    value={formData.category}
                                    onChange={(e) => setFormData({ ...formData, category: e.target.value as LostItem['category'] })}
                                    className="w-full px-4 py-3 bg-slate-900/50 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                                    required
                                >
                                    {categories.map(cat => (
                                        <option key={cat} value={cat}>{cat}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-slate-300 mb-2">
                                    Location *
                                </label>
                                <input
                                    type="text"
                                    value={formData.location}
                                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                    className="w-full px-4 py-3 bg-slate-900/50 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
                                    placeholder="e.g., Library 2nd Floor"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-slate-300 mb-2">
                                    Status *
                                </label>
                                <select
                                    value={formData.status}
                                    onChange={(e) => setFormData({ ...formData, status: e.target.value as LostItem['status'] })}
                                    className="w-full px-4 py-3 bg-slate-900/50 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                                    required
                                >
                                    <option value="Lost">Lost</option>
                                    <option value="Found">Found</option>
                                </select>
                            </div>

                            <div className="md:col-span-2">
                                <label className="block text-sm font-semibold text-slate-300 mb-2">
                                    Description *
                                </label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    className="w-full px-4 py-3 bg-slate-900/50 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500 min-h-[100px]"
                                    placeholder="Detailed description of the item..."
                                    required
                                />
                            </div>

                            <div className="md:col-span-2">
                                <label className="block text-sm font-semibold text-slate-300 mb-2">
                                    Contact Info (Optional)
                                </label>
                                <input
                                    type="text"
                                    value={formData.contactInfo}
                                    onChange={(e) => setFormData({ ...formData, contactInfo: e.target.value })}
                                    className="w-full px-4 py-3 bg-slate-900/50 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
                                    placeholder="Email or phone number"
                                />
                            </div>
                        </div>

                        <div className="flex gap-3 pt-2">
                            <button
                                type="submit"
                                className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-xl font-semibold transition-all"
                            >
                                Submit Report
                            </button>
                            <button
                                type="button"
                                onClick={() => setShowForm(false)}
                                className="px-6 py-3 bg-slate-700/50 hover:bg-slate-700 text-white rounded-xl font-semibold transition-all"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Filters */}
            <div className="flex flex-wrap gap-4 items-center bg-slate-800/30 backdrop-blur-xl border border-white/10 rounded-xl p-4">
                <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-slate-300">Status:</span>
                    <div className="flex gap-2">
                        {['All', 'Lost', 'Found'].map(status => (
                            <button
                                key={status}
                                onClick={() => setFilterStatus(status as any)}
                                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${filterStatus === status
                                        ? 'bg-purple-500 text-white'
                                        : 'bg-slate-700/50 text-slate-300 hover:bg-slate-700'
                                    }`}
                            >
                                {status}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-slate-300">Category:</span>
                    <select
                        value={filterCategory}
                        onChange={(e) => setFilterCategory(e.target.value)}
                        className="px-4 py-2 bg-slate-700/50 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                        <option value="All">All Categories</option>
                        {categories.map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                        ))}
                    </select>
                </div>

                <div className="ml-auto text-sm text-slate-400">
                    Showing {filteredItems.length} items
                </div>
            </div>

            {/* Items List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredItems.length === 0 ? (
                    <div className="col-span-full text-center py-12">
                        <div className="text-6xl mb-4">📦</div>
                        <p className="text-slate-400 text-lg">No items found</p>
                        <p className="text-slate-500 text-sm mt-2">Try adjusting your filters or be the first to report an item</p>
                    </div>
                ) : (
                    filteredItems.map(item => (
                        <div
                            key={item.id}
                            className="bg-slate-800/50 backdrop-blur-xl border border-white/10 rounded-xl p-5 hover:border-purple-500/50 transition-all group"
                        >
                            <div className="flex items-start justify-between mb-3">
                                <div className={`px-3 py-1 rounded-lg text-xs font-bold ${item.status === 'Lost'
                                        ? 'bg-red-500/20 text-red-400'
                                        : 'bg-green-500/20 text-green-400'
                                    }`}>
                                    {item.status}
                                </div>
                                <div className="px-3 py-1 bg-purple-500/20 text-purple-400 rounded-lg text-xs font-semibold">
                                    {item.category}
                                </div>
                            </div>

                            <h3 className="text-lg font-bold text-white mb-2 group-hover:text-purple-400 transition-colors">
                                {item.itemName}
                            </h3>

                            <p className="text-slate-400 text-sm mb-3 line-clamp-2">
                                {item.description}
                            </p>

                            <div className="space-y-2 text-xs">
                                <div className="flex items-center gap-2 text-slate-500">
                                    <span>📍</span>
                                    <span>{item.location}</span>
                                </div>
                                <div className="flex items-center gap-2 text-slate-500">
                                    <span>📅</span>
                                    <span>{item.dateReported}</span>
                                </div>
                                <div className="flex items-center gap-2 text-slate-500">
                                    <span>👤</span>
                                    <span>Reported by: {item.reportedBy}</span>
                                </div>
                                {item.contactInfo && (
                                    <div className="flex items-center gap-2 text-slate-500">
                                        <span>📞</span>
                                        <span>{item.contactInfo}</span>
                                    </div>
                                )}
                            </div>

                            {(userRole === 'Admin' || item.reportedBy === userRoll) && (
                                <div className="flex gap-2 mt-4 pt-4 border-t border-white/10">
                                    {item.status === 'Lost' && (
                                        <button
                                            onClick={() => onUpdateStatus(item.id, 'Found')}
                                            className="flex-1 px-3 py-2 bg-green-500/20 hover:bg-green-500/30 text-green-400 rounded-lg text-xs font-semibold transition-all"
                                        >
                                            Mark as Found
                                        </button>
                                    )}
                                    {item.status === 'Found' && (
                                        <button
                                            onClick={() => onUpdateStatus(item.id, 'Lost')}
                                            className="flex-1 px-3 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg text-xs font-semibold transition-all"
                                        >
                                            Mark as Lost
                                        </button>
                                    )}
                                    {userRole === 'Admin' && onDelete && (
                                        <button
                                            onClick={() => {
                                                if (window.confirm('Are you sure you want to delete this item?')) {
                                                    onDelete(item.id);
                                                }
                                            }}
                                            className="px-3 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg text-xs font-semibold transition-all"
                                        >
                                            🗑️
                                        </button>
                                    )}
                                </div>
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default LostItems;
