import { useState } from 'react'
import { ChevronDown, ChevronUp, CheckCircle2, Circle, Target, ListChecks, Flag} from 'lucide-react';


const tasks = {
  todo: ["タスク1", "タスク2", "タスク3"],
  inProgress: ["タスク4", "タスク5"],
  done: ["タスク6"],
};

function TodaysTask() {
  return (
    <div>
      <h2 style={{ textAlign: "center" }}>Todays Task</h2>
      <div style={{ display: "flex", justifyContent: "center", gap: "20px", marginTop: 20 }}>
        <TaskColumn title="未完了タスク" tasks={tasks.todo} />
        <TaskColumn title="進行中タスク" tasks={tasks.inProgress} />
        <TaskColumn title="完了タスク" tasks={tasks.done} />
      </div>
    </div>
  );
}

function TaskColumn({ title, tasks }) {
  return (
    <div style={{ width: 200, border: "1px solid #ccc", borderRadius: 4, padding: 10 }}>
      <h3>{title}</h3>
      <ul>
        {tasks.map((task, i) => (
          <li key={i}>{task}</li>
        ))}
      </ul>
    </div>
  );
}

function LoadMap() {
  return (
    <div style={{ textAlign: "center", marginTop: 40 }}>
      <h2>Load Map Page</h2>
      <p>ここにLoad Mapのコンテンツを追加</p>
    </div>
  );
}


function App() {
  const [activeTab, setActiveTab] = useState('roadmap');

  const [page, setPage] = useState("todaysTask");

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
                <Flag size={18} />
                <span>Roadmap</span>
              </div>
            </button>
          </nav>
        </div>
      </header>
      
      

      <p className="text-blue-600 font-bold text-7xl text-center">
        You Can Do it! Agent
      </p>

      <div>
        <nav style={{ display: "flex", justifyContent: "center", gap: 30, padding: 20, borderBottom: "1px solid #ddd" }}>
          <button onClick={() => setPage("todaysTask")} style={{ fontWeight: page === "todaysTask" ? "bold" : "normal" }}>
            Todays Task
          </button>
          <button onClick={() => setPage("loadMap")} style={{ fontWeight: page === "loadMap" ? "bold" : "normal" }}>
            Load Map
          </button>
        </nav>

        <main>
          {page === "todaysTask" && <TodaysTask />}
          {page === "loadMap" && <LoadMap />}
        </main>
      </div>

    </div>
  )
}

export default App
