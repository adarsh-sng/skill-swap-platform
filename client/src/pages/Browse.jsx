import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { useAuth } from '../context/AuthContext';
import UserProfileCard from '../components/UserProfileCard';
import SwapRequestModal from '../components/SwapRequestModal';
import apiService from '../services/api';

const Browse = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [skillFilter, setSkillFilter] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await apiService.getUsers();
      // Filter out the current user
      const filteredUsers = response.filter(u => u._id !== user?._id);
      setUsers(filteredUsers);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const handleRequestSwap = (user) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const handleSubmitSwapRequest = async (swapData) => {
    try {
      console.log('Submitting swap request with data:', swapData);
      console.log('Selected user:', selectedUser);
      
      if (!selectedUser?._id) {
        throw new Error('No target user selected');
      }
      
      if (!user?._id) {
        throw new Error('User not authenticated');
      }
      
      // Check if current user has skills to offer
      if (!user.skillsOffered || user.skillsOffered.length === 0) {
        throw new Error('You need to add skills to your profile before sending swap requests. Please update your profile first.');
      }
      
      // Check if target user has skills to offer
      if (!selectedUser.skillsOffered || selectedUser.skillsOffered.length === 0) {
        throw new Error('This user has no skills to offer');
      }
      
      const requestData = {
        toUserId: selectedUser._id,
        requestedSkill: swapData.requestedSkill,
        offeredSkill: swapData.offeredSkill,
        message: swapData.message,
        proposedTime: swapData.proposedTime
      };
      
      console.log('Sending request to API:', requestData);
      
      const response = await apiService.createSwapRequest(requestData);
      console.log('API response:', response);
      
      // Close modal and show success
      setIsModalOpen(false);
      setSelectedUser(null);
      
      // Show success toast
      toast.success('Swap request sent successfully!', {
        description: 'Your request has been sent to the user.',
        duration: 4000,
      });
      
    } catch (error) {
      console.error('Error sending swap request:', error);
      
      // Show user-friendly error message
      let errorMessage = 'Failed to send swap request. ';
      
      if (error.message.includes('No target user selected')) {
        errorMessage += 'Please try again.';
      } else if (error.message.includes('User not authenticated')) {
        errorMessage += 'Please log in again.';
      } else if (error.message.includes('You need to add skills')) {
        errorMessage = error.message; // Use the full message for this case
      } else if (error.message.includes('This user has no skills')) {
        errorMessage = error.message; // Use the full message for this case
      } else if (error.response?.data?.message) {
        errorMessage += error.response.data.message;
      } else if (error.message) {
        errorMessage += error.message;
      } else {
        errorMessage += 'Please try again later.';
      }
      
      toast.error('Swap Request Failed', {
        description: errorMessage,
        duration: 6000,
      });
      throw error;
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSkill = !skillFilter || 
                        user.skillsOffered?.some(skill => 
                          skill.toLowerCase().includes(skillFilter.toLowerCase())
                        );
    return matchesSearch && matchesSkill;
  });

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

  return (
    <div className="min-h-screen bg-black text-gray-100 pt-20">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Browse Users</h1>
          <p className="text-gray-400">Find people to exchange skills with</p>
        </div>

        {/* Search and Filter */}
        <div className="mb-6 flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400"
            />
          </div>
          <div className="flex-1">
            <input
              type="text"
              placeholder="Filter by skill..."
              value={skillFilter}
              onChange={(e) => setSkillFilter(e.target.value)}
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400"
            />
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-4">
          <p className="text-gray-400">
            Found {filteredUsers.length} user{filteredUsers.length !== 1 ? 's' : ''}
          </p>
        </div>

        {/* Users Grid */}
        {filteredUsers.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 text-lg mb-2">No users found</div>
            <p className="text-gray-500">Try adjusting your search or filter criteria</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredUsers.map((user) => (
              <UserProfileCard
                key={user._id}
                user={user}
                onRequestSwap={handleRequestSwap}
              />
            ))}
          </div>
        )}

        {/* Swap Request Modal */}
        {isModalOpen && selectedUser && (
          <SwapRequestModal
            isOpen={isModalOpen}
            onClose={() => {
              setIsModalOpen(false);
              setSelectedUser(null);
            }}
            onSubmit={handleSubmitSwapRequest}
            targetUser={selectedUser}
            currentUser={user}
          />
        )}
      </div>
    </div>
  );
};

export default Browse;