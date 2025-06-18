import { useState, useEffect } from 'react';
import GoalInput from './components/GoalInput';
import GoalPlan from './components/GoalPlan';
import LoadingPlan from './components/LoadingPlan';
import TodayTasks from './components/TodayTasks';
import { createGoalPlan, checkApiHealth } from './services/api';
import { 
  saveCompletedTasks, 
  loadCompletedTasks, 
  savePlanData, 
  loadPlanData,
  saveGoalToHistory
} from './services/storage';
import { AlertCircle, Wifi, WifiOff } from 'lucide-react';

function App() {
  const [currentView, setCurrentView] = useState('input'); // 'input' | 'loading' | 'plan' | 'today'
  const [planData, setPlanData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isApiConnected, setIsApiConnected] = useState(null);
  const [currentGoal, setCurrentGoal] = useState('');
  const [completedTasks, setCompletedTasks] = useState(new Set());

  // 初期データ読み込み
  useEffect(() => {
    const savedCompletedTasks = loadCompletedTasks();
    const savedPlanData = loadPlanData();
    
    setCompletedTasks(savedCompletedTasks);
    
    if (savedPlanData) {
      setPlanData(savedPlanData);
      setCurrentView('plan');
    }
  }, []);

  // 完了タスクの変更を監視して自動保存
  useEffect(() => {
    if (completedTasks.size > 0) {
      saveCompletedTasks(completedTasks);
    }
  }, [completedTasks]);

  // API接続状況をチェック
  useEffect(() => {
    const checkConnection = async () => {
      const isConnected = await checkApiHealth();
      setIsApiConnected(isConnected);
    };
    
    checkConnection();
    // 30秒ごとに接続状況をチェック
    const interval = setInterval(checkConnection, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleGoalSubmit = async (goalData) => {
    setIsLoading(true);
    setError(null);
    setCurrentGoal(goalData.goal);
    setCurrentView('loading');

    try {
      console.log('目標送信:', goalData);
      const result = await createGoalPlan(goalData.goal);
      console.log('プラン生成成功:', result);
      
      setPlanData(result);
      setCurrentView('plan');
      
      // データを保存
      savePlanData(result);
      saveGoalToHistory(goalData.goal, result);
    } catch (err) {
      console.error('プラン生成エラー:', err);
      setError(err.message || 'プランの生成中にエラーが発生しました');
      setCurrentView('input');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToInput = () => {
    setCurrentView('input');
    setError(null);
  };

  const handleEditGoal = () => {
    setCurrentView('input');
    setError(null);
    setPlanData(null);
  };

  const handleShowTodayTasks = () => {
    setCurrentView('today');
  };

  const handleBackToPlan = () => {
    setCurrentView('plan');
  };

  const handleToggleTask = (taskId) => {
    const newCompleted = new Set(completedTasks);
    if (newCompleted.has(taskId)) {
      newCompleted.delete(taskId);
    } else {
      newCompleted.add(taskId);
    }
    setCompletedTasks(newCompleted);
  };

  return (
    <div className="min-h-screen">
      {/* API接続状況表示 */}
      {isApiConnected !== null && (
        <div className={`fixed top-4 right-4 z-50 px-4 py-2 rounded-full text-sm font-medium flex items-center space-x-2 ${
          isApiConnected 
            ? 'bg-green-100 text-green-800 border border-green-200' 
            : 'bg-red-100 text-red-800 border border-red-200'
        }`}>
          {isApiConnected ? (
            <>
              <Wifi size={16} />
              <span>API接続中</span>
            </>
          ) : (
            <>
              <WifiOff size={16} />
              <span>API未接続</span>
            </>
          )}
        </div>
      )}

      {/* エラー表示 */}
      {error && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 max-w-md w-full mx-4">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 shadow-lg">
            <div className="flex items-start space-x-3">
              <AlertCircle size={20} className="text-red-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <h3 className="text-sm font-medium text-red-800 mb-1">
                  エラーが発生しました
                </h3>
                <p className="text-sm text-red-700">{error}</p>
                <button
                  onClick={() => setError(null)}
                  className="mt-2 text-sm text-red-600 hover:text-red-800 underline"
                >
                  閉じる
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* メインコンテンツ */}
      {currentView === 'input' && (
        <GoalInput 
          onGoalSubmit={handleGoalSubmit}
          isLoading={isLoading}
        />
      )}
      
      {currentView === 'loading' && (
        <LoadingPlan goal={currentGoal} />
      )}
      
      {currentView === 'plan' && (
        <GoalPlan 
          planData={planData}
          onBack={handleBackToInput}
          onEditGoal={handleEditGoal}
          onShowTodayTasks={handleShowTodayTasks}
          completedTasks={completedTasks}
          onToggleTask={handleToggleTask}
        />
      )}
      
      {currentView === 'today' && (
        <TodayTasks 
          planData={planData}
          onBack={handleBackToPlan}
          completedTasks={completedTasks}
          onToggleTask={handleToggleTask}
        />
      )}
    </div>
  );
}

export default App;