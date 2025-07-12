import React, { useState } from 'react';
import { toast } from 'sonner';

const FeedbackModal = ({ isOpen, onClose, onSubmit, request }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  if (!isOpen) return null;

  const otherUserName = request.fromUser?.name || request.toUser?.name || 'the user';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={handleClose}
      />
      
      {/* Modal */}
      <div className="relative bg-gray-800 border border-gray-700 rounded-lg p-6 w-full max-w-md mx-4">
        {/* Header */}
        <div className="mb-6">
          <h2 className="text-xl font-bold text-white mb-2">Leave Feedback</h2>
          <p className="text-gray-400 text-sm">
            Rate your experience with {otherUserName}
          </p>
        </div>

        {/* Swap Details */}
        <div className="mb-6 p-4 bg-gray-700 rounded-lg">
          <h3 className="font-medium text-white mb-2">Swap Details:</h3>
          <div className="text-sm text-gray-300 space-y-1">
            <p><span className="text-cyan-400">You learned:</span> {request.requestedSkill}</p>
            <p><span className="text-cyan-400">You taught:</span> {request.offeredSkill}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Rating */}
          <div>
            <label className="block text-white font-medium mb-3">
              How would you rate this experience? *
            </label>
            <div className="flex justify-center space-x-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className={`text-2xl transition-colors ${
                    star <= rating 
                      ? 'text-yellow-400 hover:text-yellow-300' 
                      : 'text-gray-500 hover:text-gray-400'
                  }`}
                >
                  ★
                </button>
              ))}
            </div>
            <div className="text-center mt-2">
              <span className="text-sm text-gray-400">
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
            <label htmlFor="comment" className="block text-white font-medium mb-2">
              Share your experience *
            </label>
            <textarea
              id="comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Tell us about your experience with this skill swap..."
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400 resize-none"
              rows="4"
              maxLength="500"
            />
            <div className="text-right mt-1">
              <span className="text-xs text-gray-400">
                {comment.length}/500 characters
              </span>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex space-x-3">
            <button
              type="button"
              onClick={handleClose}
              disabled={isSubmitting}
              className="flex-1 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || rating === 0 || !comment.trim()}
              className="flex-1 px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Submitting...
                </div>
              ) : (
                'Submit Feedback'
              )}
            </button>
          </div>
        </form>

        {/* Close button */}
        <button
          onClick={handleClose}
          disabled={isSubmitting}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors disabled:opacity-50"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default FeedbackModal; 