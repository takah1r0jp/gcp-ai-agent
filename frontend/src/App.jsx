import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import GoalInput from './components/GoalInput';
import GoalPlan from './components/GoalPlan';
import LoadingPlan from './components/LoadingPlan';
import TodayTasks from './components/TodayTasks';
import Login from './components/Login';
import Signup from './components/Signup';
import Header from './components/Header';
import AppHeader from './components/AppHeader';
import Profile from './components/Profile';
import GoalHistory from './components/GoalHistory';
import ProtectedRoute from './components/ProtectedRoute';
import DebugPanel from './components/DebugPanel';
import { createGoalPlan, checkApiHealth } from './services/api';
import { 
  saveCompletedTasks, 
  loadCompletedTasks, 
  savePlanData, 
  loadPlanData,
  saveGoalToHistory
} from './services/storage';
import { 
  saveGoal, 
  savePlan, 
  saveTaskProgress, 
  getCurrentGoal, 
  setActiveGoal 
} from './services/firestore';
import { AlertCircle, Wifi, WifiOff } from 'lucide-react';

function MainApp() {
  const { user } = useAuth();
  const [currentView, setCurrentView] = useState('input'); // 'input' | 'loading' | 'plan' | 'today' | 'history'
  const [planData, setPlanData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isApiConnected, setIsApiConnected] = useState(null);
  const [currentGoal, setCurrentGoal] = useState('');
  const [completedTasks, setCompletedTasks] = useState(new Set());
  const [currentGoalId, setCurrentGoalId] = useState(null);

  // 初期データ読み込み（ユーザーがログインしている場合はFirestoreから、そうでなければローカルストレージから）
  useEffect(() => {
    const loadUserData = async () => {
      if (user) {
        try {
          // Firestoreからユーザーの現在の目標を取得
          const currentGoalData = await getCurrentGoal(user.uid);
          console.log('🔍 Firebaseから取得したデータ:', currentGoalData);
          
          if (currentGoalData) {
            setCurrentGoalId(currentGoalData.id);
            setCurrentGoal(currentGoalData.goal);
            console.log('🔍 目標ID設定:', currentGoalData.id);
            console.log('🔍 目標テキスト設定:', currentGoalData.goal);
            
            if (currentGoalData.plan) {
              setPlanData(currentGoalData.plan);
              console.log('🔍 プランデータ設定:', currentGoalData.plan);
              // 目標が設定されている場合は今日のタスク画面を表示
              setCurrentView('today');
            }
            if (currentGoalData.completedTasks) {
              setCompletedTasks(new Set(currentGoalData.completedTasks));
              console.log('🔍 完了タスク設定:', currentGoalData.completedTasks);
            }
          } else {
            console.log('🔍 Firebaseにアクティブな目標が見つかりません');
          }
        } catch (error) {
          console.error('ユーザーデータの読み込みエラー:', error);
          // エラーの場合はローカルストレージにフォールバック
          loadLocalData();
        }
      } else {
        loadLocalData();
      }
    };

    const loadLocalData = () => {
      const savedCompletedTasks = loadCompletedTasks();
      const savedPlanData = loadPlanData();
      
      setCompletedTasks(savedCompletedTasks);
      
      if (savedPlanData) {
        setPlanData(savedPlanData);
        setCurrentView('plan');
      }
    };

    loadUserData();
  }, [user]);

  // 完了タスクの変更を監視して自動保存
  useEffect(() => {
    const saveTaskData = async () => {
      if (completedTasks.size > 0) {
        if (user && currentGoalId) {
          try {
            // Firestoreに保存
            await saveTaskProgress(user.uid, currentGoalId, completedTasks);
          } catch (error) {
            console.error('タスク進捗の保存エラー:', error);
            // エラーの場合はローカルストレージにフォールバック
            saveCompletedTasks(completedTasks);
          }
        } else {
          // ローカルストレージに保存
          saveCompletedTasks(completedTasks);
        }
      }
    };

    saveTaskData();
  }, [completedTasks, user, currentGoalId]);

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
      if (user) {
        try {
          // Firestoreに保存
          const goalId = await saveGoal(user.uid, {
            goal: goalData.goal,
            plan: result,
            isActive: true,
            hasGeneratedPlan: true,
            completedTasks: []
          });
          setCurrentGoalId(goalId);
          
          // 他の目標を非アクティブにして、この目標をアクティブに設定
          await setActiveGoal(user.uid, goalId);
        } catch (error) {
          console.error('Firestore保存エラー:', error);
          // エラーの場合はローカルストレージにフォールバック
          savePlanData(result);
          saveGoalToHistory(goalData.goal, result);
        }
      } else {
        // ローカルストレージに保存
        savePlanData(result);
        saveGoalToHistory(goalData.goal, result);
      }
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
    setCurrentGoalId(null);
    setCompletedTasks(new Set());
  };

  const handleShowTodayTasks = () => {
    setCurrentView('today');
  };

  const handleBackToPlan = () => {
    setCurrentView('plan');
  };

  const handleViewChange = (view) => {
    // 新しい目標設定の場合のみデータをクリア
    if (view === 'input') {
      // 既存の目標がある場合は確認ダイアログを表示
      const currentHasGoal = (planData !== null) || (currentGoalId !== null);
      if (currentHasGoal) {
        const confirmed = window.confirm('新しい目標を設定しますか？現在の目標が置き換えられます。');
        if (!confirmed) {
          return; // キャンセルされた場合は何もしない
        }
        // 確認された場合は目標データをクリア
        setPlanData(null);
        setCurrentGoalId(null);
        setCurrentGoal('');
        setCompletedTasks(new Set());
      }
    }
    
    setCurrentView(view);
    setError(null);
  };

  const handleGoalSelect = (selectedGoal) => {
    // 選択された目標をアクティブに設定
    setCurrentGoalId(selectedGoal.id);
    setCurrentGoal(selectedGoal.goal);
    setPlanData(selectedGoal.plan);
    setCompletedTasks(new Set(selectedGoal.completedTasks));
    
    // 今日のタスク画面に移動
    setCurrentView('today');
    setError(null);
  };

  const handleBackFromHistory = () => {
    // 目標履歴から戻る
    if (planData) {
      setCurrentView('today');
    } else {
      setCurrentView('input');
    }
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

  // Firebaseデータに基づく目標存在判定
  const hasGoal = (planData !== null) || (currentGoalId !== null);
  
  // デバッグ情報
  console.log('🔍 hasGoal判定:', {
    planData: planData ? 'あり' : 'なし',
    currentGoalId: currentGoalId ? 'あり' : 'なし',
    currentGoal: currentGoal || 'なし',
    hasGoal
  });

  return (
    <div className="min-h-screen">
      <AppHeader 
        currentView={currentView}
        onViewChange={handleViewChange}
        hasGoal={hasGoal}
        currentGoal={currentGoal}
      />
      
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

      {currentView === 'history' && (
        <GoalHistory 
          onGoalSelect={handleGoalSelect}
          onBack={handleBackFromHistory}
          currentGoalId={currentGoalId}
        />
      )}
      
      {/* デバッグパネル */}
      <DebugPanel />
    </div>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/" element={
            <ProtectedRoute>
              <MainApp />
            </ProtectedRoute>
          } />
          <Route path="/profile" element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;