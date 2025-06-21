import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { createUserProfile, saveGoal, getUserGoals } from '../services/firestore';
import { Bug, Database, User, Target } from 'lucide-react';

const DebugPanel = () => {
  const { user } = useAuth();
  const [logs, setLogs] = useState([]);
  const [isVisible, setIsVisible] = useState(false);

  const addLog = (message, type = 'info') => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs(prev => [...prev, { message, type, timestamp }]);
  };

  const testFirestoreConnection = async () => {
    if (!user) {
      addLog('ユーザーがログインしていません', 'error');
      return;
    }

    try {
      addLog('Firestore接続テスト開始...', 'info');
      
      // ユーザープロフィールテスト
      addLog('ユーザープロフィール作成テスト...', 'info');
      await createUserProfile(user.uid, {
        email: user.email,
        displayName: user.displayName || 'テストユーザー',
        testCreated: true
      });
      addLog('✓ ユーザープロフィール作成成功', 'success');

      // 目標保存テスト
      addLog('テスト目標保存...', 'info');
      const goalId = await saveGoal(user.uid, {
        goal: 'Firestoreテスト目標',
        plan: { steps: ['テストステップ1', 'テストステップ2'] },
        isActive: true,
        testData: true
      });
      addLog(`✓ 目標保存成功: ${goalId}`, 'success');

      // 目標取得テスト
      addLog('目標一覧取得テスト...', 'info');
      const goals = await getUserGoals(user.uid);
      addLog(`✓ 目標取得成功: ${goals.length}件`, 'success');

      addLog('🎉 すべてのFirestoreテストが成功しました！', 'success');
    } catch (error) {
      addLog(`❌ エラー: ${error.message}`, 'error');
      console.error('Firestore test error:', error);
    }
  };

  const clearLogs = () => {
    setLogs([]);
  };

  if (!user) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* トグルボタン */}
      <button
        onClick={() => setIsVisible(!isVisible)}
        className="bg-purple-600 hover:bg-purple-700 text-white p-3 rounded-full shadow-lg mb-2"
        title="デバッグパネル"
      >
        <Bug className="h-5 w-5" />
      </button>

      {/* デバッグパネル */}
      {isVisible && (
        <div className="bg-white border border-gray-300 rounded-lg shadow-xl w-96 max-h-96 overflow-hidden">
          <div className="bg-purple-600 text-white p-3 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Database className="h-4 w-4" />
              <span className="font-medium">デバッグパネル</span>
            </div>
            <button
              onClick={() => setIsVisible(false)}
              className="text-white hover:text-gray-200"
            >
              ×
            </button>
          </div>

          <div className="p-4 space-y-3">
            {/* ユーザー情報 */}
            <div className="bg-gray-50 p-3 rounded">
              <div className="flex items-center space-x-2 mb-2">
                <User className="h-4 w-4 text-gray-600" />
                <span className="font-medium text-sm">ユーザー情報</span>
              </div>
              <div className="text-xs text-gray-600">
                <div>ID: {user.uid.substring(0, 8)}...</div>
                <div>Email: {user.email}</div>
              </div>
            </div>

            {/* テストボタン */}
            <div className="space-y-2">
              <button
                onClick={testFirestoreConnection}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-3 rounded text-sm"
              >
                <Target className="h-4 w-4 inline mr-2" />
                Firestoreテスト実行
              </button>
              
              <button
                onClick={clearLogs}
                className="w-full bg-gray-500 hover:bg-gray-600 text-white py-1 px-3 rounded text-sm"
              >
                ログクリア
              </button>
            </div>

            {/* ログ表示 */}
            <div className="bg-black text-green-400 p-3 rounded text-xs max-h-40 overflow-y-auto font-mono">
              {logs.length === 0 ? (
                <div className="text-gray-500">ログはありません</div>
              ) : (
                logs.map((log, index) => (
                  <div key={index} className={`mb-1 ${
                    log.type === 'error' ? 'text-red-400' : 
                    log.type === 'success' ? 'text-green-400' : 
                    'text-gray-300'
                  }`}>
                    <span className="text-gray-500">[{log.timestamp}]</span> {log.message}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DebugPanel;