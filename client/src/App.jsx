import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Toaster } from 'sonner';
import { useState } from 'react';
import Home from './pages/Home';
import Browse from './pages/Browse';
import SwapRequests from './pages/SwapRequests';
import Profile from './pages/Profile';
import Login from './pages/Login';
import Register from './pages/Register';
import './App.css';

// Navigation items
const navItems = [
  { name: 'Home', href: '/' },
  { name: 'Browse', href: '/browse' },
  { name: 'Requests', href: '/requests' },
  { name: 'Profile', href: '/profile' }
];

function AppContent() {
  const { user, logout, isAuthenticated } = useAuth();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setIsProfileDropdownOpen(false);
    setIsOpen(false);
  };

  return (
    <div className="min-h-screen bg-black text-gray-100">
      {/* Modern Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 px-4 py-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center">
            {/* Combined Logo and Navigation for Desktop */}
            <div className="hidden md:flex items-center rounded-full backdrop-blur-md border border-cyan-500/20 px-6 py-2.5">
              {/* Logo */}
              <Link to="/" className="flex items-center mr-8">
                <span className="text-xl font-bold hover:scale-105 transform">
                  <span className="text-cyan-400">Skill</span>
                  <span className="text-white">Swap</span>
                </span>
              </Link>

              {/* Separator */}
              <div className="h-6 w-px bg-white/20 mr-8" />

              {/* Navigation Items */}
              <div className="flex items-center space-x-1">
                {navItems.slice(1).map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`px-4 py-2 text-base text-white hover:bg-white/20 hover:text-cyan-400 rounded-full transition-all ${
                      location.pathname === item.href ? "bg-white/20 text-cyan-400" : ""
                    }`}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>

              {/* Separator */}
              <div className="h-6 w-px bg-white/20 mx-4" />

              {/* Auth Buttons */}
              {isAuthenticated ? (
                <div className="relative">
                  <button
                    onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                    className="p-2 rounded-full bg-white/10 backdrop-blur-[12px] border border-white/20 text-white hover:bg-white/20 transition-all"
                  >
                    <div className="w-6 h-6 rounded-full bg-cyan-400 flex items-center justify-center text-black font-bold text-sm">
                      {user?.name?.charAt(0).toUpperCase() || 'U'}
                    </div>
                  </button>

                  {/* Profile Dropdown */}
                  {isProfileDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 rounded-lg bg-white/10 backdrop-blur-[12px] border border-white/20 shadow-lg">
                      <div className="p-4">
                        <p className="text-sm text-white/80 truncate">{user?.email}</p>
                        <Link
                          to="/profile"
                          className="block w-full mt-2 px-4 py-2 text-sm text-white hover:bg-white/20 rounded-full transition-all text-center"
                          onClick={() => setIsProfileDropdownOpen(false)}
                        >
                          Profile
                        </Link>
                        <button
                          onClick={handleLogout}
                          className="w-full mt-2 px-4 py-2 text-sm bg-white text-black rounded-full hover:bg-white/90 transition-all font-medium"
                        >
                          Logout
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center space-x-3">
                  <Link
                    to="/login"
                    className="px-4 py-2 text-base text-white hover:bg-white/20 hover:text-cyan-400 rounded-full transition-all"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/register"
                    className="px-4 py-2 text-base bg-white text-black rounded-full hover:bg-cyan-400 transition-all font-medium hover:scale-105 transform"
                  >
                    Get Started
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile Layout */}
            <div className="md:hidden flex items-center justify-between w-full">
              {/* Logo for Mobile */}
              <Link to="/" className="flex items-center">
                <span className="text-2xl font-bold hover:scale-105 transform">
                  <span className="text-cyan-400">Skill</span>
                  <span className="text-white">Swap</span>
                </span>
              </Link>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 rounded-full bg-white/10 backdrop-blur-[12px] border border-white/20 text-white hover:bg-white/20 transition-all"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>

          {/* Mobile Navigation Menu */}
          {isOpen && (
            <div className="md:hidden absolute right-4 top-full rounded-2xl bg-white/10 backdrop-blur-[12px] border border-white/20 shadow-lg w-max max-w-xs">
              <div className="py-2 px-4">
                {navItems.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    className="block px-4 py-2 text-sm text-white hover:bg-white/20 text-center"
                    onClick={() => setIsOpen(false)}
                  >
                    {item.name}
                  </Link>
                ))}
                <div className="px-4 py-2 flex flex-col space-y-2 border-t border-white/20 mt-2">
                  {isAuthenticated ? (
                    <>
                      <p className="px-4 py-2 text-sm text-white/80 truncate">{user?.email}</p>
                      <button
                        onClick={handleLogout}
                        className="py-2 text-sm bg-white text-black rounded-full hover:bg-white/90 transition-all font-medium"
                      >
                        Logout
                      </button>
                    </>
                  ) : (
                    <>
                      <Link
                        to="/login"
                        className="py-2 text-sm text-white hover:bg-white/20 rounded-full transition-all text-center"
                        onClick={() => setIsOpen(false)}
                      >
                        Sign In
                      </Link>
                      <Link
                        to="/register"
                        className="py-2 text-sm text-white rounded-full hover:bg-white/90 transition-all font-medium text-center"
                        onClick={() => setIsOpen(false)}
                      >
                        Get Started
                      </Link>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Main Content with top padding for fixed navbar */}
      <main className="pt-20 min-h-screen bg-black">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/browse" element={<Browse />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/requests" element={<SwapRequests />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </main>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
        <Toaster 
          position="top-right"
          richColors
          closeButton
          theme="dark"
        />
      </AuthProvider>
    </Router>
  );
}

export default App;