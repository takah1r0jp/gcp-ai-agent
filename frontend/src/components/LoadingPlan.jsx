import { useState, useEffect } from 'react';
import { Sparkles, Brain, Target, Zap } from 'lucide-react';

function LoadingPlan({ goal }) {
  const [elapsedTime, setElapsedTime] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);

  const steps = [
    { icon: Brain, text: '目標を分析中...', duration: 3000 },
    { icon: Target, text: 'ステップを設計中...', duration: 4000 },
    { icon: Zap, text: 'タスクを生成中...', duration: 3000 },
    { icon: Sparkles, text: '最終調整中...', duration: 2000 }
  ];

  useEffect(() => {
    const startTime = Date.now();
    
    // 経過時間の更新
    const timeInterval = setInterval(() => {
      setElapsedTime(Date.now() - startTime);
    }, 100);

    // ステップとプログレスの更新
    let stepTimeout;
    let progressInterval;
    let stepStartTime = startTime;

    const updateStep = (stepIndex) => {
      if (stepIndex >= steps.length) {
        setProgress(100);
        return;
      }

      setCurrentStep(stepIndex);
      stepStartTime = Date.now();
      
      // プログレスバーの更新
      progressInterval = setInterval(() => {
        const stepElapsed = Date.now() - stepStartTime;
        const stepProgress = Math.min(stepElapsed / steps[stepIndex].duration, 1);
        const totalProgress = ((stepIndex + stepProgress) / steps.length) * 100;
        setProgress(totalProgress);
      }, 50);

      // 次のステップへの遷移
      stepTimeout = setTimeout(() => {
        clearInterval(progressInterval);
        updateStep(stepIndex + 1);
      }, steps[stepIndex].duration);
    };

    updateStep(0);

    return () => {
      clearInterval(timeInterval);
      clearInterval(progressInterval);
      clearTimeout(stepTimeout);
    };
  }, []);

  const formatTime = (ms) => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    
    if (minutes > 0) {
      return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    }
    return `${remainingSeconds}秒`;
  };

  const CurrentIcon = steps[currentStep]?.icon || Sparkles;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
      <div className="max-w-2xl w-full mx-auto px-4">
        {/* メインカード */}
        <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 p-8 md:p-12">
          {/* ヘッダー */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full mb-6 relative">
              <CurrentIcon size={40} className="text-white" />
              <div className="absolute inset-0 rounded-full border-4 border-blue-200 animate-pulse" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              目標達成プランを
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                作成中です
              </span>
            </h1>
            <p className="text-gray-600 text-lg">
              AIがあなたの目標を詳しく分析しています
            </p>
          </div>

          {/* 目標表示 */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6 mb-8 border border-blue-100">
            <h2 className="text-lg font-semibold text-gray-800 mb-2">あなたの目標</h2>
            <p className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
              {goal}
            </p>
          </div>

          {/* プログレスバー */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-3">
              <span className="text-sm font-medium text-gray-600">進捗状況</span>
              <span className="text-sm font-bold text-blue-600">{Math.round(progress)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-300 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* 現在のステップ */}
          <div className="mb-8">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <CurrentIcon size={24} className="text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800">
                  {steps[currentStep]?.text || '最終調整中...'}
                </h3>
                <p className="text-sm text-gray-500">
                  ステップ {Math.min(currentStep + 1, steps.length)} / {steps.length}
                </p>
              </div>
            </div>

            {/* ステップ一覧 */}
            <div className="grid gap-3">
              {steps.map((step, index) => {
                const StepIcon = step.icon;
                const isActive = index === currentStep;
                const isCompleted = index < currentStep;
                
                return (
                  <div 
                    key={index}
                    className={`flex items-center space-x-3 p-3 rounded-lg transition-all duration-300 ${
                      isActive 
                        ? 'bg-blue-50 border-2 border-blue-200' 
                        : isCompleted 
                          ? 'bg-green-50 border border-green-200' 
                          : 'bg-gray-50 border border-gray-200'
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      isActive 
                        ? 'bg-blue-600 text-white' 
                        : isCompleted 
                          ? 'bg-green-600 text-white' 
                          : 'bg-gray-300 text-gray-600'
                    }`}>
                      {isCompleted ? (
                        <div className="w-4 h-4 rounded-full bg-white" />
                      ) : (
                        <StepIcon size={16} />
                      )}
                    </div>
                    <span className={`text-sm font-medium ${
                      isActive 
                        ? 'text-blue-800' 
                        : isCompleted 
                          ? 'text-green-800' 
                          : 'text-gray-600'
                    }`}>
                      {step.text}
                    </span>
                    {isActive && (
                      <div className="ml-auto">
                        <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* 経過時間 */}
          <div className="text-center">
            <div className="inline-flex items-center space-x-2 bg-gray-100 rounded-full px-6 py-3">
              <div className="w-3 h-3 bg-blue-600 rounded-full animate-pulse" />
              <span className="text-sm font-medium text-gray-700">
                経過時間: {formatTime(elapsedTime)}
              </span>
            </div>
          </div>

          {/* メッセージ */}
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-500">
              品質の高いプランを作成するため、少々お時間をいただいています。
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoadingPlan;