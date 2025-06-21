import { useAuth } from '../contexts/AuthContext';
import { LogOut, User, Target, Calendar, BarChart3, Plus, History } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

const AppHeader = ({ currentView, onViewChange, hasGoal, currentGoal }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

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

  const navigationItems = [
    {
      id: 'today',
      label: '今日のタスク',
      icon: Calendar,
      disabled: !hasGoal,
      description: hasGoal ? '今日のタスクを確認' : '目標を設定してください'
    },
    {
      id: 'plan',
      label: 'ロードマップ',
      icon: BarChart3,
      disabled: !hasGoal,
      description: hasGoal ? 'プラン全体を確認' : '目標を設定してください'
    },
    {
      id: 'history',
      label: '目標履歴',
      icon: History,
      disabled: false,
      description: '過去の目標から選択'
    },
    {
      id: 'input',
      label: hasGoal ? '新しい目標' : '目標設定',
      icon: hasGoal ? Plus : Target,
      disabled: false,
      description: hasGoal ? '新しい目標を設定' : '目標を設定してください'
    }
  ];

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* アプリタイトル */}
          <div className="flex items-center">
            <button
              onClick={handleHomeClick}
              className="text-xl font-semibold text-gray-900 hover:text-blue-600 transition-colors"
            >
              目標管理アプリ
            </button>
          </div>

          {/* 中央：ナビゲーション */}
          <nav className="hidden md:flex items-center space-x-1">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.id;
              const isDisabled = item.disabled;

              return (
                <button
                  key={item.id}
                  onClick={() => !isDisabled && onViewChange(item.id)}
                  disabled={isDisabled}
                  title={item.description}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-blue-100 text-blue-700'
                      : isDisabled
                      ? 'text-gray-400 cursor-not-allowed'
                      : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* モバイル版ナビゲーション */}
          <nav className="md:hidden flex items-center space-x-1">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.id;
              const isDisabled = item.disabled;

              return (
                <button
                  key={item.id}
                  onClick={() => !isDisabled && onViewChange(item.id)}
                  disabled={isDisabled}
                  title={item.description}
                  className={`flex items-center justify-center p-2 rounded-md transition-colors ${
                    isActive
                      ? 'bg-blue-100 text-blue-700'
                      : isDisabled
                      ? 'text-gray-400 cursor-not-allowed'
                      : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                </button>
              );
            })}
          </nav>

          {/* 右側：ユーザーメニュー */}
          <div className="flex items-center space-x-4">
            <button
              onClick={handleProfileClick}
              className="flex items-center space-x-2 px-3 py-2 text-sm rounded-md transition-colors text-gray-700 hover:text-gray-900 hover:bg-gray-100"
            >
              <User className="h-4 w-4" />
              <span className="hidden sm:inline">{user.displayName || user.email}</span>
            </button>
            
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">ログアウト</span>
            </button>
          </div>
        </div>

        {/* 現在の目標表示 */}
        {hasGoal && currentGoal && (
          <div className="pb-4 border-t border-gray-100 pt-3">
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Target className="h-4 w-4" />
              <span className="font-medium">現在の目標:</span>
              <span className="truncate max-w-md">{currentGoal}</span>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default AppHeader;