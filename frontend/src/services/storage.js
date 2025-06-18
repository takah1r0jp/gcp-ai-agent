// 簡単なローカルストレージベースのデータベース実装

const STORAGE_KEYS = {
  COMPLETED_TASKS: 'gcp_ai_agent_completed_tasks',
  PLAN_DATA: 'gcp_ai_agent_plan_data',
  GOAL_HISTORY: 'gcp_ai_agent_goal_history'
};

// 完了タスクの管理
export const saveCompletedTasks = (completedTasks) => {
  try {
    const tasksArray = Array.from(completedTasks);
    localStorage.setItem(STORAGE_KEYS.COMPLETED_TASKS, JSON.stringify(tasksArray));
    return true;
  } catch (error) {
    console.error('完了タスクの保存に失敗:', error);
    return false;
  }
};

export const loadCompletedTasks = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.COMPLETED_TASKS);
    if (saved) {
      const tasksArray = JSON.parse(saved);
      return new Set(tasksArray);
    }
    return new Set();
  } catch (error) {
    console.error('完了タスクの読み込みに失敗:', error);
    return new Set();
  }
};

// プランデータの管理
export const savePlanData = (planData) => {
  try {
    localStorage.setItem(STORAGE_KEYS.PLAN_DATA, JSON.stringify(planData));
    return true;
  } catch (error) {
    console.error('プランデータの保存に失敗:', error);
    return false;
  }
};

export const loadPlanData = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.PLAN_DATA);
    if (saved) {
      return JSON.parse(saved);
    }
    return null;
  } catch (error) {
    console.error('プランデータの読み込みに失敗:', error);
    return null;
  }
};

// 目標履歴の管理
export const saveGoalToHistory = (goal, planData) => {
  try {
    const history = loadGoalHistory();
    const newEntry = {
      id: Date.now(),
      goal,
      planData,
      createdAt: new Date().toISOString(),
      lastUpdated: new Date().toISOString()
    };
    
    history.unshift(newEntry);
    
    // 最新10件のみ保持
    const trimmedHistory = history.slice(0, 10);
    
    localStorage.setItem(STORAGE_KEYS.GOAL_HISTORY, JSON.stringify(trimmedHistory));
    return true;
  } catch (error) {
    console.error('目標履歴の保存に失敗:', error);
    return false;
  }
};

export const loadGoalHistory = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.GOAL_HISTORY);
    if (saved) {
      return JSON.parse(saved);
    }
    return [];
  } catch (error) {
    console.error('目標履歴の読み込みに失敗:', error);
    return [];
  }
};

// データベースクリア（開発用）
export const clearAllData = () => {
  try {
    Object.values(STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key);
    });
    return true;
  } catch (error) {
    console.error('データクリアに失敗:', error);
    return false;
  }
};

// データベース統計情報
export const getStorageStats = () => {
  try {
    const completedTasks = loadCompletedTasks();
    const planData = loadPlanData();
    const goalHistory = loadGoalHistory();
    
    return {
      completedTasksCount: completedTasks.size,
      hasPlanData: !!planData,
      goalHistoryCount: goalHistory.length,
      lastUpdate: planData ? new Date(planData.createdAt || Date.now()).toLocaleString('ja-JP') : null
    };
  } catch (error) {
    console.error('統計情報の取得に失敗:', error);
    return {
      completedTasksCount: 0,
      hasPlanData: false,
      goalHistoryCount: 0,
      lastUpdate: null
    };
  }
};