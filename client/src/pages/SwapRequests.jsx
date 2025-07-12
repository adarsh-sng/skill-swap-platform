import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { useAuth } from '../context/AuthContext';
import apiService from '../services/api';
import FeedbackModal from '../components/FeedbackModal';

const SwapRequests = () => {
  const { user } = useAuth();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('received'); // 'received' or 'sent'
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const response = await apiService.getSwapRequests();
      console.log('Fetched requests:', response);
      console.log('Current user ID:', user?._id);
      setRequests(response);
    } catch (error) {
      console.error('Error fetching requests:', error);
      toast.error('Failed to load swap requests');
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptRequest = async (requestId) => {
    try {
      await apiService.acceptSwapRequest(requestId);
      toast.success('Swap request accepted!');
      fetchRequests(); // Refresh the list
    } catch (error) {
      console.error('Error accepting request:', error);
      toast.error('Failed to accept request');
    }
  };

  const handleRejectRequest = async (requestId) => {
    try {
      await apiService.rejectSwapRequest(requestId);
      toast.success('Swap request rejected');
      fetchRequests(); // Refresh the list
    } catch (error) {
      console.error('Error rejecting request:', error);
      toast.error('Failed to reject request');
    }
  };

  const handleCompleteSwap = async (requestId) => {
    try {
      await apiService.completeSwapRequest(requestId);
      toast.success('Swap marked as completed!');
      fetchRequests(); // Refresh the list
    } catch (error) {
      console.error('Error completing swap:', error);
      toast.error('Failed to complete swap');
    }
  };

  const handleLeaveFeedback = (request) => {
    setSelectedRequest(request);
    setShowFeedbackModal(true);
  };

  const handleSubmitFeedback = async (feedbackData) => {
    try {
      await apiService.submitFeedback(selectedRequest._id, feedbackData);
      toast.success('Feedback submitted successfully!');
      setShowFeedbackModal(false);
      setSelectedRequest(null);
      fetchRequests(); // Refresh the list
    } catch (error) {
      console.error('Error submitting feedback:', error);
      toast.error('Failed to submit feedback');
    }
  };

  const getReceivedRequests = () => {
    const received = requests.filter(request => request.toUser === user?._id);
    console.log('Received requests:', received);
    return received;
  };

  const getSentRequests = () => {
    const sent = requests.filter(request => request.fromUser === user?._id);
    console.log('Sent requests:', sent);
    return sent;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { color: 'bg-yellow-500', text: 'Pending' },
      accepted: { color: 'bg-green-500', text: 'Accepted' },
      rejected: { color: 'bg-red-500', text: 'Rejected' },
      completed: { color: 'bg-blue-500', text: 'Completed' }
    };

    const config = statusConfig[status] || { color: 'bg-gray-500', text: status };
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium text-white ${config.color}`}>
        {config.text}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-gray-100 pt-20">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400"></div>
          </div>
        </div>
      </div>
    );
  }

  const receivedRequests = getReceivedRequests();
  const sentRequests = getSentRequests();

  return (
    <div className="min-h-screen bg-black text-gray-100 pt-20">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Swap Requests</h1>
          <p className="text-gray-400">Manage your skill exchange requests</p>
        </div>

        {/* Tabs */}
        <div className="mb-6">
          <div className="flex space-x-1 bg-gray-800 p-1 rounded-lg">
            <button
              onClick={() => setActiveTab('received')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
                activeTab === 'received'
                  ? 'bg-cyan-500 text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Received ({receivedRequests.length})
            </button>
            <button
              onClick={() => setActiveTab('sent')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
                activeTab === 'sent'
                  ? 'bg-cyan-500 text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Sent ({sentRequests.length})
            </button>
          </div>
        </div>

        {/* Requests List */}
        <div className="space-y-4">
          {activeTab === 'received' ? (
            receivedRequests.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-gray-400 text-lg mb-2">No received requests</div>
                <p className="text-gray-500">You haven't received any swap requests yet</p>
              </div>
            ) : (
              receivedRequests.map((request) => (
                <div key={request._id} className="bg-gray-800 border border-gray-700 rounded-lg p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-1">
                        Request from {request.fromUser?.name || 'Unknown User'}
                      </h3>
                      <p className="text-gray-400 text-sm">{request.fromUser?.email}</p>
                    </div>
                    {getStatusBadge(request.status)}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <h4 className="font-medium text-cyan-400 mb-1">They want to learn:</h4>
                      <p className="text-white">{request.requestedSkill}</p>
                    </div>
                    <div>
                      <h4 className="font-medium text-cyan-400 mb-1">They can teach you:</h4>
                      <p className="text-white">{request.offeredSkill}</p>
                    </div>
                  </div>

                  {request.message && (
                    <div className="mb-4">
                      <h4 className="font-medium text-cyan-400 mb-1">Message:</h4>
                      <p className="text-gray-300">{request.message}</p>
                    </div>
                  )}

                  <div className="flex justify-between items-center">
                    <div className="text-sm text-gray-400">
                      Proposed: {formatDate(request.proposedTime)}
                    </div>
                    
                    {request.status === 'pending' && (
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleAcceptRequest(request._id)}
                          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                        >
                          Accept
                        </button>
                        <button
                          onClick={() => handleRejectRequest(request._id)}
                          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                        >
                          Reject
                        </button>
                      </div>
                    )}

                    {request.status === 'accepted' && !request.completed && (
                      <button
                        onClick={() => handleCompleteSwap(request._id)}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        Mark Complete
                      </button>
                    )}

                    {request.status === 'completed' && !request.feedback && (
                      <button
                        onClick={() => handleLeaveFeedback(request)}
                        className="px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors"
                      >
                        Leave Feedback
                      </button>
                    )}

                    {request.feedback && (
                      <div className="text-sm text-gray-400">
                        Feedback submitted ✓
                      </div>
                    )}
                  </div>
                </div>
              ))
            )
          ) : (
            sentRequests.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-gray-400 text-lg mb-2">No sent requests</div>
                <p className="text-gray-500">You haven't sent any swap requests yet</p>
              </div>
            ) : (
              sentRequests.map((request) => (
                <div key={request._id} className="bg-gray-800 border border-gray-700 rounded-lg p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-1">
                        Request to {request.toUser?.name || 'Unknown User'}
                      </h3>
                      <p className="text-gray-400 text-sm">{request.toUser?.email}</p>
                    </div>
                    {getStatusBadge(request.status)}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <h4 className="font-medium text-cyan-400 mb-1">You want to learn:</h4>
                      <p className="text-white">{request.requestedSkill}</p>
                    </div>
                    <div>
                      <h4 className="font-medium text-cyan-400 mb-1">You can teach:</h4>
                      <p className="text-white">{request.offeredSkill}</p>
                    </div>
                  </div>

                  {request.message && (
                    <div className="mb-4">
                      <h4 className="font-medium text-cyan-400 mb-1">Your message:</h4>
                      <p className="text-gray-300">{request.message}</p>
                    </div>
                  )}

                  <div className="flex justify-between items-center">
                    <div className="text-sm text-gray-400">
                      Sent: {formatDate(request.createdAt)}
                    </div>
                    
                    {request.status === 'accepted' && !request.completed && (
                      <button
                        onClick={() => handleCompleteSwap(request._id)}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        Mark Complete
                      </button>
                    )}

                    {request.status === 'completed' && !request.feedback && (
                      <button
                        onClick={() => handleLeaveFeedback(request)}
                        className="px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors"
                      >
                        Leave Feedback
                      </button>
                    )}

                    {request.feedback && (
                      <div className="text-sm text-gray-400">
                        Feedback submitted ✓
                      </div>
                    )}
                  </div>
                </div>
              ))
            )
          )}
        </div>

        {/* Feedback Modal */}
        {showFeedbackModal && selectedRequest && (
          <FeedbackModal
            isOpen={showFeedbackModal}
            onClose={() => {
              setShowFeedbackModal(false);
              setSelectedRequest(null);
            }}
            onSubmit={handleSubmitFeedback}
            request={selectedRequest}
          />
        )}
      </div>
    </div>
  );
};

export default SwapRequests; 