import { useState, useEffect, useCallback } from 'react';
import { 
  ArrowLeft, 
  CheckCircle2, 
  Circle, 
  Calendar,
  Target,
  Trophy,
  Star,
  Lightbulb,
  TrendingUp,
  Zap,
  CheckCircle,
  ArrowRight,
  Sun,
  Coffee,
  Sunrise
} from 'lucide-react';

function TodayTasks({ planData, onBack, completedTasks, onToggleTask }) {
  const [animatedTasks, setAnimatedTasks] = useState(new Set());
  const [showCelebration, setShowCelebration] = useState(false);
  const [todayTasks, setTodayTasks] = useState([]);

  // 今日のタスクを抽出する関数
  const extractTodayTasks = useCallback(() => {
    if (!planData?.mid_goals) return [];
    
    const allTasks = [];
    planData.mid_goals.forEach((midGoal, midIndex) => {
      midGoal.small_goals?.forEach((smallGoal) => {
        smallGoal.tasks?.forEach((task, taskIndex) => {
          const taskId = `${midGoal.id}-${smallGoal.id}-${taskIndex}`;
          allTasks.push({
            id: taskId,
            task: task,
            midGoalTitle: midGoal.title,
            smallGoalTitle: smallGoal.title,
            midGoalId: midGoal.id,
            smallGoalId: smallGoal.id,
            priority: midIndex < 2 ? 'high' : midIndex < 4 ? 'medium' : 'low', // 最初の2つは高優先度
            category: smallGoal.title,
            isCompleted: completedTasks?.has(taskId) || false
          });
        });
      });
    });
    
    // 今日のタスクを選出（未完了のタスクから優先度順に最大8個）
    const incompleteTasks = allTasks.filter(task => !task.isCompleted);
    const completedTasksToday = allTasks.filter(task => task.isCompleted);
    
    // 優先度順にソート
    const priorityOrder = { high: 3, medium: 2, low: 1 };
    incompleteTasks.sort((a, b) => priorityOrder[b.priority] - priorityOrder[a.priority]);
    
    // 今日のタスクとして最大6個の未完了タスクと、完了済みタスクを表示
    return [
      ...incompleteTasks.slice(0, 6),
      ...completedTasksToday.slice(0, 4) // 完了済みも最大4個表示
    ];
  }, [planData, completedTasks]);

  useEffect(() => {
    const tasks = extractTodayTasks();
    setTodayTasks(tasks);
  }, [extractTodayTasks]);

  // アニメーション用のマウント効果
  useEffect(() => {
    const timer = setTimeout(() => {
      todayTasks.forEach((task, index) => {
        setTimeout(() => {
          setAnimatedTasks(prev => new Set([...prev, task.id]));
        }, index * 150);
      });
    }, 300);
    return () => clearTimeout(timer);
  }, [todayTasks]);

  // 進捗計算
  const calculateTodayProgress = () => {
    const total = todayTasks.length;
    const completed = todayTasks.filter(task => task.isCompleted).length;
    return {
      completed,
      total,
      percentage: total > 0 ? Math.round((completed / total) * 100) : 0
    };
  };

  const progress = calculateTodayProgress();

  const handleToggleTask = (taskId) => {
    if (onToggleTask) {
      onToggleTask(taskId);
      
      // 完了時のお祝いアニメーション
      if (!completedTasks?.has(taskId)) {
        if (Math.random() > 0.6) { // 40%の確率でお祝い
          setShowCelebration(true);
          setTimeout(() => setShowCelebration(false), 3000);
        }
      }
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'from-red-500 to-pink-500';
      case 'medium': return 'from-yellow-500 to-orange-500';
      case 'low': return 'from-green-500 to-teal-500';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  const getPriorityText = (priority) => {
    switch (priority) {
      case 'high': return '高優先度';
      case 'medium': return '中優先度';
      case 'low': return '低優先度';
      default: return '通常';
    }
  };

  if (!planData || !planData.mid_goals) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-400 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-purple-200">プランを読み込み中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-yellow-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-conic from-orange-500/5 via-yellow-500/5 to-orange-500/5 rounded-full blur-3xl animate-spin-slow" />
      </div>

      {/* Celebration Animation */}
      {showCelebration && (
        <div className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center">
          <div className="relative">
            {[...Array(15)].map((_, i) => (
              <div
                key={i}
                className={`absolute w-3 h-3 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full animate-ping`}
                style={{
                  left: `${Math.random() * 200 - 100}px`,
                  top: `${Math.random() * 200 - 100}px`,
                  animationDelay: `${Math.random() * 1000}ms`,
                  animationDuration: `${1000 + Math.random() * 1000}ms`
                }}
              />
            ))}
            <div className="text-4xl animate-bounce">🌟</div>
          </div>
        </div>
      )}

      {/* Glassmorphism Header */}
      <header className="relative z-10 backdrop-blur-xl bg-white/10 border-b border-white/20 shadow-2xl">
        <div className="container mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <button
              onClick={onBack}
              className="group inline-flex items-center space-x-3 text-white/80 hover:text-white transition-all duration-300 hover:scale-105"
            >
              <div className="p-2 rounded-xl bg-white/10 group-hover:bg-white/20 transition-all duration-300">
                <ArrowLeft size={20} />
              </div>
              <span className="font-medium">プランに戻る</span>
            </button>

            <div className="text-center flex-1">
              <h1 className="text-3xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-200 via-yellow-200 to-orange-200 drop-shadow-lg">
                今日のタスク
              </h1>
              <p className="text-orange-200/80 mt-2">今日集中すべきタスクを確認</p>
            </div>

            <div className="flex items-center space-x-4">
              <div className="text-right">
                <div className="text-2xl font-bold text-white">
                  {new Date().toLocaleDateString('ja-JP', { 
                    month: 'short', 
                    day: 'numeric',
                    weekday: 'short'
                  })}
                </div>
                <div className="text-sm text-white/60">
                  {new Date().toLocaleDateString('ja-JP', { year: 'numeric' })}
                </div>
              </div>
              <Sunrise size={32} className="text-orange-300" />
            </div>
          </div>
        </div>
      </header>

      <div className="relative z-10 container mx-auto px-6 py-12">
        {/* Today's Progress Section */}
        <div className="text-center mb-16">
          <div className="relative inline-block group">
            <div className="absolute inset-0 bg-gradient-to-r from-orange-600 to-yellow-600 rounded-3xl blur-xl opacity-50 group-hover:opacity-70 transition-opacity duration-500" />
            
            <div className="relative backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-10 shadow-2xl">
              <div className="flex items-center justify-center space-x-6 mb-8">
                <Sun size={32} className="text-yellow-400" />
                <Coffee size={40} className="text-orange-300" />
                <Target size={48} className="text-yellow-400" />
                <Coffee size={40} className="text-orange-300" />
                <Trophy size={32} className="text-yellow-400" />
              </div>
              
              <h2 className="text-2xl md:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-orange-200 to-yellow-200 mb-6 leading-tight">
                今日も頑張りましょう！
              </h2>
              
              <div className="flex items-center justify-center space-x-8 text-white/80 mb-8">
                <div className="flex items-center space-x-2">
                  <Calendar size={20} className="text-orange-300" />
                  <span className="font-medium">今日のタスク: {todayTasks.length}個</span>
                </div>
                <div className="flex items-center space-x-2">
                  <TrendingUp size={20} className="text-yellow-300" />
                  <span className="font-medium">進捗: {progress.percentage}%</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Zap size={20} className="text-orange-300" />
                  <span className="font-medium">完了: {progress.completed}/{progress.total}</span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mt-8">
                <div className="flex justify-between text-sm text-white/70 mb-2">
                  <span>今日の進捗</span>
                  <span>{progress.completed}/{progress.total} タスク完了</span>
                </div>
                <div className="relative w-full h-4 bg-white/10 rounded-full overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-white/10 rounded-full" />
                  <div 
                    className="h-full bg-gradient-to-r from-orange-500 via-yellow-500 to-orange-500 rounded-full transition-all duration-1000 ease-out relative overflow-hidden"
                    style={{ width: `${progress.percentage}%` }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Today's Tasks List */}
        <div className="max-w-4xl mx-auto">
          <div className="space-y-6">
            {todayTasks.map((taskItem, index) => (
              <div 
                key={taskItem.id} 
                className={`transform transition-all duration-700 ${
                  animatedTasks.has(taskItem.id) 
                    ? 'translate-x-0 opacity-100' 
                    : 'translate-x-8 opacity-0'
                }`}
                style={{ transitionDelay: `${index * 150}ms` }}
              >
                <div className="group relative">
                  {/* Task completion glow */}
                  {taskItem.isCompleted && (
                    <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 rounded-2xl blur-lg" />
                  )}
                  
                  {/* Card glow effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-orange-600/10 to-yellow-600/10 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  <div className={`relative backdrop-blur-xl border rounded-2xl p-6 shadow-2xl transition-all duration-500 hover:scale-[1.02] ${
                    taskItem.isCompleted 
                      ? 'bg-emerald-500/5 border-emerald-500/30 hover:border-emerald-500/50' 
                      : 'bg-white/10 border-white/20 hover:border-white/30 hover:shadow-orange-500/25'
                  }`}>
                    <div className="flex items-start space-x-4">
                      {/* Task Toggle Button */}
                      <button
                        onClick={() => handleToggleTask(taskItem.id)}
                        className="relative mt-1 group/check flex-shrink-0"
                      >
                        <div className={`absolute inset-0 rounded-full transition-all duration-300 ${
                          taskItem.isCompleted ? 'bg-emerald-500/20 scale-150' : 'bg-white/10 scale-100 group-hover/check:scale-125'
                        }`} />
                        {taskItem.isCompleted ? (
                          <CheckCircle2 size={28} className="relative text-emerald-400" />
                        ) : (
                          <Circle size={28} className="relative text-white/40 group-hover/check:text-orange-400 transition-colors duration-200" />
                        )}
                      </button>
                      
                      {/* Task Content */}
                      <div className="flex-1 min-w-0">
                        {/* Priority Badge */}
                        <div className="flex items-center space-x-3 mb-3">
                          <div className={`px-3 py-1 bg-gradient-to-r ${getPriorityColor(taskItem.priority)} text-white rounded-full font-bold text-xs shadow-lg`}>
                            {getPriorityText(taskItem.priority)}
                          </div>
                          <div className="text-xs text-white/50 font-medium">
                            {taskItem.midGoalTitle}
                          </div>
                        </div>
                        
                        {/* Task Title */}
                        <h3 className={`text-lg font-bold mb-2 transition-all duration-300 ${
                          taskItem.isCompleted 
                            ? 'text-white/60 line-through' 
                            : 'text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-orange-200 group-hover:to-yellow-200'
                        }`}>
                          {taskItem.task}
                        </h3>
                        
                        {/* Category */}
                        <div className="flex items-center space-x-2 text-white/60 text-sm mb-3">
                          <Lightbulb size={14} />
                          <span>{taskItem.category}</span>
                        </div>
                        
                        {/* Completion Status */}
                        {taskItem.isCompleted && (
                          <div className="flex items-center space-x-2 text-emerald-400 text-sm">
                            <CheckCircle size={16} />
                            <span className="font-medium">完了</span>
                            <div className="flex space-x-1">
                              {[...Array(3)].map((_, i) => (
                                <div 
                                  key={i} 
                                  className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-bounce"
                                  style={{ animationDelay: `${i * 200}ms` }}
                                />
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                      
                      {/* Action Indicator */}
                      {!taskItem.isCompleted && (
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 mt-2">
                          <ArrowRight size={20} className="text-orange-400" />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Empty State */}
          {todayTasks.length === 0 && (
            <div className="text-center py-16">
              <div className="relative inline-block">
                <div className="absolute inset-0 bg-gradient-to-r from-orange-600/20 to-yellow-600/20 rounded-3xl blur-xl opacity-50" />
                <div className="relative backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-10 shadow-2xl">
                  <Sun size={64} className="text-orange-300 mx-auto mb-6" />
                  <h3 className="text-2xl font-bold text-white mb-4">
                    素晴らしい！
                  </h3>
                  <p className="text-white/70">
                    今日のタスクはすべて完了しています。<br />
                    新しい目標を設定して、さらに成長しましょう！
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Motivational Quote */}
        <div className="max-w-4xl mx-auto mt-16">
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-amber-600/20 to-orange-600/20 rounded-3xl blur-xl opacity-50 group-hover:opacity-70 transition-opacity duration-500" />
            
            <div className="relative backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-8 shadow-2xl text-center">
              <Star size={32} className="text-yellow-400 mx-auto mb-4" />
              <blockquote className="text-xl font-medium text-white/90 italic mb-4">
                "今日という日は、残りの人生の最初の日である"
              </blockquote>
              <cite className="text-white/60 text-sm">— アメリカの格言</cite>
            </div>
          </div>
        </div>
      </div>

      {/* Custom styles for animations */}
      <style jsx>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-shimmer {
          animation: shimmer 2s infinite;
        }
        .animate-spin-slow {
          animation: spin-slow 25s linear infinite;
        }
      `}</style>
    </div>
  );
}

export default TodayTasks;