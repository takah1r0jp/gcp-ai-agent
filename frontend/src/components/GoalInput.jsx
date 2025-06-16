import { useState, useEffect } from 'react';
import { 
  Target, 
  ArrowRight, 
  Sparkles, 
  Lightbulb, 
  Calendar,
  Star,
  Award,
  Trophy,
  Flag,
  Zap,
  Rocket,
  Brain,
  Heart,
  Check,
  ChevronRight,
  Clock,
  TrendingUp,
  CalendarDays,
  X
} from 'lucide-react';

function GoalInput({ onGoalSubmit, isLoading }) {
  const [goal, setGoal] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [animatedElements, setAnimatedElements] = useState(new Set());
  const [focusedField, setFocusedField] = useState(null);

  // アニメーション用のマウント効果
  useEffect(() => {
    const elements = ['hero', 'form', 'examples', 'features'];
    elements.forEach((element, index) => {
      setTimeout(() => {
        setAnimatedElements(prev => new Set([...prev, element]));
      }, index * 200 + 300);
    });
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (goal.trim()) {
      const goalData = {
        goal: goal.trim(),
        deadline: selectedDate || null
      };
      onGoalSubmit(goalData);
    }
  };

  // 今日の日付を取得（最小日付として使用）
  const today = new Date().toISOString().split('T')[0];
  
  // 1年後の日付を取得（推奨最大日付として使用）
  const oneYearLater = new Date();
  oneYearLater.setFullYear(oneYearLater.getFullYear() + 1);
  const maxDate = oneYearLater.toISOString().split('T')[0];

  // 日付フォーマット関数
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'short'
    });
  };

  // 期間計算関数
  const calculatePeriod = (dateString) => {
    if (!dateString) return '';
    const targetDate = new Date(dateString);
    const today = new Date();
    const diffTime = targetDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return '過去の日付です';
    if (diffDays === 0) return '今日';
    if (diffDays === 1) return '明日';
    if (diffDays <= 7) return `${diffDays}日後`;
    if (diffDays <= 30) return `約${Math.ceil(diffDays / 7)}週間後`;
    if (diffDays <= 365) return `約${Math.ceil(diffDays / 30)}ヶ月後`;
    return `約${Math.ceil(diffDays / 365)}年後`;
  };

  const goalExamples = [
    {
      category: '🎯 スキルアップ',
      goals: [
        'TOEIC 800点を取得する',
        'Pythonでウェブアプリを作れるようになる',
        'Webデザインのスキルを身につける',
        'データサイエンスを学ぶ'
      ]
    },
    {
      category: '📚 資格・試験',
      goals: [
        '基本情報技術者試験に合格する',
        '簿記2級を取得する',
        'AWS認定を取得する',
        'Google Analytics認定を取得する'
      ]
    },
    {
      category: '💪 健康・スポーツ',
      goals: [
        'フルマラソンを完走する',
        '10kg減量する',
        '腹筋を割る',
        'ヨガインストラクターになる'
      ]
    },
    {
      category: '🌟 ライフスタイル',
      goals: [
        '英語を流暢に話せるようになる',
        '副業で月10万円稼ぐ',
        'ブログで1万PV達成する',
        '新しい趣味を見つける'
      ]
    }
  ];

  const handleExampleClick = (example) => {
    setGoal(example);
    // 選択時の微細なフィードバック
    const textarea = document.getElementById('goal');
    if (textarea) {
      textarea.focus();
      textarea.classList.add('animate-pulse');
      setTimeout(() => textarea.classList.remove('animate-pulse'), 500);
    }
  };

  const features = [
    {
      icon: Brain,
      title: 'AI による分析',
      description: '最新のAI技術で目標を詳細に分析し、最適な学習プランを生成',
      color: 'from-purple-500 to-blue-500'
    },
    {
      icon: Target,
      title: '具体的なステップ',
      description: '大きな目標を実行可能な小さなタスクに細分化して提示',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: TrendingUp,
      title: '継続的サポート',
      description: '進捗管理とモチベーション維持で目標達成まで完全サポート',
      color: 'from-cyan-500 to-teal-500'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-conic from-purple-500/5 via-blue-500/5 to-purple-500/5 rounded-full blur-3xl animate-spin-slow" />
      </div>

      <div className="relative z-10 container mx-auto px-6 py-12">
        {/* Hero Section */}
        <div className={`text-center mb-16 transform transition-all duration-1000 ${
          animatedElements.has('hero') ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
        }`}>
          <div className="relative inline-block group mb-8">
            {/* Glow effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full blur-2xl opacity-30 group-hover:opacity-50 transition-opacity duration-500" />
            
            <div className="relative w-24 h-24 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center shadow-2xl">
              <Target size={48} className="text-white" />
            </div>
          </div>

          <h1 className="text-5xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-purple-200 to-pink-200 mb-6 leading-tight">
            Your Dreams
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-purple-300 via-pink-300 to-purple-300">
              Start Here
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-white/70 max-w-3xl mx-auto leading-relaxed">
            あなたの目標を教えてください。AIが
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-pink-300 font-semibold">
              最適な成功への道筋
            </span>
            を作成します
          </p>

          {/* Stats */}
          <div className="flex items-center justify-center space-x-12 mt-12">
            <div className="text-center">
              <div className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">
                10,000+
              </div>
              <div className="text-white/60 text-sm font-medium">目標達成者</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-500">
                95%
              </div>
              <div className="text-white/60 text-sm font-medium">成功率</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-500">
                24/7
              </div>
              <div className="text-white/60 text-sm font-medium">AIサポート</div>
            </div>
          </div>
        </div>

        {/* Main Form */}
        <div className={`max-w-4xl mx-auto transform transition-all duration-1000 delay-200 ${
          animatedElements.has('form') ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
        }`}>
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Goal Input Card */}
            <div className="relative group">
              {/* Card glow effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-3xl blur-xl opacity-50 group-hover:opacity-70 transition-opacity duration-500" />
              
              <div className="relative backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-10 shadow-2xl">
                <div className="flex items-center space-x-4 mb-6">
                  <div className="relative">
                    <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center shadow-lg">
                      <Sparkles size={24} className="text-white" />
                    </div>
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold text-white">
                    あなたの目標を教えてください
                  </h2>
                </div>

                <div className="space-y-6">
                  <div>
                    <label htmlFor="goal" className="block text-lg font-semibold text-white/90 mb-4">
                      目標
                    </label>
                    <div className="relative">
                      <textarea
                        id="goal"
                        value={goal}
                        onChange={(e) => setGoal(e.target.value)}
                        onFocus={() => setFocusedField('goal')}
                        onBlur={() => setFocusedField(null)}
                        placeholder="例：TOEIC 800点を取得する、Pythonでウェブアプリを作れるようになる..."
                        className={`w-full p-6 bg-white/5 border-2 rounded-2xl focus:outline-none transition-all duration-300 text-lg resize-none text-white placeholder-white/40 ${
                          focusedField === 'goal' 
                            ? 'border-purple-500 bg-white/10 shadow-lg shadow-purple-500/20' 
                            : 'border-white/20 hover:border-white/30'
                        }`}
                        rows="4"
                        required
                        disabled={isLoading}
                      />
                      {focusedField === 'goal' && (
                        <div className="absolute inset-0 rounded-2xl border-2 border-purple-500/50 pointer-events-none">
                          <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-500/10 to-pink-500/10" />
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-lg font-semibold text-white/90 mb-6">
                      <div className="flex items-center space-x-2">
                        <Calendar size={20} className="text-purple-300" />
                        <span>目標達成期限（任意）</span>
                      </div>
                    </label>

                    <div className="space-y-4">
                      <div className="relative">
                        <input
                          type="date"
                          value={selectedDate}
                          onChange={(e) => setSelectedDate(e.target.value)}
                          onFocus={() => setFocusedField('date')}
                          onBlur={() => setFocusedField(null)}
                          min={today}
                          max={maxDate}
                          className={`w-full p-6 bg-white/5 border-2 rounded-2xl focus:outline-none transition-all duration-300 text-lg text-white ${
                            focusedField === 'date' 
                              ? 'border-purple-500 bg-white/10 shadow-lg shadow-purple-500/20' 
                              : 'border-white/20 hover:border-white/30'
                          }`}
                          disabled={isLoading}
                        />
                        {focusedField === 'date' && (
                          <div className="absolute inset-0 rounded-2xl border-2 border-purple-500/50 pointer-events-none">
                            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-500/10 to-pink-500/10" />
                          </div>
                        )}
                      </div>

                      {/* Date Preview */}
                      {selectedDate && (
                        <div className="relative group">
                          <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 rounded-xl blur-sm opacity-50 group-hover:opacity-70 transition-opacity duration-300" />
                          
                          <div className="relative p-4 bg-white/5 border border-emerald-500/30 rounded-xl">
                            <div className="flex items-center justify-between">
                              <div>
                                <div className="text-emerald-300 font-semibold">
                                  目標達成日
                                </div>
                                <div className="text-white text-lg font-bold">
                                  {formatDate(selectedDate)}
                                </div>
                                <div className="text-emerald-400 text-sm">
                                  {calculatePeriod(selectedDate)}
                                </div>
                              </div>
                              <div className="text-emerald-400">
                                <CalendarDays size={24} />
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Quick Date Shortcuts */}
                      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                        {[
                          { label: '1週間後', days: 7 },
                          { label: '1ヶ月後', days: 30 },
                          { label: '3ヶ月後', days: 90 },
                          { label: '半年後', days: 180 },
                          { label: '1年後', days: 365 }
                        ].map((shortcut, index) => {
                          const shortcutDate = new Date();
                          shortcutDate.setDate(shortcutDate.getDate() + shortcut.days);
                          const dateString = shortcutDate.toISOString().split('T')[0];
                          
                          return (
                            <button
                              key={index}
                              type="button"
                              onClick={() => setSelectedDate(dateString)}
                              className="p-3 bg-white/5 border border-white/10 rounded-lg text-white/80 text-sm font-medium hover:bg-white/10 hover:border-white/20 hover:text-white transition-all duration-300"
                              disabled={isLoading}
                            >
                              {shortcut.label}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="text-center">
              <button
                type="submit"
                disabled={!goal.trim() || isLoading}
                className="group relative inline-flex items-center space-x-4 bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 text-white px-12 py-6 rounded-2xl font-bold text-xl shadow-2xl hover:shadow-purple-500/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover:scale-105 disabled:hover:scale-100"
              >
                {/* Button glow effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl blur-xl opacity-50 group-hover:opacity-70 transition-opacity duration-300" />
                
                <div className="relative flex items-center space-x-4">
                  {isLoading ? (
                    <>
                      <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>AI が分析中...</span>
                    </>
                  ) : (
                    <>
                      <Rocket size={28} />
                      <span>目標達成プランを作成</span>
                      <ArrowRight size={28} className="group-hover:translate-x-1 transition-transform duration-300" />
                    </>
                  )}
                </div>
              </button>
            </div>
          </form>
        </div>

        {/* Goal Examples */}
        <div className={`max-w-6xl mx-auto mt-20 transform transition-all duration-1000 delay-400 ${
          animatedElements.has('examples') ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
        }`}>
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-amber-600/20 to-orange-600/20 rounded-3xl blur-xl opacity-50 group-hover:opacity-70 transition-opacity duration-500" />
            
            <div className="relative backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-10 shadow-2xl">
              <div className="text-center mb-10">
                <div className="inline-flex items-center space-x-3 mb-4">
                  <Lightbulb size={32} className="text-yellow-400" />
                  <h3 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 to-orange-200">
                    目標のインスピレーション
                  </h3>
                  <Star size={32} className="text-yellow-400" />
                </div>
                <p className="text-white/70 text-lg">人気の目標カテゴリーから選んでみてください</p>
              </div>

              <div className="grid gap-8 md:grid-cols-2">
                {goalExamples.map((category, categoryIndex) => (
                  <div 
                    key={categoryIndex}
                    className="group/category relative"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-white/10 rounded-2xl blur-sm opacity-0 group-hover/category:opacity-100 transition-opacity duration-300" />
                    
                    <div className="relative backdrop-blur-sm bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 hover:border-white/20 transition-all duration-300">
                      <h4 className="text-xl font-bold text-white mb-6 flex items-center space-x-2">
                        <span>{category.category}</span>
                      </h4>
                      
                      <div className="space-y-3">
                        {category.goals.map((example, index) => (
                          <button
                            key={index}
                            onClick={() => handleExampleClick(example)}
                            disabled={isLoading}
                            className="group/item w-full text-left p-4 border border-white/10 rounded-xl hover:border-purple-500/50 hover:bg-white/5 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <div className="flex items-center justify-between">
                              <span className="text-white/80 group-hover/item:text-white font-medium transition-colors duration-300">
                                {example}
                              </span>
                              <ChevronRight size={16} className="text-white/40 group-hover/item:text-purple-400 opacity-0 group-hover/item:opacity-100 transition-all duration-300" />
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className={`max-w-6xl mx-auto mt-20 transform transition-all duration-1000 delay-600 ${
          animatedElements.has('features') ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
        }`}>
          <div className="text-center mb-12">
            <h3 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-purple-200 to-pink-200 mb-4">
              なぜAI Goal Agentなのか？
            </h3>
            <p className="text-white/70 text-lg">最先端のAI技術で、あなたの目標達成を確実にサポート</p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              
              return (
                <div 
                  key={index}
                  className="group relative transform transition-all duration-500 hover:scale-105"
                  style={{ transitionDelay: `${index * 100}ms` }}
                >
                  {/* Feature glow */}
                  <div className={`absolute inset-0 bg-gradient-to-r ${feature.color} rounded-2xl blur-xl opacity-0 group-hover:opacity-20 transition-opacity duration-500`} />
                  
                  <div className="relative backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-8 text-center shadow-xl hover:shadow-2xl transition-all duration-300">
                    <div className="relative inline-block mb-6">
                      <div className={`w-16 h-16 bg-gradient-to-r ${feature.color} rounded-2xl flex items-center justify-center shadow-lg`}>
                        <Icon size={32} className="text-white" />
                      </div>
                    </div>
                    
                    <h4 className="text-xl font-bold text-white mb-4 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-purple-200 group-hover:to-pink-200 transition-all duration-300">
                      {feature.title}
                    </h4>
                    
                    <p className="text-white/70 leading-relaxed group-hover:text-white/90 transition-colors duration-300">
                      {feature.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center mt-20">
          <div className="inline-flex items-center space-x-2 text-white/60 text-sm">
            <Clock size={16} />
            <span>平均作成時間: 30秒</span>
            <span>•</span>
            <Check size={16} className="text-green-400" />
            <span>完全無料</span>
            <span>•</span>
            <Heart size={16} className="text-red-400" />
            <span>10,000+ ユーザーが愛用</span>
          </div>
        </div>
      </div>

      {/* Custom styles for animations */}
      <style jsx>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 20s linear infinite;
        }
      `}</style>
    </div>
  );
}

export default GoalInput;