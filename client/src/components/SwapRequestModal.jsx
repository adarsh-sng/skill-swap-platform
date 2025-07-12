import React, { useState } from 'react';
import { toast } from 'sonner';
import useScrollLock from '../hooks/useScrollLock';

const SwapRequestModal = ({ isOpen, onClose, targetUser, currentUser, onSubmit }) => {
  const [formData, setFormData] = useState({
    requestedSkill: '',
    offeredSkill: '',
    message: '',
    proposedTime: '',
    proposedDay: '',
    proposedTimeSlot: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  // Disable scrolling when modal is open
  useScrollLock(isOpen);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.requestedSkill) {
      newErrors.requestedSkill = 'Please select a skill you want to learn';
    }
    
    if (!formData.offeredSkill) {
      newErrors.offeredSkill = 'Please select a skill you can offer';
    }
    
    if (!formData.message.trim()) {
      newErrors.message = 'Please add a message explaining your request';
    } else if (formData.message.trim().length < 10) {
      newErrors.message = 'Message must be at least 10 characters';
    }
    
    if (!formData.proposedTime) {
      newErrors.proposedTime = 'Please suggest a time for the swap';
    }

    setErrors(newErrors);
    
    // Show toast for validation errors
    if (Object.keys(newErrors).length > 0) {
      toast.error('Please fix the form errors', {
        description: 'Please check all required fields and try again.',
        duration: 4000,
      });
    }
    
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    
    try {
      console.log('Modal submitting data:', {
        requestedSkill: formData.requestedSkill,
        offeredSkill: formData.offeredSkill,
        message: formData.message,
        proposedTime: formData.proposedTime
      });
      
      await onSubmit({
        requestedSkill: formData.requestedSkill,
        offeredSkill: formData.offeredSkill,
        message: formData.message,
        proposedTime: formData.proposedTime
      });
      
      // Reset form
      setFormData({
        requestedSkill: '',
        offeredSkill: '',
        message: '',
        proposedTime: ''
      });
      setErrors({});
      onClose();
    } catch (error) {
      console.error('Error submitting swap request:', error);
      // Error handling is now done in the parent component with toast
      // Don't close modal on error, let the parent handle it
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      requestedSkill: '',
      offeredSkill: '',
      message: '',
      proposedTime: '',
      proposedDay: '',
      proposedTimeSlot: ''
    });
    setErrors({});
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={handleClose}
      />
      
      {/* Modal */}
      <div className="relative w-full max-w-2xl bg-gradient-to-br from-gray-900/95 to-gray-800/95 backdrop-blur-xl border border-cyan-500/30 rounded-2xl shadow-[0_25px_50px_-12px_rgba(0,255,255,0.25)] animate-in fade-in-0 zoom-in-95 duration-300">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700/50">
          <div>
            <h3 className="text-2xl font-bold text-white">Request Skill Swap</h3>
            <p className="text-gray-400 text-sm mt-1">Send a request to exchange skills</p>
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
        
        {/* Target User Info */}
        <div className="p-6 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 border-b border-gray-700/50">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-16 h-16 bg-gradient-to-br from-cyan-400 to-cyan-600 rounded-full flex items-center justify-center text-white font-bold text-2xl shadow-lg shadow-cyan-500/25">
                {targetUser?.name?.charAt(0).toUpperCase() || 'U'}
              </div>
              <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-gray-900"></div>
            </div>
            <div className="flex-1">
              <h4 className="font-bold text-xl text-white mb-1">{targetUser?.name || 'Unknown User'}</h4>
              <p className="text-gray-400 text-sm mb-2">{targetUser?.location || 'Location not specified'}</p>
              <div className="flex items-center gap-3">
                <div className="rating rating-sm">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <input
                      key={star}
                      type="radio"
                      name={`rating-${targetUser?._id}`}
                      className="mask mask-star-2 bg-orange-400"
                      checked={star <= (targetUser?.rating || 0)}
                      readOnly
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-300">
                  {targetUser?.rating || 0}/5 • {targetUser?.swapCount || 0} swaps
                </span>
              </div>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Skills Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="label">
                <span className="label-text text-white font-semibold flex items-center gap-2">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" />
                  </svg>
                  I want to learn
                </span>
              </label>
              <select
                name="requestedSkill"
                value={formData.requestedSkill}
                onChange={handleChange}
                className={`select w-full bg-gray-800/50 border-cyan-500/30 text-white focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 rounded-lg transition-all duration-200 ${errors.requestedSkill ? 'border-red-500' : ''}`}
              >
                <option value="">Select a skill</option>
                {targetUser?.skillsOffered?.map((skill) => (
                  <option key={skill} value={skill}>{skill}</option>
                )) || []}
              </select>
              {errors.requestedSkill && (
                <p className="mt-2 text-sm text-red-400 flex items-center gap-1">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {errors.requestedSkill}
                </p>
              )}
            </div>

            <div>
              <label className="label">
                <span className="label-text text-white font-semibold flex items-center gap-2">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  I can teach you
                </span>
              </label>
              <select
                name="offeredSkill"
                value={formData.offeredSkill}
                onChange={handleChange}
                className={`select w-full bg-gray-800/50 border-cyan-500/30 text-white focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 rounded-lg transition-all duration-200 ${errors.offeredSkill ? 'border-red-500' : ''}`}
              >
                <option value="">Select a skill</option>
                {currentUser?.skillsOffered?.map((skill) => (
                  <option key={skill} value={skill}>{skill}</option>
                )) || []}
              </select>
              {errors.offeredSkill && (
                <p className="mt-2 text-sm text-red-400 flex items-center gap-1">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {errors.offeredSkill}
                </p>
              )}
            </div>
          </div>

          {/* Proposed Time */}
          <div>
            <label className="label">
              <span className="label-text text-white font-semibold flex items-center gap-2">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                </svg>
                Proposed Time
              </span>
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <select
                name="proposedDay"
                value={formData.proposedDay || ''}
                onChange={(e) => {
                  setFormData(prev => ({
                    ...prev,
                    proposedDay: e.target.value,
                    proposedTime: e.target.value && formData.proposedTimeSlot ? `${e.target.value} ${formData.proposedTimeSlot}` : ''
                  }));
                }}
                className={`select w-full bg-gray-800/50 border-cyan-500/30 text-white focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 rounded-lg transition-all duration-200 ${errors.proposedTime ? 'border-red-500' : ''}`}
              >
                <option value="">Select a day</option>
                <option value="Monday">Monday</option>
                <option value="Tuesday">Tuesday</option>
                <option value="Wednesday">Wednesday</option>
                <option value="Thursday">Thursday</option>
                <option value="Friday">Friday</option>
                <option value="Saturday">Saturday</option>
                <option value="Sunday">Sunday</option>
              </select>
              
              <select
                name="proposedTimeSlot"
                value={formData.proposedTimeSlot || ''}
                onChange={(e) => {
                  setFormData(prev => ({
                    ...prev,
                    proposedTimeSlot: e.target.value,
                    proposedTime: formData.proposedDay && e.target.value ? `${formData.proposedDay} ${e.target.value}` : ''
                  }));
                }}
                className={`select w-full bg-gray-800/50 border-cyan-500/30 text-white focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 rounded-lg transition-all duration-200 ${errors.proposedTime ? 'border-red-500' : ''}`}
              >
                <option value="">Select time</option>
                <option value="morning">Morning</option>
                <option value="afternoon">Afternoon</option>
                <option value="evening">Evening</option>
              </select>
            </div>
            {errors.proposedTime && (
              <p className="mt-2 text-sm text-red-400 flex items-center gap-1">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {errors.proposedTime}
              </p>
            )}
          </div>

          {/* Message */}
          <div>
            <label className="label">
              <span className="label-text text-white font-semibold flex items-center gap-2">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
                </svg>
                Message
              </span>
            </label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder="Tell them about your request and why you'd like to swap skills..."
              rows="4"
              className={`textarea w-full bg-gray-800/50 border-cyan-500/30 text-white placeholder-gray-400 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 rounded-lg transition-all duration-200 resize-none ${errors.message ? 'border-red-500' : ''}`}
            />
            {errors.message && (
              <p className="mt-2 text-sm text-red-400 flex items-center gap-1">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {errors.message}
              </p>
            )}
          </div>

          {/* Buttons */}
          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={handleClose}
              disabled={isLoading}
              className="flex-1 btn btn-outline border-gray-600 text-gray-300 hover:bg-gray-700 hover:border-gray-500 transition-all duration-300 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 btn bg-gradient-to-r from-cyan-500 to-cyan-600 text-white border-0 hover:from-cyan-600 hover:to-cyan-700 shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 transition-all duration-300 rounded-lg font-semibold"
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Sending Request...
                </div>
              ) : (
                'Send Request'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SwapRequestModal; 