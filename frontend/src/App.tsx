import React, { useState } from 'react';
import { ChevronDown, ChevronUp, CheckCircle2, Circle, Target, ListChecks } from 'lucide-react';

interface Task {
  id: string;
  title: string;
  completed: boolean;
}

interface Step {
  id: string;
  title: string;
  tasks: Task[];
  completed: boolean;
}

function App() {
  const [activeTab, setActiveTab] = useState('roadmap');
  const [expandedSteps, setExpandedSteps] = useState<string[]>([]);

  // Sample data - in a real app this would come from your backend
  const goal = "Become a Senior Full Stack Developer in 12 months";
  const steps: Step[] = [
    {
      id: '3',
      title: 'DevOps and Deployment',
      completed: false,
      tasks: [
        { id: '3-1', title: 'Learn Docker and Containerization', completed: false },
        { id: '3-2', title: 'Master CI/CD Pipelines', completed: false },
        { id: '3-3', title: 'Study Cloud Services', completed: false },
      ]
    },
    {
      id: '2',
      title: 'Backend Development Expertise',
      completed: false,
      tasks: [
        { id: '2-1', title: 'Master Node.js and Express', completed: false },
        { id: '2-2', title: 'Learn Database Design', completed: false },
        { id: '2-3', title: 'Study API Security', completed: false },
      ]
    },
    {
      id: '1',
      title: 'Master Advanced Frontend Development',
      completed: true,
      tasks: [
        { id: '1-1', title: 'Learn Advanced React Patterns', completed: true },
        { id: '1-2', title: 'Master State Management', completed: true },
        { id: '1-3', title: 'Study Modern CSS Architecture', completed: true },
      ]
    }
  ];

  const toggleStep = (stepId: string) => {
    setExpandedSteps(prev =>
      prev.includes(stepId)
        ? prev.filter(id => id !== stepId)
        : [...prev, stepId]
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Header */}
      <header className="bg-white shadow-sm">
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
                <Target size={18} />
                <span>Roadmap</span>
              </div>
            </button>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 py-8">
        {/* Goal Section */}
        <div className="text-center mb-12">
          <div className="inline-block bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg p-1 mb-4">
            <div className="bg-white rounded-md px-4 py-2">
              <Target size={32} className="text-blue-600 mx-auto mb-2" />
              <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                {goal}
              </h1>
            </div>
          </div>
          <p className="text-gray-600">Your journey starts from the bottom</p>
        </div>

        {/* Roadmap */}
        <div className="relative">
          {/* Vertical Line */}
          <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-600 to-blue-200 md:left-1/2" />

          {/* Steps */}
          <div className="space-y-8">
            {steps.map((step, index) => (
              <div key={step.id} className="relative">
                {/* Step Card */}
                <div className={`
                  bg-white rounded-lg shadow-md p-6 ml-12 md:w-[calc(50%-20px)]
                  ${index % 2 === 0 ? 'md:ml-0' : 'md:ml-[calc(50%+20px)]'}
                  transition-all duration-300 hover:shadow-lg
                `}>
                  {/* Connection Line */}
                  <div className={`
                    absolute top-1/2 left-4 w-8 h-0.5 bg-gradient-to-r from-blue-600 to-blue-200
                    md:w-[20px] ${index % 2 === 0 ? 'md:left-[calc(100%+1px)]' : 'md:right-[calc(100%+1px)] md:left-auto'}
                  `} />

                  {/* Step Marker */}
                  <div className={`
                    absolute left-2 top-1/2 transform -translate-y-1/2 w-4 h-4 rounded-full
                    md:left-[calc(50vw-10px)]
                    ${step.completed ? 'bg-green-500' : 'bg-gradient-to-r from-blue-600 to-indigo-600'}
                  `} />

                  {/* Step Content */}
                  <button
                    onClick={() => toggleStep(step.id)}
                    className="w-full text-left group"
                  >
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                        {step.title}
                      </h3>
                      {expandedSteps.includes(step.id) ? (
                        <ChevronUp className="text-gray-500 group-hover:text-blue-600 transition-colors" size={20} />
                      ) : (
                        <ChevronDown className="text-gray-500 group-hover:text-blue-600 transition-colors" size={20} />
                      )}
                    </div>
                  </button>

                  {/* Tasks */}
                  {expandedSteps.includes(step.id) && (
                    <div className="mt-4 space-y-2">
                      {step.tasks.map(task => (
                        <div
                          key={task.id}
                          className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded transition-colors"
                        >
                          {task.completed ? (
                            <CheckCircle2 className="text-green-500\" size={20} />
                          ) : (
                            <Circle className="text-gray-300" size={20} />
                          )}
                          <span className={`
                            ${task.completed ? 'text-gray-500 line-through' : 'text-gray-700'}
                          `}>
                            {task.title}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;