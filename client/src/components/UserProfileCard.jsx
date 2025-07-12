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
      <div className="group relative bg-gradient-to-br from-gray-900/80 to-gray-800/80 backdrop-blur-xl border border-cyan-500/30 rounded-2xl p-6 shadow-[0_8px_32px_rgba(0,255,255,0.1)] hover:shadow-[0_8px_32px_rgba(0,255,255,0.2)] hover:border-cyan-400/50 transition-all duration-500 hover:scale-[1.02] overflow-hidden">
        {/* Animated background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-transparent to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        
        {/* Glow effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        
        <div className="relative z-10">
          {/* Header */}
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-14 h-14 bg-gradient-to-br from-cyan-400 to-cyan-600 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-cyan-500/25">
                  {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                </div>
                {/* Status indicator */}
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-gray-900"></div>
              </div>
              <div>
                <h3 className="font-bold text-xl text-white mb-1 group-hover:text-cyan-300 transition-colors duration-300">
                  {user.name}
                </h3>
                <p className="text-gray-400 text-sm flex items-center gap-2">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                  </svg>
                  {user.location || 'Location not set'}
                </p>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <div className="badge bg-gradient-to-r from-cyan-500/20 to-cyan-600/20 text-cyan-300 border border-cyan-500/30 px-3 py-1 rounded-full text-xs font-medium">
                {getSkillCount(user.skillsOffered)} skills offered
              </div>
              <div className="badge bg-gradient-to-r from-purple-500/20 to-purple-600/20 text-purple-300 border border-purple-500/30 px-3 py-1 rounded-full text-xs font-medium">
                {getSkillCount(user.skillsWanted)} skills wanted
              </div>
            </div>
          </div>

          {/* Bio */}
          {user.bio && (
            <div className="mb-6 p-4 bg-gray-800/50 rounded-xl border border-gray-700/50">
              <p className="text-gray-300 text-sm leading-relaxed line-clamp-2">{user.bio}</p>
            </div>
          )}

          {/* Skills Preview */}
          <div className="mb-6">
            <div className="flex flex-wrap gap-2 mb-3">
              <span className="text-sm font-semibold text-cyan-400 flex items-center gap-1">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Offers:
              </span>
              {user.skillsOffered && user.skillsOffered.slice(0, 3).map((skill, index) => (
                <span key={index} className="badge bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 px-2 py-1 rounded-lg text-xs font-medium">
                  {skill}
                </span>
              ))}
              {user.skillsOffered && user.skillsOffered.length > 3 && (
                <span className="badge bg-gray-700/50 text-gray-300 border border-gray-600/30 px-2 py-1 rounded-lg text-xs">
                  +{user.skillsOffered.length - 3} more
                </span>
              )}
            </div>
            <div className="flex flex-wrap gap-2">
              <span className="text-sm font-semibold text-purple-400 flex items-center gap-1">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" />
                </svg>
                Wants:
              </span>
              {user.skillsWanted && user.skillsWanted.slice(0, 3).map((skill, index) => (
                <span key={index} className="badge bg-purple-500/20 text-purple-300 border border-purple-500/30 px-2 py-1 rounded-lg text-xs font-medium">
                  {skill}
                </span>
              ))}
              {user.skillsWanted && user.skillsWanted.length > 3 && (
                <span className="badge bg-gray-700/50 text-gray-300 border border-gray-600/30 px-2 py-1 rounded-lg text-xs">
                  +{user.skillsWanted.length - 3} more
                </span>
              )}
            </div>
          </div>

          {/* Availability */}
          <div className="mb-6 p-4 bg-gray-800/30 rounded-xl border border-gray-700/30">
            <p className="text-sm text-gray-400 mb-2 flex items-center gap-2">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
              </svg>
              Availability:
            </p>
            <p className="text-sm text-gray-300 font-medium">{getAvailabilityText()}</p>
          </div>

          {/* Rating */}
          <div className="flex items-center gap-3 mb-6 p-4 bg-gray-800/30 rounded-xl border border-gray-700/30">
            <div className="rating rating-sm">
              {[1, 2, 3, 4, 5].map((star) => (
                <input
                  key={star}
                  type="radio"
                  name={`rating-${user._id}`}
                  className="mask mask-star-2 bg-orange-400"
                  checked={star <= (user.rating || 0)}
                  readOnly
                />
              ))}
            </div>
            <div className="flex items-center gap-4 text-sm">
              <span className="text-gray-300">
                {user.rating ? `${user.rating.toFixed(1)}/5` : 'No ratings'}
              </span>
              <span className="text-gray-400">•</span>
              <span className="text-gray-300">{user.swapCount || 0} swaps</span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button 
              className="flex-1 btn btn-outline border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10 hover:border-cyan-400 transition-all duration-300 rounded-xl"
              onClick={() => setShowDetails(!showDetails)}
            >
              {showDetails ? 'Hide Details' : 'Show Details'}
            </button>
            <button 
              className="flex-1 btn bg-gradient-to-r from-cyan-500 to-cyan-600 text-white border-0 hover:from-cyan-600 hover:to-cyan-700 shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 transition-all duration-300 rounded-xl font-semibold"
              onClick={() => onRequestSwap(user)}
            >
              Request Swap
            </button>
          </div>

          {/* Expanded Details */}
          {showDetails && (
            <div className="mt-6 pt-6 border-t border-gray-700/50 space-y-6">
              {/* All Skills */}
              <div>
                <h4 className="font-semibold mb-3 text-cyan-400 flex items-center gap-2">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  All Skills Offered:
                </h4>
                <div className="flex flex-wrap gap-2">
                  {user.skillsOffered && user.skillsOffered.length > 0 ? (
                    user.skillsOffered.map((skill, index) => (
                      <span key={index} className="badge bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 px-3 py-2 rounded-lg font-medium">
                        {skill}
                      </span>
                    ))
                  ) : (
                    <span className="text-gray-400 text-sm">No skills offered</span>
                  )}
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-3 text-purple-400 flex items-center gap-2">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" />
                  </svg>
                  All Skills Wanted:
                </h4>
                <div className="flex flex-wrap gap-2">
                  {user.skillsWanted && user.skillsWanted.length > 0 ? (
                    user.skillsWanted.map((skill, index) => (
                      <span key={index} className="badge bg-purple-500/20 text-purple-300 border border-purple-500/30 px-3 py-2 rounded-lg font-medium">
                        {skill}
                      </span>
                    ))
                  ) : (
                    <span className="text-gray-400 text-sm">No skills wanted</span>
                  )}
                </div>
              </div>

              {/* Detailed Availability */}
              <div>
                <h4 className="font-semibold mb-3 text-gray-300 flex items-center gap-2">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                  </svg>
                  Detailed Availability:
                </h4>
                <div className="grid grid-cols-7 gap-2">
                  {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, index) => (
                    <div key={index} className="text-center">
                      <div className="font-semibold mb-2 text-gray-300">{day}</div>
                      <div className="space-y-1">
                        {['morning', 'afternoon', 'evening'].map((timeSlot) => (
                          <div
                            key={timeSlot}
                            className={`w-5 h-5 mx-auto rounded-md ${
                              user.availability[Object.keys(user.availability)[index]]?.[timeSlot]
                                ? 'bg-gradient-to-br from-green-400 to-green-600 shadow-lg shadow-green-500/25'
                                : 'bg-gray-700 border border-gray-600'
                            }`}
                            title={`${day} ${timeSlot}`}
                          />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex justify-center gap-6 mt-3 text-xs text-gray-400">
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