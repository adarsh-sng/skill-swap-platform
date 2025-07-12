import React, { useState } from 'react';
import { toast } from 'sonner';

const SwapRequestModal = ({ isOpen, onClose, targetUser, currentUser, onSubmit }) => {
  const [formData, setFormData] = useState({
    requestedSkill: '',
    offeredSkill: '',
    message: '',
    proposedTime: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

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
      proposedTime: ''
    });
    setErrors({});
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal modal-open">
      <div className="modal-box bg-black/90 backdrop-blur-lg border border-cyan-500/20 text-gray-100 max-w-2xl shadow-[0_0_50px_-12px_rgba(0,255,255,0.25)]">
        <h3 className="font-bold text-lg mb-4 text-white">Request Skill Swap</h3>
        
        {/* Target User Info */}
        <div className="bg-white/5 border border-cyan-500/20 p-4 rounded-lg mb-6">
          <div className="flex items-center gap-3">
            <div className="avatar placeholder">
              <div className="bg-gradient-to-r from-cyan-500 to-cyan-600 text-white rounded-full w-12 border border-cyan-400/30">
                <span className="text-lg font-bold">
                  {targetUser?.name?.charAt(0).toUpperCase() || 'U'}
                </span>
              </div>
            </div>
            <div>
              <h4 className="font-bold text-white">{targetUser?.name || 'Unknown User'}</h4>
              <p className="text-gray-400 text-sm">{targetUser?.location || 'Location not specified'}</p>
              <div className="flex items-center gap-2 mt-1">
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
                <span className="text-sm text-gray-400">
                  {targetUser?.rating || 0}/5 • {targetUser?.swapCount || 0} swaps
                </span>
              </div>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Skills Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="label">
                <span className="label-text text-white">I want to learn</span>
              </label>
              <select
                name="requestedSkill"
                value={formData.requestedSkill}
                onChange={handleChange}
                className={`select select-bordered w-full bg-white/5 border-cyan-500/20 text-white focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 ${errors.requestedSkill ? 'border-red-500' : ''}`}
              >
                <option value="">Select a skill</option>
                {targetUser?.skillsOffered?.map((skill) => (
                  <option key={skill} value={skill}>{skill}</option>
                )) || []}
              </select>
              {errors.requestedSkill && (
                <p className="mt-1 text-sm text-red-400">{errors.requestedSkill}</p>
              )}
            </div>

            <div>
              <label className="label">
                <span className="label-text text-white">I can teach you</span>
              </label>
              <select
                name="offeredSkill"
                value={formData.offeredSkill}
                onChange={handleChange}
                className={`select select-bordered w-full bg-white/5 border-cyan-500/20 text-white focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 ${errors.offeredSkill ? 'border-red-500' : ''}`}
              >
                <option value="">Select a skill</option>
                {currentUser?.skillsOffered?.map((skill) => (
                  <option key={skill} value={skill}>{skill}</option>
                )) || []}
              </select>
              {errors.offeredSkill && (
                <p className="mt-1 text-sm text-red-400">{errors.offeredSkill}</p>
              )}
            </div>
          </div>

          {/* Proposed Time */}
          <div>
            <label className="label">
              <span className="label-text text-white">Proposed Time</span>
            </label>
            <select
              name="proposedTime"
              value={formData.proposedTime}
              onChange={handleChange}
              className={`select select-bordered w-full bg-white/5 border-cyan-500/20 text-white focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 ${errors.proposedTime ? 'border-red-500' : ''}`}
            >
              <option value="">Select a time</option>
              <option value="Monday morning">Monday morning</option>
              <option value="Monday afternoon">Monday afternoon</option>
              <option value="Monday evening">Monday evening</option>
              <option value="Tuesday morning">Tuesday morning</option>
              <option value="Tuesday afternoon">Tuesday afternoon</option>
              <option value="Tuesday evening">Tuesday evening</option>
              <option value="Wednesday morning">Wednesday morning</option>
              <option value="Wednesday afternoon">Wednesday afternoon</option>
              <option value="Wednesday evening">Wednesday evening</option>
              <option value="Thursday morning">Thursday morning</option>
              <option value="Thursday afternoon">Thursday afternoon</option>
              <option value="Thursday evening">Thursday evening</option>
              <option value="Friday morning">Friday morning</option>
              <option value="Friday afternoon">Friday afternoon</option>
              <option value="Friday evening">Friday evening</option>
              <option value="Saturday morning">Saturday morning</option>
              <option value="Saturday afternoon">Saturday afternoon</option>
              <option value="Saturday evening">Saturday evening</option>
              <option value="Sunday morning">Sunday morning</option>
              <option value="Sunday afternoon">Sunday afternoon</option>
              <option value="Sunday evening">Sunday evening</option>
            </select>
            {errors.proposedTime && (
              <p className="mt-1 text-sm text-red-400">{errors.proposedTime}</p>
            )}
          </div>

          {/* Message */}
          <div>
            <label className="label">
              <span className="label-text text-white">Message</span>
            </label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              className={`textarea textarea-bordered w-full h-24 bg-white/5 border-cyan-500/20 text-white placeholder-white/50 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 ${errors.message ? 'border-red-500' : ''}`}
              placeholder="Introduce yourself and explain why you'd like to swap skills..."
            />
            {errors.message && (
              <p className="mt-1 text-sm text-red-400">{errors.message}</p>
            )}
          </div>

          {/* Modal Actions */}
          <div className="modal-action">
            <button
              type="button"
              className="btn btn-outline border-cyan-500/20 text-cyan-400 hover:bg-cyan-500/10"
              onClick={handleClose}
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn bg-gradient-to-r from-cyan-500 to-cyan-600 text-white border-0 hover:shadow-cyan-500/20"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <span className="loading loading-spinner loading-sm"></span>
                  Sending...
                </>
              ) : (
                'Send Request'
              )}
            </button>
          </div>
        </form>
      </div>
      <div className="modal-backdrop" onClick={handleClose}></div>
    </div>
  );
};

export default SwapRequestModal; 