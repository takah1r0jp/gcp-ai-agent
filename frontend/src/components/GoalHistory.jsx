import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getUserGoals, setActiveGoal } from '../services/firestore';
import { Target, Calendar, CheckCircle, Play, Clock } from 'lucide-react';

const GoalHistory = ({ onGoalSelect, onBack, currentGoalId }) => {
  const { user } = useAuth();
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadGoals = async () => {
      if (!user) return;

      try {
        setLoading(true);
        const userGoals = await getUserGoals(user.uid);
        setGoals(userGoals);
      } catch (error) {
        console.error('目標履歴の読み込みエラー:', error);
        setError('目標履歴の読み込みに失敗しました');
      } finally {
        setLoading(false);
      }
    };

    loadGoals();
  }, [user]);

  const handleSelectGoal = async (goal) => {
    try {
      // 選択した目標をアクティブに設定
      await setActiveGoal(user.uid, goal.id);
      
      // 親コンポーネントに選択した目標を通知
      onGoalSelect({
        id: goal.id,
        goal: goal.goal,
        plan: goal.plan,
        completedTasks: goal.completedTasks || []
      });
    } catch (error) {
      console.error('目標選択エラー:', error);
      setError('目標の選択に失敗しました');
    }
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return '不明';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getProgressInfo = (goal) => {
    if (!goal.plan || !goal.plan.mid_goals) return { total: 0, completed: 0 };
    
    let totalTasks = 0;
    goal.plan.mid_goals.forEach(midGoal => {
      if (midGoal.small_goals) {
        midGoal.small_goals.forEach(smallGoal => {
          if (smallGoal.tasks) {
            totalTasks += smallGoal.tasks.length;
          }
        });
      }
    });
    
    const completedTasks = goal.completedTasks ? goal.completedTasks.length : 0;
    return { total: totalTasks, completed: completedTasks };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* ヘッダー */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Target className="h-8 w-8 text-blue-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">目標履歴</h1>
                <p className="text-gray-600">過去の目標から選択してください</p>
              </div>
            </div>
            <button
              onClick={onBack}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              戻る
            </button>
          </div>
        </div>

        {/* エラー表示 */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {/* 目標一覧 */}
        {goals.length === 0 ? (
          <div className="text-center py-12">
            <Target className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">目標がありません</h3>
            <p className="text-gray-600">まだ目標が設定されていません。</p>
          </div>
        ) : (
          <div className="space-y-4">
            {goals.map((goal) => {
              const { total, completed } = getProgressInfo(goal);
              const progressPercentage = total > 0 ? Math.round((completed / total) * 100) : 0;
              const isActive = goal.id === currentGoalId;

              return (
                <div 
                  key={goal.id}
                  className={`bg-white rounded-lg shadow p-6 transition-colors ${
                    isActive ? 'ring-2 ring-blue-500 bg-blue-50' : 'hover:shadow-md'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      {/* 目標タイトル */}
                      <div className="flex items-center space-x-2 mb-3">
                        <h3 className="text-lg font-semibold text-gray-900">{goal.goal}</h3>
                        {isActive && (
                          <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                            現在の目標
                          </span>
                        )}
                      </div>

                      {/* メタ情報 */}
                      <div className="flex items-center space-x-4 text-sm text-gray-600 mb-4">
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-4 w-4" />
                          <span>作成: {formatDate(goal.createdAt)}</span>
                        </div>
                        {goal.updatedAt && (
                          <div className="flex items-center space-x-1">
                            <Clock className="h-4 w-4" />
                            <span>更新: {formatDate(goal.updatedAt)}</span>
                          </div>
                        )}
                      </div>

                      {/* プログレス情報 */}
                      {goal.plan && (
                        <div className="mb-4">
                          <div className="flex items-center justify-between text-sm text-gray-700 mb-2">
                            <div className="flex items-center space-x-2">
                              <CheckCircle className="h-4 w-4" />
                              <span>進捗: {completed}/{total} タスク</span>
                            </div>
                            <span className="font-medium">{progressPercentage}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${progressPercentage}%` }}
                            ></div>
                          </div>
                        </div>
                      )}

                      {/* プラン情報 */}
                      {goal.plan ? (
                        <div className="text-sm text-gray-600">
                          <p>
                            {goal.plan.mid_goals ? `${goal.plan.mid_goals.length}個のステップ` : 'プランあり'}
                            {goal.plan.estimated_period && ` • 期間: ${goal.plan.estimated_period}`}
                          </p>
                        </div>
                      ) : (
                        <div className="text-sm text-gray-500">
                          プランが生成されていません
                        </div>
                      )}
                    </div>

                    {/* アクション */}
                    <div className="ml-4">
                      {!isActive && goal.plan ? (
                        <button
                          onClick={() => handleSelectGoal(goal)}
                          className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors"
                        >
                          <Play className="h-4 w-4" />
                          <span>選択</span>
                        </button>
                      ) : isActive ? (
                        <div className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-blue-700 bg-blue-100 rounded-md">
                          <CheckCircle className="h-4 w-4" />
                          <span>選択中</span>
                        </div>
                      ) : (
                        <div className="text-sm text-gray-500">
                          プランなし
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default GoalHistory;