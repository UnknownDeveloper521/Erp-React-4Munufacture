import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  UserCircle,
  Settings,
  Key,
  LogOut,
  ChevronDown,
  Shield
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { userService } from '../services/userService';

const ProfileMenu = ({ onAction }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    loadUserProfile();
    checkAdminStatus();
  }, [user]);

  const loadUserProfile = async () => {
    if (user?.id) {
      try {
        const { data, error } = await userService.getUserById(user.id);
        if (!error && data) {
          setUserProfile(data);
        }
      } catch (error) {
        console.error('Error loading user profile:', error);
      }
    }
  };

  const checkAdminStatus = async () => {
    if (user) {
      try {
        const { isAdmin } = await userService.isCurrentUserAdmin();
        setIsAdmin(isAdmin);
      } catch (error) {
        console.error('Error checking admin status:', error);
      }
    }
  };

  const handleMouseEnter = () => {
    setActiveDropdown('profile');
  };

  const handleMouseLeave = () => {
    setActiveDropdown(null);
  };

  const handleAction = (action) => {
    setActiveDropdown(null);
    
    switch (action) {
      case 'logout':
        logout();
        break;
      case 'view-profile':
        navigate('/profile');
        break;
      case 'account-settings':
        navigate('/account-settings');
        break;
      case 'change-password':
        navigate('/change-password');
        break;
      default:
        if (onAction) {
          onAction(action);
        }
    }
  };

  // Get display name and email
  const displayName = userProfile?.first_name && userProfile?.last_name 
    ? `${userProfile.first_name} ${userProfile.last_name}`
    : userProfile?.full_name || user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User';
  
  const displayEmail = userProfile?.email || user?.email || 'No email';
  
  // Get user initials for avatar
  const getInitials = () => {
    if (userProfile?.first_name && userProfile?.last_name) {
      return `${userProfile.first_name[0]}${userProfile.last_name[0]}`.toUpperCase();
    }
    if (displayName && displayName !== 'User') {
      const nameParts = displayName.split(' ');
      if (nameParts.length >= 2) {
        return `${nameParts[0][0]}${nameParts[1][0]}`.toUpperCase();
      }
      return displayName[0].toUpperCase();
    }
    return displayEmail[0].toUpperCase();
  };

  const getUserRole = () => {
    if (isAdmin) return 'Administrator';
    if (userProfile?.role === 'hr') return 'HR Manager';
    if (userProfile?.role === 'employee') return 'Employee';
    return 'User';
  };

  return (
    <div 
      className="relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <button
        className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-white rounded-md hover:bg-gray-50 border border-gray-200"
      >
        <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold mr-2 text-xs">
          {getInitials()}
        </div>
        <div className="hidden md:block text-left mr-2">
          <div className="text-sm font-medium text-gray-900 truncate max-w-32">
            {displayName}
          </div>
          <div className="text-xs text-gray-500 flex items-center">
            {isAdmin && <Shield className="w-3 h-3 mr-1" />}
            {getUserRole()}
          </div>
        </div>
        <ChevronDown className="w-4 h-4 ml-1" />
      </button>
      
      {activeDropdown === 'profile' && (
        <div className="absolute right-0 top-full pt-2 w-72 z-50">
          <div className="bg-white border border-gray-200 rounded-md shadow-lg">
            <div className="py-1">
              {/* User Info Header */}
              <div className="px-4 py-3 border-b border-gray-100">
                <div className="flex items-center">
                  <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold mr-3">
                    {getInitials()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {displayName}
                      </p>
                      {isAdmin && (
                        <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">
                          <Shield className="w-3 h-3 mr-1" />
                          Admin
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 truncate">{displayEmail}</p>
                    <p className="text-xs text-gray-400">{getUserRole()}</p>
                  </div>
                </div>
              </div>

              {/* Menu Items */}
              <button
                onClick={() => handleAction('view-profile')}
                className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                <UserCircle className="w-4 h-4 mr-3" />
                View Profile
              </button>
              
              <button
                onClick={() => handleAction('account-settings')}
                className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                <Settings className="w-4 h-4 mr-3" />
                Account Settings
              </button>
              
              <button
                onClick={() => handleAction('change-password')}
                className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                <Key className="w-4 h-4 mr-3" />
                Change Password
              </button>
              
              <div className="border-t border-gray-100 my-1"></div>
              
              <button
                onClick={() => handleAction('logout')}
                className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
              >
                <LogOut className="w-4 h-4 mr-3" />
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileMenu;
