const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

/**
 * 目標プランを生成するAPI呼び出し
 * @param {string} goal - ユーザーの目標
 * @returns {Promise<Object>} プラン生成結果
 */
export async function createGoalPlan(goal) {
  try {
    console.log('API呼び出し開始:', { goal, url: `${API_BASE_URL}/goal/plan` });
    
    const response = await fetch(`${API_BASE_URL}/goal/plan`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ goal }),
    });

    console.log('APIレスポンス状態:', response.status);

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(
        errorData?.detail || 
        `HTTP error! status: ${response.status}`
      );
    }

    const data = await response.json();
    console.log('API成功レスポンス:', data);
    return data;
  } catch (error) {
    console.error('API呼び出しエラー:', error);
    throw error;
  }
}

/**
 * APIの接続状況を確認
 * @returns {Promise<boolean>} 接続成功かどうか
 */
export async function checkApiHealth() {
  try {
    const response = await fetch(`${API_BASE_URL.replace('/api', '')}/health`, {
      method: 'GET',
    });
    return response.ok;
  } catch (error) {
    console.error('API Health Check failed:', error);
    return false;
  }
}