import React, { useState } from 'react';

const UserProfileCard = ({ user, onRequestSwap }) => {
  const [showDetails, setShowDetails] = useState(false);

  const getAvailabilityText = () => {
    const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
    const availableDays = days.filter(day => 
      Object.values(user.availability[day]).some(slot => slot)
    );
    
    if (availableDays.length === 0) return 'No availability set';
    if (availableDays.length <= 2) return availableDays.map(day => day.charAt(0).toUpperCase() + day.slice(1)).join(', ');
    return `${availableDays.length} days available`;
  };

  const getSkillCount = (skills) => {
    return skills ? skills.length : 0;
  };

  return (
    <div className="card bg-black/40 backdrop-blur-lg border border-cyan-500/20 shadow-[0_0_50px_-12px_rgba(0,255,255,0.25)] hover:shadow-[0_0_50px_-12px_rgba(0,255,255,0.4)] hover:border-cyan-500/40 transition-all duration-300">
      <div className="card-body">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="avatar placeholder">
              <div className="bg-gradient-to-r from-cyan-500 to-cyan-600 text-white rounded-full w-12 border border-cyan-400/30">
                <span className="text-lg font-bold">
                  {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                </span>
              </div>
            </div>
            <div>
              <h3 className="font-bold text-lg text-white">{user.name}</h3>
              <p className="text-gray-400 text-sm">{user.location || 'Location not set'}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="badge bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">{getSkillCount(user.skillsOffered)} skills offered</div>
            <div className="badge bg-purple-500/20 text-purple-400 border border-purple-500/30">{getSkillCount(user.skillsWanted)} skills wanted</div>
          </div>
        </div>

        {/* Bio */}
        {user.bio && (
          <p className="text-gray-300 mb-4 line-clamp-2">{user.bio}</p>
        )}

        {/* Skills Preview */}
        <div className="mb-4">
          <div className="flex flex-wrap gap-2 mb-2">
            <span className="text-sm font-medium text-gray-400">Offers:</span>
            {user.skillsOffered && user.skillsOffered.slice(0, 3).map((skill, index) => (
              <span key={index} className="badge badge-outline badge-sm">{skill}</span>
            ))}
            {user.skillsOffered && user.skillsOffered.length > 3 && (
              <span className="badge badge-outline badge-sm">+{user.skillsOffered.length - 3} more</span>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            <span className="text-sm font-medium text-gray-400">Wants:</span>
            {user.skillsWanted && user.skillsWanted.slice(0, 3).map((skill, index) => (
              <span key={index} className="badge badge-outline badge-sm">{skill}</span>
            ))}
            {user.skillsWanted && user.skillsWanted.length > 3 && (
              <span className="badge badge-outline badge-sm">+{user.skillsWanted.length - 3} more</span>
            )}
          </div>
        </div>

        {/* Availability */}
        <div className="mb-4">
          <p className="text-sm text-gray-400 mb-1">Availability:</p>
          <p className="text-sm">{getAvailabilityText()}</p>
        </div>

        {/* Rating */}
        <div className="flex items-center gap-2 mb-4">
          <div className="rating rating-sm">
            {[1, 2, 3, 4, 5].map((star) => (
              <input
                key={star}
                type="radio"
                name={`rating-${user.id}`}
                className="mask mask-star-2 bg-orange-400"
                checked={star <= (user.rating || 0)}
                readOnly
              />
            ))}
          </div>
          <span className="text-sm text-gray-400">
            {user.rating ? `${user.rating}/5` : 'No ratings'} • {user.swapCount || 0} swaps
          </span>
        </div>

        {/* Actions */}
        <div className="card-actions justify-between">
          <button 
            className="btn btn-outline btn-sm border-cyan-500/20 text-cyan-400 hover:bg-cyan-500/10"
            onClick={() => setShowDetails(!showDetails)}
          >
            {showDetails ? 'Hide Details' : 'Show Details'}
          </button>
          <button 
            className="btn bg-gradient-to-r from-cyan-500 to-cyan-600 text-white border-0 hover:shadow-cyan-500/20 btn-sm"
            onClick={() => onRequestSwap(user)}
          >
            Request Swap
          </button>
        </div>

        {/* Expanded Details */}
        {showDetails && (
          <div className="mt-4 pt-4 border-t border-gray-700">
            {/* All Skills */}
            <div className="mb-4">
              <h4 className="font-medium mb-2">All Skills Offered:</h4>
              <div className="flex flex-wrap gap-2">
                {user.skillsOffered && user.skillsOffered.length > 0 ? (
                  user.skillsOffered.map((skill, index) => (
                    <span key={index} className="badge badge-primary badge-sm">{skill}</span>
                  ))
                ) : (
                  <span className="text-gray-400 text-sm">No skills offered</span>
                )}
              </div>
            </div>

            <div className="mb-4">
              <h4 className="font-medium mb-2">All Skills Wanted:</h4>
              <div className="flex flex-wrap gap-2">
                {user.skillsWanted && user.skillsWanted.length > 0 ? (
                  user.skillsWanted.map((skill, index) => (
                    <span key={index} className="badge badge-secondary badge-sm">{skill}</span>
                  ))
                ) : (
                  <span className="text-gray-400 text-sm">No skills wanted</span>
                )}
              </div>
            </div>

            {/* Detailed Availability */}
            <div>
              <h4 className="font-medium mb-2">Detailed Availability:</h4>
              <div className="grid grid-cols-7 gap-1 text-xs">
                {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, index) => (
                  <div key={index} className="text-center">
                    <div className="font-medium mb-1">{day}</div>
                    <div className="space-y-1">
                      {['morning', 'afternoon', 'evening'].map((timeSlot) => (
                        <div
                          key={timeSlot}
                          className={`w-4 h-4 mx-auto rounded ${
                            user.availability[Object.keys(user.availability)[index]]?.[timeSlot]
                              ? 'bg-green-500'
                              : 'bg-gray-600'
                          }`}
                          title={`${day} ${timeSlot}`}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex justify-center gap-4 mt-2 text-xs text-gray-400">
                <span>Morning</span>
                <span>Afternoon</span>
                <span>Evening</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfileCard; 