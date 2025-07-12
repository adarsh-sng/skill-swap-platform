import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { toast } from 'sonner';
import useScrollLock from '../hooks/useScrollLock';

const FeedbackModal = ({ isOpen, onClose, onSubmit, request }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Disable scrolling when modal is open
  useScrollLock(isOpen);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (rating === 0) {
      toast.error('Please select a rating');
      return;
    }

    if (!comment.trim()) {
      toast.error('Please provide a comment');
      return;
    }

    setIsSubmitting(true);
    
    try {
      await onSubmit({
        rating,
        comment: comment.trim(),
        swapRequestId: request._id
      });
      
      // Reset form
      setRating(0);
      setComment('');
    } catch (error) {
      console.error('Error submitting feedback:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setRating(0);
      setComment('');
      onClose();
    }
  };

  if (!isOpen || !mounted) return null;

  const otherUserName = request.fromUser?.name || request.toUser?.name || 'the user';

  const modalContent = (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}>
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={handleClose}
      />
      
      {/* Modal */}
      <div className="relative w-full max-w-md bg-gradient-to-br from-gray-900/95 to-gray-800/95 backdrop-blur-xl border border-cyan-500/30 rounded-2xl shadow-[0_25px_50px_-12px_rgba(0,255,255,0.25)] animate-in fade-in-0 zoom-in-95 duration-300" style={{ zIndex: 10000 }}>
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700/50">
          <div>
            <h3 className="text-xl font-bold text-white">Leave Feedback</h3>
            <p className="text-gray-400 text-sm mt-1">Rate your experience with {otherUserName}</p>
          </div>
          <button
            onClick={handleClose}
            disabled={isSubmitting}
            className="p-2 text-gray-400 hover:text-white hover:bg-gray-700/50 rounded-lg transition-all duration-200 disabled:opacity-50"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Swap Details */}
        <div className="p-6 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 border-b border-gray-700/50">
          <h3 className="font-semibold text-white mb-3 flex items-center gap-2">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Swap Details:
          </h3>
          <div className="text-sm text-gray-300 space-y-2">
            <p><span className="text-cyan-400 font-medium">You learned:</span> {request.requestedSkill}</p>
            <p><span className="text-purple-400 font-medium">You taught:</span> {request.offeredSkill}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Rating */}
          <div>
            <label className="block text-white font-semibold mb-4 flex items-center gap-2">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              How would you rate this experience? *
            </label>
            <div className="flex justify-center space-x-3">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className={`text-3xl transition-all duration-200 transform hover:scale-110 ${
                    star <= rating 
                      ? 'text-yellow-400 hover:text-yellow-300' 
                      : 'text-gray-500 hover:text-gray-400'
                  }`}
                >
                  ★
                </button>
              ))}
            </div>
            <div className="text-center mt-3">
              <span className="text-sm text-gray-400 font-medium">
                {rating === 0 && 'Select a rating'}
                {rating === 1 && 'Poor'}
                {rating === 2 && 'Fair'}
                {rating === 3 && 'Good'}
                {rating === 4 && 'Very Good'}
                {rating === 5 && 'Excellent'}
              </span>
            </div>
          </div>

          {/* Comment */}
          <div>
            <label htmlFor="comment" className="block text-white font-semibold mb-3 flex items-center gap-2">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
              </svg>
              Share your experience *
            </label>
            <textarea
              id="comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Tell us about your experience with this skill swap..."
              className="w-full px-4 py-3 bg-gray-800/50 border border-cyan-500/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 resize-none transition-all duration-200"
              rows="4"
              maxLength="500"
            />
            <div className="text-right mt-2">
              <span className="text-xs text-gray-400">
                {comment.length}/500 characters
              </span>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={handleClose}
              disabled={isSubmitting}
              className="flex-1 btn btn-outline border-gray-600 text-gray-300 hover:bg-gray-700 hover:border-gray-500 transition-all duration-300 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || rating === 0 || !comment.trim()}
              className="flex-1 btn bg-gradient-to-r from-cyan-500 to-cyan-600 text-white border-0 hover:from-cyan-600 hover:to-cyan-700 shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 transition-all duration-300 rounded-lg font-semibold"
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Submitting...
                </div>
              ) : (
                'Submit Feedback'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};

export default FeedbackModal; 