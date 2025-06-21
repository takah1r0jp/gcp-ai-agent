import { useAuth } from '../contexts/AuthContext';
import { LogOut, User } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('ログアウトエラー:', error);
    }
  };

  const handleProfileClick = () => {
    navigate('/profile');
  };

  const handleHomeClick = () => {
    navigate('/');
  };

  if (!user) return null;

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center">
            <button
              onClick={handleHomeClick}
              className="text-xl font-semibold text-gray-900 hover:text-blue-600 transition-colors"
            >
              目標管理アプリ
            </button>
          </div>
          
          <div className="flex items-center space-x-4">
            <button
              onClick={handleProfileClick}
              className={`flex items-center space-x-2 px-3 py-2 text-sm rounded-md transition-colors ${
                location.pathname === '/profile'
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              <User className="h-4 w-4" />
              <span>{user.displayName || user.email}</span>
            </button>
            
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
            >
              <LogOut className="h-4 w-4" />
              <span>ログアウト</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;