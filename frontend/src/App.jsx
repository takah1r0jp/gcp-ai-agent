import { useState } from 'react'
import { ChevronDown, ChevronUp, CheckCircle2, Circle, Target, ListChecks, Flag} from 'lucide-react';


function App() {
  const [activeTab, setActiveTab] = useState('roadmap');

  const goal = "Become a Senior Full Stack Developer in 12 months"

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">

      {/* Header */}
      <header className="bg-white shadow-sm">
        <h1 className="text-blue-600 font-bold text-6xl text-center mt-5 mb-5">You Can Do it! Agent</h1>
        <div className="max-w-5xl mx-auto px-4">
          <nav className="flex space-x-1">
            <button 
              onClick={() => setActiveTab('tasks')}
              className={`px-4 py-3 text-sm font-medium ${
                activeTab === 'tasks'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <div className="flex items-center space-x-2">
                <ListChecks size={18} />
                <span>Today's Tasks</span>
              </div>
            </button> 
            <button
              onClick={() => setActiveTab('roadmap')}
              className={`px-4 py-3 text-sm font-medium ${
                activeTab === 'roadmap'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <div className="flex items-center space-x-2">
                <Flag size={18} />
                <span>Roadmap</span>
              </div>
            </button>
          </nav>
        </div>
      </header>
      

      {/* Goal Section */}
      <div className="text-center mb-12 mt-12 mx-auto">
        <div className="inline-block bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-1 mb-4">
          <div className="bg-white rounded-md px-4 py-2">
            <div className="flex items-end justify-center space-x-4 mb-2">
              <Flag size={24} className="text-blue-600" />
              <Flag size={30} className="text-blue-600" />
              <Flag size={36} className="text-blue-600" />
            </div>
            <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                {goal}
            </h1>
          </div>
        </div>
        <p className="text-gray-600">Your journey starts from the bottom</p>     
      </div>
      
      {/* Next Task 
      - ロードマップのコンポーネント設計
        - ステップ
          - タスク
            - タスクの進行状況
      */}

      {/* Road Map */}
      <div className="relative">
        {/* Vertical Line */}
        <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-600 to-blue-200 md:left-1/2" />
        <p><br></br><br></br><br></br></p>

        {/* Steps  */}
        <div className=""></div>

      </div>


    </div>
  )
}

export default App
