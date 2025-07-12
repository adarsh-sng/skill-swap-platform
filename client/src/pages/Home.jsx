import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const { isAuthenticated } = useAuth();

  return (
    <main className="h-[calc(100vh-5rem)] bg-black text-gray-100 p-4 overflow-hidden">
      <div className="h-full flex flex-col justify-center max-w-6xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-6">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">
            Welcome to <span className="text-cyan-400">SkillSwap</span>
          </h1>
          <p className="text-base text-gray-300 mb-4 max-w-2xl mx-auto">
            A community-driven platform to exchange skills, grow together, and connect with like-minded learners.
          </p>
          
          {!isAuthenticated ? (
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link 
                to="/register" 
                className="btn bg-gradient-to-r from-cyan-500 to-cyan-600 text-white font-semibold px-6 py-2 rounded-lg shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
              >
                Get Started
              </Link>
              <Link 
                to="/login" 
                className="btn btn-outline border-cyan-500/20 text-cyan-400 hover:bg-cyan-500/10 px-6 py-2 rounded-lg transition-all duration-200"
              >
                Sign In
              </Link>
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link 
                to="/browse" 
                className="btn bg-gradient-to-r from-cyan-500 to-cyan-600 text-white font-semibold px-6 py-2 rounded-lg shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
              >
                Browse Skills
              </Link>
              <Link 
                to="/profile" 
                className="btn btn-outline border-cyan-500/20 text-cyan-400 hover:bg-cyan-500/10 px-6 py-2 rounded-lg transition-all duration-200"
              >
                Manage Profile
              </Link>
            </div>
          )}
        </div>

        {/* Features Grid - Compact */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
          <div className="bg-gray-800 border border-cyan-500/20 rounded-lg p-3 hover:border-cyan-500/40 transition-all duration-300">
            <div className="text-cyan-400 text-xl mb-2">🎯</div>
            <h3 className="text-base font-semibold text-white mb-1">Skill Exchange</h3>
            <p className="text-gray-300 text-xs">
              Offer your expertise and learn new skills from others in a collaborative environment.
            </p>
          </div>

          <div className="bg-gray-800 border border-cyan-500/20 rounded-lg p-3 hover:border-cyan-500/40 transition-all duration-300">
            <div className="text-cyan-400 text-xl mb-2">🤝</div>
            <h3 className="text-base font-semibold text-white mb-1">Community Learning</h3>
            <p className="text-gray-300 text-xs">
              Connect with like-minded learners and build meaningful relationships through skill sharing.
            </p>
          </div>

          <div className="bg-gray-800 border border-cyan-500/20 rounded-lg p-3 hover:border-cyan-500/40 transition-all duration-300">
            <div className="text-cyan-400 text-xl mb-2">⚡</div>
            <h3 className="text-base font-semibold text-white mb-1">Flexible Scheduling</h3>
            <p className="text-gray-300 text-xs">
              Set your availability and find the perfect time to learn and teach with others.
            </p>
          </div>
        </div>

        {/* How it works - Compact */}
        <div>
          <h2 className="text-xl font-bold text-white text-center mb-3">How It Works</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            <div className="text-center">
              <div className="w-6 h-6 bg-cyan-500 rounded-full flex items-center justify-center text-white font-bold mx-auto mb-1 text-xs">1</div>
              <h4 className="font-semibold text-white mb-1 text-xs">Create Profile</h4>
              <p className="text-gray-400 text-xs">Set up your profile with skills.</p>
            </div>
            <div className="text-center">
              <div className="w-6 h-6 bg-cyan-500 rounded-full flex items-center justify-center text-white font-bold mx-auto mb-1 text-xs">2</div>
              <h4 className="font-semibold text-white mb-1 text-xs">Browse Users</h4>
              <p className="text-gray-400 text-xs">Find people with skills you want.</p>
            </div>
            <div className="text-center">
              <div className="w-6 h-6 bg-cyan-500 rounded-full flex items-center justify-center text-white font-bold mx-auto mb-1 text-xs">3</div>
              <h4 className="font-semibold text-white mb-1 text-xs">Request Swap</h4>
              <p className="text-gray-400 text-xs">Send a swap request.</p>
            </div>
            <div className="text-center">
              <div className="w-6 h-6 bg-cyan-500 rounded-full flex items-center justify-center text-white font-bold mx-auto mb-1 text-xs">4</div>
              <h4 className="font-semibold text-white mb-1 text-xs">Learn & Teach</h4>
              <p className="text-gray-400 text-xs">Exchange skills and leave feedback.</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Home; 