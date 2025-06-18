import { useState, useEffect } from 'react';
import { 
  ChevronDown, 
  ChevronUp, 
  CheckCircle2, 
  Circle, 
  Target, 
  Clock, 
  ArrowLeft, 
  Flag, 
  User, 
  Sparkles,
  Trophy,
  Calendar,
  BarChart3,
  Zap,
  Star,
  Award,
  TrendingUp,
  Lightbulb,
  ArrowRight,
  CheckCircle
} from 'lucide-react';

function GoalPlan({ planData, onBack, onEditGoal, onShowTodayTasks, completedTasks, onToggleTask }) {
  const [expandedMidGoals, setExpandedMidGoals] = useState(new Set([1, 2, 3])); // デフォルトで最初の3つを展開
  const [animatedCards, setAnimatedCards] = useState(new Set());
  const [showCelebration, setShowCelebration] = useState(false);

  // アニメーション用のマウント効果
  useEffect(() => {
    const timer = setTimeout(() => {
      planData?.mid_goals?.forEach((goal, index) => {
        setTimeout(() => {
          setAnimatedCards(prev => new Set([...prev, goal.id]));
        }, index * 200);
      });
    }, 300);
    return () => clearTimeout(timer);
  }, [planData]);

  // 進捗計算
  const calculateProgress = () => {
    if (!planData?.mid_goals) return { completed: 0, total: 0, percentage: 0 };
    
    let totalTasks = 0;
    let completedTasksCount = 0;
    
    planData.mid_goals.forEach(midGoal => {
      midGoal.small_goals?.forEach(smallGoal => {
        if (smallGoal.tasks) {
          totalTasks += smallGoal.tasks.length;
          smallGoal.tasks.forEach((_, taskIndex) => {
            const taskId = `${midGoal.id}-${smallGoal.id}-${taskIndex}`;
            if (completedTasks?.has(taskId)) {
              completedTasksCount++;
            }
          });
        }
      });
    });
    
    return {
      completed: completedTasksCount,
      total: totalTasks,
      percentage: totalTasks > 0 ? Math.round((completedTasksCount / totalTasks) * 100) : 0
    };
  };

  const progress = calculateProgress();

  const toggleMidGoal = (midGoalId) => {
    const newExpanded = new Set(expandedMidGoals);
    if (newExpanded.has(midGoalId)) {
      newExpanded.delete(midGoalId);
    } else {
      newExpanded.add(midGoalId);
    }
    setExpandedMidGoals(newExpanded);
  };

  const toggleTask = (taskId) => {
    if (onToggleTask) {
      onToggleTask(taskId);
      // 完了時のお祝いアニメーション
      if (!completedTasks?.has(taskId)) {
        if (Math.random() > 0.7) { // 30%の確率でお祝い
          setShowCelebration(true);
          setTimeout(() => setShowCelebration(false), 3000);
        }
      }
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
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-conic from-purple-500/5 via-blue-500/5 to-purple-500/5 rounded-full blur-3xl animate-spin-slow" />
      </div>

      {/* Celebration Animation */}
      {showCelebration && (
        <div className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center">
          <div className="relative">
            {[...Array(20)].map((_, i) => (
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
            <div className="text-4xl animate-bounce">🎉</div>
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
              <span className="font-medium">戻る</span>
            </button>

            <div className="text-center flex-1">
              <h1 className="text-3xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-200 via-pink-200 to-purple-200 drop-shadow-lg">
                Goal Achievement Roadmap
              </h1>
              <p className="text-purple-200/80 mt-2">あなたの成功への道筋</p>
            </div>

            <div className="flex space-x-3">
              <button
                onClick={onShowTodayTasks}
                className="group px-6 py-3 bg-gradient-to-r from-orange-600 to-yellow-600 text-white rounded-xl font-medium hover:from-orange-500 hover:to-yellow-500 transition-all duration-300 hover:scale-105 hover:shadow-2xl"
              >
                <div className="flex items-center space-x-2">
                  <Calendar size={18} />
                  <span>今日のタスク</span>
                </div>
              </button>
              
              <button
                onClick={onEditGoal}
                className="group px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-medium hover:from-purple-500 hover:to-pink-500 transition-all duration-300 hover:scale-105 hover:shadow-2xl"
              >
                <div className="flex items-center space-x-2">
                  <Sparkles size={18} />
                  <span>目標を編集</span>
                </div>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="relative z-10 container mx-auto px-6 py-12">
        {/* Hero Goal Section */}
        <div className="text-center mb-12">
          <div className="relative inline-block group">
            {/* Glow effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-3xl blur-xl opacity-50 group-hover:opacity-70 transition-opacity duration-500" />
            
            <div className="relative backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-8 shadow-2xl">
              <div className="flex items-center justify-center space-x-6 mb-6">
                <Trophy size={32} className="text-yellow-400" />
                <Flag size={40} className="text-purple-300" />
                <Target size={48} className="text-pink-400" />
                <Flag size={40} className="text-purple-300" />
                <Award size={32} className="text-yellow-400" />
              </div>
              
              <h2 className="text-2xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-purple-200 to-pink-200 mb-4 leading-tight">
                {planData.goal}
              </h2>
              
              <div className="flex items-center justify-center space-x-8 text-white/80">
                <div className="flex items-center space-x-2">
                  <Calendar size={20} className="text-purple-300" />
                  <span className="font-medium">期間: {planData.estimated_period}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <BarChart3 size={20} className="text-pink-300" />
                  <span className="font-medium">進捗: {progress.percentage}%</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Zap size={20} className="text-yellow-300" />
                  <span className="font-medium">{planData.mid_goals.length} ステップ</span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mt-6">
                <div className="flex justify-between text-sm text-white/70 mb-2">
                  <span>全体進捗</span>
                  <span>{progress.completed}/{progress.total} タスク完了</span>
                </div>
                <div className="relative w-full h-4 bg-white/10 rounded-full overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-white/10 rounded-full" />
                  <div 
                    className="h-full bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500 rounded-full transition-all duration-1000 ease-out relative overflow-hidden"
                    style={{ width: `${progress.percentage}%` }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Roadmap Timeline */}
        <div className="max-w-6xl mx-auto">
          <div className="relative">
            {/* Main Timeline Line */}
            <div className="absolute left-12 top-0 bottom-0 w-1 bg-gradient-to-b from-purple-500 via-pink-500 to-purple-500 rounded-full shadow-lg">
              <div className="absolute inset-0 bg-gradient-to-b from-purple-400 via-pink-400 to-purple-400 rounded-full animate-pulse opacity-50" />
            </div>
            
            {planData.mid_goals.map((midGoal, index) => (
              <div 
                key={midGoal.id} 
                className={`relative mb-12 last:mb-0 transform transition-all duration-700 ${
                  animatedCards.has(midGoal.id) 
                    ? 'translate-x-0 opacity-100' 
                    : 'translate-x-8 opacity-0'
                }`}
                style={{ transitionDelay: `${index * 200}ms` }}
              >
                {/* Timeline Node */}
                <div className="absolute left-8 top-8 w-8 h-8 -ml-4 z-20">
                  <div className="relative w-full h-full">
                    {/* Main node */}
                    <div className="relative w-full h-full bg-gradient-to-r from-purple-600 to-pink-600 rounded-full border-4 border-white shadow-2xl flex items-center justify-center">
                      <span className="text-white font-black text-sm">{midGoal.id}</span>
                    </div>
                  </div>
                </div>

                {/* Mid Goal Card */}
                <div className="ml-24">
                  <div className="group relative">
                    {/* Card glow effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    
                    <div className="relative backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-6 shadow-2xl hover:shadow-purple-500/25 transition-all duration-500 hover:scale-[1.02] hover:border-white/30">
                      <button
                        onClick={() => toggleMidGoal(midGoal.id)}
                        className="w-full text-left"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-4 mb-4">
                              <div className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full font-bold text-sm shadow-lg">
                                ステップ {midGoal.id}
                              </div>
                              <div className="flex items-center space-x-2 text-white/60">
                                <Clock size={16} />
                                <span className="text-sm font-medium">{midGoal.estimated_duration}</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                {[...Array(5)].map((_, i) => (
                                  <Star 
                                    key={i} 
                                    size={16} 
                                    className={`${i < (index % 3 + 3) ? 'text-yellow-400 fill-current' : 'text-gray-400'}`} 
                                  />
                                ))}
                              </div>
                            </div>
                            
                            <h3 className="text-xl md:text-2xl font-bold text-white mb-3 leading-tight group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-purple-200 group-hover:to-pink-200 transition-all duration-300">
                              {midGoal.title}
                            </h3>
                            
                            <p className="text-white/80 leading-relaxed">
                              {midGoal.description}
                            </p>
                          </div>
                          
                          <div className="ml-6 mt-2">
                            <div className="p-3 rounded-xl bg-white/10 group-hover:bg-white/20 transition-all duration-300">
                              {expandedMidGoals.has(midGoal.id) ? (
                                <ChevronUp size={24} className="text-purple-300" />
                              ) : (
                                <ChevronDown size={24} className="text-white/60" />
                              )}
                            </div>
                          </div>
                        </div>
                      </button>

                      {/* Small Goals - Expandable Content */}
                      {expandedMidGoals.has(midGoal.id) && (
                        <div className="mt-6 space-y-4 border-t border-white/10 pt-6">
                          {midGoal.small_goals.map((smallGoal, sgIndex) => (
                            <div 
                              key={smallGoal.id} 
                              className={`transform transition-all duration-500 ${
                                expandedMidGoals.has(midGoal.id) 
                                  ? 'translate-y-0 opacity-100' 
                                  : 'translate-y-4 opacity-0'
                              }`}
                              style={{ transitionDelay: `${sgIndex * 100}ms` }}
                            >
                              <div className="group/small relative">
                                {/* Small goal glow */}
                                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-2xl blur-lg opacity-0 group-hover/small:opacity-100 transition-opacity duration-300" />
                                
                                <div className="relative backdrop-blur-sm bg-white/5 border border-white/10 rounded-2xl p-4 hover:bg-white/10 hover:border-white/20 transition-all duration-300">
                                  <div className="flex items-start space-x-4 mb-4">
                                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center shadow-lg">
                                      <span className="text-white font-bold">{smallGoal.id}</span>
                                    </div>
                                    
                                    <div className="flex-1">
                                      <h4 className="text-lg font-bold text-white mb-2 group-hover/small:text-transparent group-hover/small:bg-clip-text group-hover/small:bg-gradient-to-r group-hover/small:from-blue-200 group-hover/small:to-purple-200 transition-all duration-300">
                                        {smallGoal.title}
                                      </h4>
                                      <p className="text-white/70 leading-relaxed">
                                        {smallGoal.description}
                                      </p>
                                    </div>
                                  </div>

                                  {/* Tasks */}
                                  {smallGoal.tasks && smallGoal.tasks.length > 0 && (
                                    <div className="space-y-3">
                                      <h5 className="text-base font-bold text-white flex items-center space-x-3">
                                        <div className="w-5 h-5 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-lg flex items-center justify-center">
                                          <Lightbulb size={12} className="text-white" />
                                        </div>
                                        <span>実行タスク</span>
                                        <div className="flex-1 h-px bg-gradient-to-r from-white/20 to-transparent" />
                                      </h5>
                                      
                                      <div className="grid gap-2">
                                        {smallGoal.tasks.map((task, taskIndex) => {
                                          const taskId = `${midGoal.id}-${smallGoal.id}-${taskIndex}`;
                                          const isCompleted = completedTasks?.has(taskId);
                                          
                                          return (
                                            <div 
                                              key={taskIndex} 
                                              className={`group/task relative transform transition-all duration-300 hover:scale-[1.02] ${
                                                isCompleted ? 'scale-95 opacity-80' : ''
                                              }`}
                                            >
                                              {/* Task completion glow */}
                                              {isCompleted && (
                                                <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 rounded-xl blur-sm" />
                                              )}
                                              
                                              <div className={`relative flex items-start space-x-3 p-3 rounded-xl border transition-all duration-300 ${
                                                isCompleted 
                                                  ? 'bg-emerald-500/10 border-emerald-500/30 shadow-emerald-500/20' 
                                                  : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20 hover:shadow-lg'
                                              }`}>
                                                <button
                                                  onClick={() => toggleTask(taskId)}
                                                  className="relative mt-1 group/check"
                                                >
                                                  <div className={`absolute inset-0 rounded-full transition-all duration-300 ${
                                                    isCompleted ? 'bg-emerald-500/20 scale-150' : 'bg-white/10 scale-100 group-hover/check:scale-125'
                                                  }`} />
                                                  {isCompleted ? (
                                                    <CheckCircle2 size={24} className="relative text-emerald-400" />
                                                  ) : (
                                                    <Circle size={24} className="relative text-white/40 group-hover/check:text-purple-400 transition-colors duration-200" />
                                                  )}
                                                </button>
                                                
                                                <div className="flex-1 min-w-0">
                                                  <p className={`text-sm leading-relaxed transition-all duration-300 ${
                                                    isCompleted 
                                                      ? 'text-white/60 line-through' 
                                                      : 'text-white/90 font-medium group-hover/task:text-white'
                                                  }`}>
                                                    {task}
                                                  </p>
                                                  
                                                  {isCompleted && (
                                                    <div className="flex items-center space-x-2 mt-1 text-emerald-400 text-xs">
                                                      <CheckCircle size={14} />
                                                      <span className="font-medium">完了</span>
                                                    </div>
                                                  )}
                                                </div>
                                                
                                                {!isCompleted && (
                                                  <div className="opacity-0 group-hover/task:opacity-100 transition-opacity duration-200">
                                                    <ArrowRight size={16} className="text-purple-400" />
                                                  </div>
                                                )}
                                              </div>
                                            </div>
                                          );
                                        })}
                                      </div>
                                    </div>
                                  )}

                                  {/* Success Criteria */}
                                  {smallGoal.success_criteria && (
                                    <div className="mt-4">
                                      <div className="relative group/criteria">
                                        <div className="absolute inset-0 bg-gradient-to-r from-amber-500/10 to-orange-500/10 rounded-xl blur-sm opacity-0 group-hover/criteria:opacity-100 transition-opacity duration-300" />
                                        
                                        <div className="relative p-4 bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/30 rounded-xl">
                                          <div className="flex items-start space-x-3">
                                            <div className="w-8 h-8 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full flex items-center justify-center shadow-lg">
                                              <Target size={16} className="text-white" />
                                            </div>
                                            
                                            <div className="flex-1">
                                              <div className="flex items-center space-x-2 mb-2">
                                                <span className="text-xs font-black text-amber-300 uppercase tracking-wider">達成基準</span>
                                                <TrendingUp size={12} className="text-amber-400" />
                                              </div>
                                              <p className="text-amber-100 leading-relaxed text-sm">
                                                {smallGoal.success_criteria}
                                              </p>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
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
              </div>
            ))}
          </div>
        </div>

        {/* Success Tips Section */}
        {planData.tips && planData.tips.length > 0 && (
          <div className="max-w-6xl mx-auto mt-16">
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-600/20 to-teal-600/20 rounded-3xl blur-xl opacity-50 group-hover:opacity-70 transition-opacity duration-500" />
              
              <div className="relative backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-8 shadow-2xl">
                <div className="text-center mb-8">
                  <div className="inline-flex items-center space-x-3 mb-4">
                    <User size={32} className="text-emerald-400" />
                    <h3 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-200 to-teal-200">
                      成功のためのアドバイス
                    </h3>
                    <Lightbulb size={32} className="text-yellow-400" />
                  </div>
                  <p className="text-white/70">専門家からの特別なアドバイス</p>
                </div>
                
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {planData.tips.map((tip, index) => (
                    <div 
                      key={index} 
                      className="group/tip relative transform transition-all duration-500 hover:scale-105"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-teal-500/10 to-emerald-500/10 rounded-2xl blur-lg opacity-0 group-hover/tip:opacity-100 transition-opacity duration-300" />
                      
                      <div className="relative flex items-start space-x-4 p-6 backdrop-blur-sm bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 hover:border-white/20 transition-all duration-300">
                        <div className="w-12 h-12 bg-gradient-to-r from-teal-500 to-emerald-500 text-white rounded-full flex items-center justify-center text-lg font-black shadow-lg flex-shrink-0">
                          {index + 1}
                        </div>
                        
                        <div className="flex-1">
                          <p className="text-white/90 leading-relaxed font-medium group-hover/tip:text-white transition-colors duration-300">
                            {tip}
                          </p>
                        </div>
                        
                        <div className="opacity-0 group-hover/tip:opacity-100 transition-opacity duration-300">
                          <Sparkles size={20} className="text-emerald-400" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
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
          animation: spin-slow 20s linear infinite;
        }
      `}</style>
    </div>
  );
}

export default GoalPlan;