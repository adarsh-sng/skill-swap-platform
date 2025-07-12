import React, { useState } from 'react';
import { toast } from 'sonner';
import useScrollLock from '../hooks/useScrollLock';

const ProfileModal = ({ isOpen, onClose, onSubmit, profileData, isLoading }) => {
    const [activeTab, setActiveTab] = useState('basic');
    const [formData, setFormData] = useState({
        name: profileData?.name || '',
        location: profileData?.location || '',
        bio: profileData?.bio || '',
        isPublic: profileData?.isPublic ?? true,
        skillsOffered: profileData?.skillsOffered || [],
        skillsWanted: profileData?.skillsWanted || [],
        availability: profileData?.availability || {
            monday: { morning: false, afternoon: false, evening: false },
            tuesday: { morning: false, afternoon: false, evening: false },
            wednesday: { morning: false, afternoon: false, evening: false },
            thursday: { morning: false, afternoon: false, evening: false },
            friday: { morning: false, afternoon: false, evening: false },
            saturday: { morning: false, afternoon: false, evening: false },
            sunday: { morning: false, afternoon: false, evening: false }
        }
    });
    const [newSkillOffered, setNewSkillOffered] = useState('');
    const [newSkillWanted, setNewSkillWanted] = useState('');

    // Disable scrolling when modal is open
    useScrollLock(isOpen);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const addSkillOffered = () => {
        if (newSkillOffered.trim() && !formData.skillsOffered.includes(newSkillOffered.trim())) {
            setFormData(prev => ({
                ...prev,
                skillsOffered: [...prev.skillsOffered, newSkillOffered.trim()]
            }));
            setNewSkillOffered('');
        }
    };

    const removeSkillOffered = (skill) => {
        setFormData(prev => ({
            ...prev,
            skillsOffered: prev.skillsOffered.filter(s => s !== skill)
        }));
    };

    const addSkillWanted = () => {
        if (newSkillWanted.trim() && !formData.skillsWanted.includes(newSkillWanted.trim())) {
            setFormData(prev => ({
                ...prev,
                skillsWanted: [...prev.skillsWanted, newSkillWanted.trim()]
            }));
            setNewSkillWanted('');
        }
    };

    const removeSkillWanted = (skill) => {
        setFormData(prev => ({
            ...prev,
            skillsWanted: prev.skillsWanted.filter(s => s !== skill)
        }));
    };

    const toggleAvailability = (day, timeSlot) => {
        setFormData(prev => ({
            ...prev,
            availability: {
                ...prev.availability,
                [day]: {
                    ...prev.availability[day],
                    [timeSlot]: !prev.availability[day][timeSlot]
                }
            }
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.name.trim()) {
            toast.error('Name is required');
            return;
        }

        try {
            await onSubmit(formData);
            onClose();
        } catch (error) {
            console.error('Error saving profile:', error);
        }
    };

    const handleClose = () => {
        if (!isLoading) {
            onClose();
        }
    };

    if (!isOpen) return null;

    const tabs = [
        { id: 'basic', name: 'Basic Info', icon: '👤' },
        { id: 'skills', name: 'Skills', icon: '🎯' },
        { id: 'availability', name: 'Availability', icon: '📅' }
    ];

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={handleClose}
            />

            {/* Modal */}
            <div className="relative w-full max-w-4xl bg-gradient-to-br from-gray-900/95 to-gray-800/95 backdrop-blur-xl border border-cyan-500/30 rounded-2xl shadow-[0_25px_50px_-12px_rgba(0,255,255,0.25)] animate-in fade-in-0 zoom-in-95 duration-300">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-700/50">
                    <div>
                        <h3 className="text-2xl font-bold text-white">Edit Profile</h3>
                        <p className="text-gray-400 text-sm mt-1">Update your profile information</p>
                    </div>
                    <button
                        onClick={handleClose}
                        disabled={isLoading}
                        className="p-2 text-gray-400 hover:text-white hover:bg-gray-700/50 rounded-lg transition-all duration-200 disabled:opacity-50"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Tabs */}
                <div className="flex border-b border-gray-700/50">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex-1 px-6 py-4 text-sm font-medium transition-all duration-200 ${activeTab === tab.id
                                    ? 'text-cyan-400 border-b-2 border-cyan-400 bg-cyan-400/10'
                                    : 'text-gray-400 hover:text-gray-300 hover:bg-gray-700/30'
                                }`}
                        >
                            <span className="mr-2">{tab.icon}</span>
                            {tab.name}
                        </button>
                    ))}
                </div>

                <form onSubmit={handleSubmit} className="p-6">
                    {/* Basic Info Tab */}
                    {activeTab === 'basic' && (
                        <div className="space-y-6">
                            <div>
                                <label className="label">
                                    <span className="label-text text-white font-semibold flex items-center gap-2">
                                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                                        </svg>
                                        Full Name *
                                    </span>
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="input w-full bg-gray-800/50 border-cyan-500/30 text-white focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 rounded-lg transition-all duration-200"
                                    placeholder="Enter your full name"
                                />
                            </div>

                            <div>
                                <label className="label">
                                    <span className="label-text text-white font-semibold flex items-center gap-2">
                                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                                        </svg>
                                        Location
                                    </span>
                                </label>
                                <input
                                    type="text"
                                    name="location"
                                    value={formData.location}
                                    onChange={handleChange}
                                    className="input w-full bg-gray-800/50 border-cyan-500/30 text-white focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 rounded-lg transition-all duration-200"
                                    placeholder="Enter your location"
                                />
                            </div>

                            <div>
                                <label className="label">
                                    <span className="label-text text-white font-semibold flex items-center gap-2">
                                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
                                        </svg>
                                        Bio
                                    </span>
                                </label>
                                <textarea
                                    name="bio"
                                    value={formData.bio}
                                    onChange={handleChange}
                                    rows="4"
                                    className="textarea w-full bg-gray-800/50 border-cyan-500/30 text-white placeholder-gray-400 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 rounded-lg transition-all duration-200 resize-none"
                                    placeholder="Tell others about yourself and your interests..."
                                />
                            </div>

                            <div className="flex items-center gap-3">
                                <input
                                    type="checkbox"
                                    name="isPublic"
                                    checked={formData.isPublic}
                                    onChange={handleChange}
                                    className="checkbox checkbox-primary"
                                />
                                <label className="text-white font-medium">Make my profile public</label>
                            </div>
                        </div>
                    )}

                    {/* Skills Tab */}
                    {activeTab === 'skills' && (
                        <div className="space-y-8">
                            {/* Skills Offered */}
                            <div>
                                <h4 className="text-lg font-semibold text-cyan-400 mb-4 flex items-center gap-2">
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    Skills I Can Teach
                                </h4>

                                <div className="flex gap-2 mb-4">
                                    <input
                                        type="text"
                                        value={newSkillOffered}
                                        onChange={(e) => setNewSkillOffered(e.target.value)}
                                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkillOffered())}
                                        className="input flex-1 bg-gray-800/50 border-cyan-500/30 text-white focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 rounded-lg transition-all duration-200"
                                        placeholder="Add a skill you can teach"
                                    />
                                    <button
                                        type="button"
                                        onClick={addSkillOffered}
                                        className="btn bg-cyan-600 text-white border-0 hover:bg-cyan-700 rounded-xl"
                                    >
                                        Add
                                    </button>
                                </div>

                                <div className="flex flex-wrap gap-2">
                                    {formData.skillsOffered.map((skill, index) => (
                                        <span key={index} className="badge bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 px-3 py-2 rounded-lg">
                                            {skill}
                                            <button
                                                type="button"
                                                onClick={() => removeSkillOffered(skill)}
                                                className="ml-2 text-cyan-300 hover:text-white"
                                            >
                                                ×
                                            </button>
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {/* Skills Wanted */}
                            <div>
                                <h4 className="text-lg font-semibold text-purple-400 mb-4 flex items-center gap-2">
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" />
                                    </svg>
                                    Skills I Want to Learn
                                </h4>

                                <div className="flex gap-2 mb-4">
                                    <input
                                        type="text"
                                        value={newSkillWanted}
                                        onChange={(e) => setNewSkillWanted(e.target.value)}
                                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkillWanted())}
                                        className="input flex-1 bg-gray-800/50 border-purple-500/30 text-white focus:border-purple-400 focus:ring-1 focus:ring-purple-400 rounded-lg transition-all duration-200"
                                        placeholder="Add a skill you want to learn"
                                    />
                                    <button
                                        type="button"
                                        onClick={addSkillWanted}
                                        className="btn bg-purple-600 text-white border-0 hover:bg-purple-700 rounded-xl"
                                    >
                                        Add
                                    </button>
                                </div>

                                <div className="flex flex-wrap gap-2">
                                    {formData.skillsWanted.map((skill, index) => (
                                        <span key={index} className="badge bg-purple-500/20 text-purple-300 border border-purple-500/30 px-3 py-2 rounded-lg">
                                            {skill}
                                            <button
                                                type="button"
                                                onClick={() => removeSkillWanted(skill)}
                                                className="ml-2 text-purple-300 hover:text-white"
                                            >
                                                ×
                                            </button>
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Availability Tab */}
                    {activeTab === 'availability' && (
                        <div className="space-y-6">
                            <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                                </svg>
                                Your Availability
                            </h4>

                            <div className="overflow-x-auto">
                                <table className="table w-full">
                                    <thead>
                                        <tr>
                                            <th className="bg-gray-700 text-white">Day</th>
                                            <th className="bg-gray-700 text-white">Morning</th>
                                            <th className="bg-gray-700 text-white">Afternoon</th>
                                            <th className="bg-gray-700 text-white">Evening</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {Object.entries(formData.availability).map(([day, timeSlots]) => (
                                            <tr key={day} className="hover:bg-gray-700/50">
                                                <td className="font-medium text-white capitalize">{day}</td>
                                                {Object.entries(timeSlots).map(([timeSlot, isAvailable]) => (
                                                    <td key={timeSlot} className="text-center">
                                                        <input
                                                            type="checkbox"
                                                            checked={isAvailable}
                                                            onChange={() => toggleAvailability(day, timeSlot)}
                                                            className="checkbox checkbox-primary"
                                                        />
                                                    </td>
                                                ))}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* Navigation and Submit */}
                    <div className="flex justify-between items-center pt-6 border-t border-gray-700/50 mt-8">
                        <div className="flex gap-2">
                            {tabs.map((tab, index) => (
                                <button
                                    key={tab.id}
                                    type="button"
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`btn btn-sm ${activeTab === tab.id
                                            ? 'bg-cyan-600 text-white'
                                            : 'btn-outline border-gray-600 text-gray-300 hover:bg-gray-700'
                                        }`}
                                >
                                    {tab.icon} {tab.name}
                                </button>
                            ))}
                        </div>

                        <div className="flex gap-4">
                            <button
                                type="button"
                                onClick={handleClose}
                                disabled={isLoading}
                                className="btn btn-outline border-gray-600 text-gray-300 hover:bg-gray-700 hover:border-gray-500 transition-all duration-300 rounded-xl"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="btn bg-gradient-to-r from-cyan-500 to-cyan-600 text-white border-0 hover:from-cyan-600 hover:to-cyan-700 shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 transition-all duration-300 rounded-lg font-semibold"
                            >
                                {isLoading ? (
                                    <div className="flex items-center justify-center gap-2">
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                        Saving...
                                    </div>
                                ) : (
                                    'Save Profile'
                                )}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ProfileModal; 