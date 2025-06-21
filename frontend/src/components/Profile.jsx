import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getUserProfile, getUserGoals } from '../services/firestore';
import { User, Target, Calendar, CheckCircle } from 'lucide-react';
import Header from './Header';

const Profile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalGoals: 0,
    activeGoals: 0,
    completedTasks: 0
  });

  useEffect(() => {
    const loadProfileData = async () => {
      if (!user) return;

      try {
        setLoading(true);
        
        // プロフィール情報を取得
        const userProfile = await getUserProfile(user.uid);
        setProfile(userProfile);
        
        // 目標履歴を取得
        const userGoals = await getUserGoals(user.uid);
        setGoals(userGoals);
        
        // 統計情報を計算
        const totalCompletedTasks = userGoals.reduce((total, goal) => {
          return total + (goal.completedTasks ? goal.completedTasks.length : 0);
        }, 0);
        
        setStats({
          totalGoals: userGoals.length,
          activeGoals: userGoals.filter(goal => goal.isActive).length,
          completedTasks: totalCompletedTasks
        });
        
      } catch (error) {
        console.error('プロフィールデータの読み込みエラー:', error);
      } finally {
        setLoading(false);
      }
    };

    loadProfileData();
  }, [user]);

  if (loading) {
    return (
      <>
        <Header />
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </>
    );
  }

  const formatDate = (timestamp) => {
    if (!timestamp) return '不明';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString('ja-JP');
  };

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* プロフィール情報 */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <div className="flex items-center space-x-4 mb-6">
            <div className="bg-blue-100 p-3 rounded-full">
              <User className="h-8 w-8 text-blue-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">プロフィール</h1>
              <p className="text-gray-600">アカウント情報と統計</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">基本情報</h3>
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-700">表示名</label>
                  <p className="text-gray-900">{user?.displayName || '未設定'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">メールアドレス</label>
                  <p className="text-gray-900">{user?.email}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">登録日</label>
                  <p className="text-gray-900">
                    {profile?.createdAt ? formatDate(profile.createdAt) : formatDate(user?.metadata?.creationTime)}
                  </p>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">統計情報</h3>
              <div className="grid grid-cols-1 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Target className="h-5 w-5 text-blue-600" />
                    <div>
                      <p className="text-sm font-medium text-blue-900">総目標数</p>
                      <p className="text-2xl font-bold text-blue-600">{stats.totalGoals}</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Calendar className="h-5 w-5 text-green-600" />
                    <div>
                      <p className="text-sm font-medium text-green-900">アクティブな目標</p>
                      <p className="text-2xl font-bold text-green-600">{stats.activeGoals}</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-purple-50 p-4 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-purple-600" />
                    <div>
                      <p className="text-sm font-medium text-purple-900">完了したタスク</p>
                      <p className="text-2xl font-bold text-purple-600">{stats.completedTasks}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 目標履歴 */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">目標履歴</h2>
          
          {goals.length === 0 ? (
            <div className="text-center py-8">
              <Target className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">まだ目標が設定されていません。</p>
            </div>
          ) : (
            <div className="space-y-4">
              {goals.map((goal) => (
                <div 
                  key={goal.id} 
                  className={`border rounded-lg p-4 ${goal.isActive ? 'border-blue-300 bg-blue-50' : 'border-gray-200'}`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="font-medium text-gray-900">{goal.goal}</h3>
                        {goal.isActive && (
                          <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                            アクティブ
                          </span>
                        )}
                      </div>
                      
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <span>作成日: {formatDate(goal.createdAt)}</span>
                        {goal.completedTasks && (
                          <span>完了タスク: {goal.completedTasks.length}個</span>
                        )}
                      </div>
                      
                      {goal.plan && (
                        <div className="mt-3">
                          <p className="text-sm text-gray-700 line-clamp-2">
                            {goal.plan.steps ? `${goal.plan.steps.length}個のステップが生成されています` : 'プランが生成されています'}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      </div>
    </>
  );
};

export default Profile;