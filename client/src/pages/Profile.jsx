import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { useAuth } from '../context/AuthContext';
import apiService from '../services/api';
import ProfileModal from '../components/ProfileModal';

const Profile = () => {
  const { user, updateUser } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  // Profile data state
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    location: user?.location || '',
    bio: user?.bio || '',
    isPublic: user?.isPublic ?? true,
    skillsOffered: user?.skillsOffered || [],
    skillsWanted: user?.skillsWanted || [],
    availability: user?.availability || {
      monday: { morning: false, afternoon: false, evening: false },
      tuesday: { morning: false, afternoon: false, evening: false },
      wednesday: { morning: false, afternoon: false, evening: false },
      thursday: { morning: false, afternoon: false, evening: false },
      friday: { morning: false, afternoon: false, evening: false },
      saturday: { morning: false, afternoon: false, evening: false },
      sunday: { morning: false, afternoon: false, evening: false }
    }
  });

  // Update profile data when user changes
  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name || '',
        location: user.location || '',
        bio: user.bio || '',
        isPublic: user.isPublic ?? true,
        skillsOffered: user.skillsOffered || [],
        skillsWanted: user.skillsWanted || [],
        availability: user.availability || {
          monday: { morning: false, afternoon: false, evening: false },
          tuesday: { morning: false, afternoon: false, evening: false },
          wednesday: { morning: false, afternoon: false, evening: false },
          thursday: { morning: false, afternoon: false, evening: false },
          friday: { morning: false, afternoon: false, evening: false },
          saturday: { morning: false, afternoon: false, evening: false },
          sunday: { morning: false, afternoon: false, evening: false }
        }
      });
    }
  }, [user]);

  // Save profile
  const saveProfile = async (updatedData) => {
    setIsLoading(true);
    try {
      const response = await apiService.updateProfile(updatedData);
      
      // Update local state with the response from the server
      updateUser(response.user);
      
      toast.success('Profile updated successfully!', {
        description: 'Your profile has been saved to the database.',
        duration: 4000,
      });
    } catch (error) {
      console.error('Error saving profile:', error);
      toast.error('Failed to save profile', {
        description: error.message || 'Please try again later.',
        duration: 4000,
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const getAvailabilityText = () => {
    const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
    const availableDays = days.filter(day => 
      Object.values(profileData.availability[day]).some(slot => slot)
    );
    
    if (availableDays.length === 0) return 'No availability set';
    if (availableDays.length <= 2) return availableDays.map(day => day.charAt(0).toUpperCase() + day.slice(1)).join(', ');
    return `${availableDays.length} days available`;
  };

  const getSkillCount = (skills) => {
    return skills ? skills.length : 0;
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">My Profile</h1>
          <p className="text-gray-400">Manage your profile and preferences</p>
        </div>

        {/* Profile Card */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-br from-gray-900/80 to-gray-800/80 backdrop-blur-xl border border-cyan-500/30 rounded-2xl p-8 shadow-[0_8px_32px_rgba(0,255,255,0.1)]">
            {/* Profile Header */}
            <div className="flex items-start justify-between mb-8">
              <div className="flex items-center gap-6">
                <div className="relative">
                  <div className="w-24 h-24 bg-gradient-to-br from-cyan-400 to-cyan-600 rounded-full flex items-center justify-center text-white font-bold text-3xl shadow-lg shadow-cyan-500/25">
                    {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-gray-900"></div>
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-white mb-2">{user.name}</h2>
                  <p className="text-gray-400 text-lg flex items-center gap-2">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                    </svg>
                    {user.location || 'Location not set'}
                  </p>
                  <div className="flex items-center gap-4 mt-2">
                    <div className="rating rating-sm">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <input
                          key={star}
                          type="radio"
                          name="user-rating"
                          className="mask mask-star-2 bg-orange-400"
                          checked={star <= (user.rating || 0)}
                          readOnly
                        />
                      ))}
                    </div>
                    <span className="text-gray-300">
                      {user.rating ? `${user.rating.toFixed(1)}/5` : 'No ratings'}
                    </span>
                    <span className="text-gray-400">•</span>
                    <span className="text-gray-300">{user.swapCount || 0} swaps</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setShowEditModal(true)}
                className="btn bg-gradient-to-r from-cyan-500 to-cyan-600 text-white border-0 hover:from-cyan-600 hover:to-cyan-700 shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 transition-all duration-300 rounded-xl font-semibold px-6"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Edit Profile
              </button>
            </div>

            {/* Bio */}
            {user.bio && (
              <div className="mb-8 p-6 bg-gray-800/50 rounded-xl border border-gray-700/50">
                <h3 className="font-semibold text-white mb-3 flex items-center gap-2">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
                  </svg>
                  About Me
                </h3>
                <p className="text-gray-300 leading-relaxed">{user.bio}</p>
              </div>
            )}

            {/* Skills Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              {/* Skills Offered */}
              <div className="p-6 bg-gradient-to-r from-cyan-500/10 to-cyan-600/10 rounded-xl border border-cyan-500/30">
                <h3 className="font-semibold text-cyan-400 mb-4 flex items-center gap-2">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Skills I Can Teach ({getSkillCount(user.skillsOffered)})
                </h3>
                <div className="flex flex-wrap gap-2">
                  {user.skillsOffered && user.skillsOffered.length > 0 ? (
                    user.skillsOffered.map((skill, index) => (
                      <span key={index} className="badge bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 px-3 py-2 rounded-lg font-medium">
                        {skill}
                      </span>
                    ))
                  ) : (
                    <p className="text-gray-400 text-sm">No skills added yet</p>
                  )}
                </div>
              </div>

              {/* Skills Wanted */}
              <div className="p-6 bg-gradient-to-r from-purple-500/10 to-purple-600/10 rounded-xl border border-purple-500/30">
                <h3 className="font-semibold text-purple-400 mb-4 flex items-center gap-2">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" />
                  </svg>
                  Skills I Want to Learn ({getSkillCount(user.skillsWanted)})
                </h3>
                <div className="flex flex-wrap gap-2">
                  {user.skillsWanted && user.skillsWanted.length > 0 ? (
                    user.skillsWanted.map((skill, index) => (
                      <span key={index} className="badge bg-purple-500/20 text-purple-300 border border-purple-500/30 px-3 py-2 rounded-lg font-medium">
                        {skill}
                      </span>
                    ))
                  ) : (
                    <p className="text-gray-400 text-sm">No skills added yet</p>
                  )}
                </div>
              </div>
            </div>

            {/* Availability Section */}
            <div className="p-6 bg-gray-800/30 rounded-xl border border-gray-700/30">
              <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                </svg>
                Availability
              </h3>
              <p className="text-gray-300 mb-4">{getAvailabilityText()}</p>
              
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
                    {Object.entries(profileData.availability).map(([day, timeSlots]) => (
                      <tr key={day} className="hover:bg-gray-700/50">
                        <td className="font-medium text-white capitalize">{day}</td>
                        {Object.entries(timeSlots).map(([timeSlot, isAvailable]) => (
                          <td key={timeSlot} className="text-center">
                            <div className={`w-5 h-5 mx-auto rounded-md ${
                              isAvailable
                                ? 'bg-gradient-to-br from-green-400 to-green-600 shadow-lg shadow-green-500/25'
                                : 'bg-gray-700 border border-gray-600'
                            }`} />
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Profile Status */}
            <div className="mt-8 p-4 bg-gray-800/30 rounded-xl border border-gray-700/30">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${user.isPublic ? 'bg-green-500' : 'bg-red-500'}`}></div>
                  <span className="text-gray-300">
                    Profile is {user.isPublic ? 'public' : 'private'}
                  </span>
                </div>
                <span className="text-sm text-gray-400">
                  Member since {new Date(user.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Modal */}
        <ProfileModal
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
          onSubmit={saveProfile}
          profileData={profileData}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
};

export default Profile; 