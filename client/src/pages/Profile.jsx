import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { useAuth } from '../context/AuthContext';
import apiService from '../services/api';

const Profile = () => {
  const { user, updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  
  // Profile form state
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    location: user?.location || '',
    bio: user?.bio || '',
    isPublic: user?.isPublic ?? true
  });

  // Skills state
  const [skillsOffered, setSkillsOffered] = useState(user?.skillsOffered || []);
  const [skillsWanted, setSkillsWanted] = useState(user?.skillsWanted || []);
  const [newSkillOffered, setNewSkillOffered] = useState('');
  const [newSkillWanted, setNewSkillWanted] = useState('');

  // Availability state
  const [availability, setAvailability] = useState(user?.availability || {
    monday: { morning: false, afternoon: false, evening: false },
    tuesday: { morning: false, afternoon: false, evening: false },
    wednesday: { morning: false, afternoon: false, evening: false },
    thursday: { morning: false, afternoon: false, evening: false },
    friday: { morning: false, afternoon: false, evening: false },
    saturday: { morning: false, afternoon: false, evening: false },
    sunday: { morning: false, afternoon: false, evening: false }
  });

  // Update form data when user changes
  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name || '',
        email: user.email || '',
        location: user.location || '',
        bio: user.bio || '',
        isPublic: user.isPublic ?? true
      });
      setSkillsOffered(user.skillsOffered || []);
      setSkillsWanted(user.skillsWanted || []);
      setAvailability(user.availability || {
        monday: { morning: false, afternoon: false, evening: false },
        tuesday: { morning: false, afternoon: false, evening: false },
        wednesday: { morning: false, afternoon: false, evening: false },
        thursday: { morning: false, afternoon: false, evening: false },
        friday: { morning: false, afternoon: false, evening: false },
        saturday: { morning: false, afternoon: false, evening: false },
        sunday: { morning: false, afternoon: false, evening: false }
      });
    }
  }, [user]);

  const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
  const timeSlots = ['morning', 'afternoon', 'evening'];

  // Add skill offered
  const addSkillOffered = () => {
    if (newSkillOffered.trim() && !skillsOffered.includes(newSkillOffered.trim())) {
      setSkillsOffered([...skillsOffered, newSkillOffered.trim()]);
      setNewSkillOffered('');
    }
  };

  // Remove skill offered
  const removeSkillOffered = (skill) => {
    setSkillsOffered(skillsOffered.filter(s => s !== skill));
  };

  // Add skill wanted
  const addSkillWanted = () => {
    if (newSkillWanted.trim() && !skillsWanted.includes(newSkillWanted.trim())) {
      setSkillsWanted([...skillsWanted, newSkillWanted.trim()]);
      setNewSkillWanted('');
    }
  };

  // Remove skill wanted
  const removeSkillWanted = (skill) => {
    setSkillsWanted(skillsWanted.filter(s => s !== skill));
  };

  // Toggle availability
  const toggleAvailability = (day, timeSlot) => {
    setAvailability(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        [timeSlot]: !prev[day][timeSlot]
      }
    }));
  };

  // Save profile
  const saveProfile = async () => {
    setIsLoading(true);
    try {
      // Validate required fields
      if (!profileData.name || profileData.name.trim() === '') {
        toast.error('Name is required', {
          description: 'Please enter your full name before saving.',
          duration: 4000,
        });
        return;
      }

      const requestData = {
        name: profileData.name.trim(),
        location: profileData.location?.trim() || '',
        bio: profileData.bio?.trim() || '',
        isPublic: profileData.isPublic,
        skillsOffered,
        skillsWanted,
        availability
      };
      
      console.log('Sending profile update request:', requestData);
      
      const response = await apiService.updateProfile(requestData);
      
      // Update local state with the response from the server
      updateUser(response.user);
      setIsEditing(false);
      
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
    } finally {
      setIsLoading(false);
    }
  };

  // Cancel editing
  const cancelEditing = () => {
    setProfileData({
      name: user?.name || '',
      email: user?.email || '',
      location: user?.location || '',
      bio: user?.bio || '',
      isPublic: user?.isPublic ?? true
    });
    setSkillsOffered(user?.skillsOffered || []);
    setSkillsWanted(user?.skillsWanted || []);
    setAvailability(user?.availability || {
      monday: { morning: false, afternoon: false, evening: false },
      tuesday: { morning: false, afternoon: false, evening: false },
      wednesday: { morning: false, afternoon: false, evening: false },
      thursday: { morning: false, afternoon: false, evening: false },
      friday: { morning: false, afternoon: false, evening: false },
      saturday: { morning: false, afternoon: false, evening: false },
      sunday: { morning: false, afternoon: false, evening: false }
    });
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen bg-black text-gray-100 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2 text-white">Profile Settings</h1>
          <p className="text-gray-400">Manage your profile, skills, and availability</p>
        </div>

        {/* Tabs */}
        <div className="tabs tabs-boxed bg-black/40 backdrop-blur-lg border border-cyan-500/20 mb-6">
          <button 
            className={`tab ${activeTab === 'profile' ? 'tab-active' : ''}`}
            onClick={() => setActiveTab('profile')}
          >
            Profile Info
          </button>
          <button 
            className={`tab ${activeTab === 'skills' ? 'tab-active' : ''}`}
            onClick={() => setActiveTab('skills')}
          >
            Skills
          </button>
          <button 
            className={`tab ${activeTab === 'availability' ? 'tab-active' : ''}`}
            onClick={() => setActiveTab('availability')}
          >
            Availability
          </button>
        </div>

        {/* Profile Info Tab */}
        {activeTab === 'profile' && (
          <div className="card bg-black/40 backdrop-blur-lg border border-cyan-500/20 shadow-[0_0_50px_-12px_rgba(0,255,255,0.25)]">
            <div className="card-body">
              <h2 className="card-title mb-6">Profile Information</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="label">
                    <span className="label-text">Full Name</span>
                  </label>
                  <input
                    type="text"
                    value={profileData.name}
                    onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                    disabled={!isEditing}
                    className="input input-bordered w-full bg-white/5 border-cyan-500/20 text-white placeholder-white/50 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
                    placeholder="Enter your full name"
                  />
                </div>

                <div>
                  <label className="label">
                    <span className="label-text">Email</span>
                  </label>
                  <input
                    type="email"
                    value={profileData.email}
                    disabled
                    className="input input-bordered w-full bg-gray-700/50 border-cyan-500/20 text-white"
                    placeholder="Your email"
                  />
                </div>

                <div>
                  <label className="label">
                    <span className="label-text">Location</span>
                  </label>
                  <input
                    type="text"
                    value={profileData.location}
                    onChange={(e) => setProfileData({...profileData, location: e.target.value})}
                    disabled={!isEditing}
                    className="input input-bordered w-full bg-white/5 border-cyan-500/20 text-white placeholder-white/50 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
                    placeholder="Enter your location"
                  />
                </div>

                <div>
                  <label className="label">
                    <span className="label-text">Profile Visibility</span>
                  </label>
                  <select
                    value={profileData.isPublic ? 'public' : 'private'}
                    onChange={(e) => setProfileData({...profileData, isPublic: e.target.value === 'public'})}
                    disabled={!isEditing}
                    className="select select-bordered w-full bg-white/5 border-cyan-500/20 text-white focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
                  >
                    <option value="public">Public</option>
                    <option value="private">Private</option>
                  </select>
                </div>
              </div>

              <div className="mt-6">
                <label className="label">
                  <span className="label-text">Bio</span>
                </label>
                <textarea
                  value={profileData.bio}
                  onChange={(e) => setProfileData({...profileData, bio: e.target.value})}
                  disabled={!isEditing}
                  className="textarea textarea-bordered w-full h-32 bg-white/5 border-cyan-500/20 text-white placeholder-white/50 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
                  placeholder="Tell others about yourself and your skills..."
                />
              </div>

              <div className="card-actions justify-end mt-6">
                {!isEditing ? (
                  <button 
                    className="btn bg-gradient-to-r from-cyan-500 to-cyan-600 text-white border-0 hover:shadow-cyan-500/20"
                    onClick={() => setIsEditing(true)}
                  >
                    Edit Profile
                  </button>
                ) : (
                  <div className="flex gap-2">
                    <button 
                      className="btn btn-outline border-cyan-500/20 text-cyan-400 hover:bg-cyan-500/10"
                      onClick={cancelEditing}
                    >
                      Cancel
                    </button>
                    <button 
                      className="btn bg-gradient-to-r from-cyan-500 to-cyan-600 text-white border-0 hover:shadow-cyan-500/20"
                      onClick={saveProfile}
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <span className="loading loading-spinner loading-sm"></span>
                          Saving...
                        </>
                      ) : (
                        'Save Changes'
                      )}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Skills Tab */}
        {activeTab === 'skills' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Skills Offered */}
            <div className="card bg-black/40 backdrop-blur-lg border border-cyan-500/20 shadow-[0_0_50px_-12px_rgba(0,255,255,0.25)]">
              <div className="card-body">
                <h2 className="card-title mb-6">Skills I Can Offer</h2>
                
                <div className="flex gap-2 mb-4">
                  <input
                    type="text"
                    value={newSkillOffered}
                    onChange={(e) => setNewSkillOffered(e.target.value)}
                    className="input input-bordered flex-1 bg-white/5 border-cyan-500/20 text-white placeholder-white/50 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
                    placeholder="Add a skill (e.g., Photoshop, Excel)"
                    onKeyPress={(e) => e.key === 'Enter' && addSkillOffered()}
                  />
                  <button 
                    className="btn bg-gradient-to-r from-cyan-500 to-cyan-600 text-white border-0 hover:shadow-cyan-500/20"
                    onClick={addSkillOffered}
                  >
                    Add
                  </button>
                </div>

                <div className="space-y-2">
                  {skillsOffered.map((skill, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-white/5 border border-cyan-500/20 rounded-lg">
                      <span>{skill}</span>
                      <button 
                        className="btn btn-sm btn-error"
                        onClick={() => removeSkillOffered(skill)}
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                  {skillsOffered.length === 0 && (
                    <p className="text-gray-400 text-center py-4">No skills added yet</p>
                  )}
                </div>
              </div>
            </div>

            {/* Skills Wanted */}
            <div className="card bg-black/40 backdrop-blur-lg border border-cyan-500/20 shadow-[0_0_50px_-12px_rgba(0,255,255,0.25)]">
              <div className="card-body">
                <h2 className="card-title mb-6">Skills I Want to Learn</h2>
                
                <div className="flex gap-2 mb-4">
                  <input
                    type="text"
                    value={newSkillWanted}
                    onChange={(e) => setNewSkillWanted(e.target.value)}
                    className="input input-bordered flex-1 bg-white/5 border-cyan-500/20 text-white placeholder-white/50 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
                    placeholder="Add a skill (e.g., Guitar, Cooking)"
                    onKeyPress={(e) => e.key === 'Enter' && addSkillWanted()}
                  />
                  <button 
                    className="btn bg-gradient-to-r from-cyan-500 to-cyan-600 text-white border-0 hover:shadow-cyan-500/20"
                    onClick={addSkillWanted}
                  >
                    Add
                  </button>
                </div>

                <div className="space-y-2">
                  {skillsWanted.map((skill, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-white/5 border border-cyan-500/20 rounded-lg">
                      <span>{skill}</span>
                      <button 
                        className="btn btn-sm btn-error"
                        onClick={() => removeSkillWanted(skill)}
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                  {skillsWanted.length === 0 && (
                    <p className="text-gray-400 text-center py-4">No skills wanted yet</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Availability Tab */}
        {activeTab === 'availability' && (
          <div className="card bg-black/40 backdrop-blur-lg border border-cyan-500/20 shadow-[0_0_50px_-12px_rgba(0,255,255,0.25)]">
            <div className="card-body">
              <h2 className="card-title mb-6">Availability Schedule</h2>
              <p className="text-gray-400 mb-6">Select the times when you're available for skill swaps</p>
              
              <div className="overflow-x-auto">
                <table className="table w-full">
                  <thead>
                    <tr>
                      <th className="bg-white/5 border border-cyan-500/20">Day</th>
                      <th className="bg-white/5 border border-cyan-500/20">Morning</th>
                      <th className="bg-white/5 border border-cyan-500/20">Afternoon</th>
                      <th className="bg-white/5 border border-cyan-500/20">Evening</th>
                    </tr>
                  </thead>
                  <tbody>
                    {days.map((day) => (
                      <tr key={day} className="hover:bg-white/5">
                        <td className="font-medium capitalize">{day}</td>
                        {timeSlots.map((timeSlot) => (
                          <td key={timeSlot}>
                            <input
                              type="checkbox"
                              className="toggle toggle-primary"
                              checked={availability[day][timeSlot]}
                              onChange={() => toggleAvailability(day, timeSlot)}
                            />
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="card-actions justify-end mt-6">
                <button 
                  className="btn bg-gradient-to-r from-cyan-500 to-cyan-600 text-white border-0 hover:shadow-cyan-500/20"
                  onClick={saveProfile}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <span className="loading loading-spinner loading-sm"></span>
                      Saving...
                    </>
                  ) : (
                    'Save Availability'
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile; 