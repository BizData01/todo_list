import { useState, useEffect, useCallback } from 'react';
import TodoForm from './components/TodoForm';
import TodoItem from './components/TodoItem';
import FilterBar from './components/FilterBar';
import WeeklyView from './components/WeeklyView';
import StatsBar from './components/StatsBar';
import './App.css';

const PRIORITY_ORDER = { urgent: 0, high: 1, medium: 2, low: 3 };

const todayLabel = () =>
  new Date().toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' });

function App() {
  const [todos, setTodos] = useState(() => {
    try {
      const raw = localStorage.getItem('todos');
      return raw ? JSON.parse(raw).map(t => ({ priority: 'medium', createdAt: Date.now(), ...t })) : [];
    } catch {
      return [];
    }
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [sortBy, setSortBy] = useState('created');
  const [viewMode, setViewMode] = useState('list');
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('theme');
    return saved ? saved === 'dark' : window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', darkMode ? 'dark' : 'light');
    localStorage.setItem('theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  const addTodo = useCallback((text, date, priority) => {
    setTodos(prev => [{
      id: Date.now(),
      text,
      date,
      priority: priority || 'medium',
      completed: false,
      createdAt: Date.now(),
    }, ...prev]);
  }, []);

  const updateTodo = useCallback((id, updates) => {
    setTodos(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t));
  }, []);

  const deleteTodo = useCallback((id) => {
    setTodos(prev => prev.filter(t => t.id !== id));
  }, []);

  const clearCompleted = useCallback(() => {
    setTodos(prev => prev.filter(t => !t.completed));
  }, []);

  const reorderTodos = useCallback((fromId, toId) => {
    setTodos(prev => {
      const next = [...prev];
      const fi = next.findIndex(t => t.id === fromId);
      const ti = next.findIndex(t => t.id === toId);
      if (fi < 0 || ti < 0 || fi === ti) return prev;
      const [item] = next.splice(fi, 1);
      next.splice(ti, 0, item);
      return next;
    });
  }, []);

  const filteredTodos = todos
    .filter(t => {
      if (filter === 'active') return !t.completed;
      if (filter === 'completed') return t.completed;
      return true;
    })
    .filter(t => priorityFilter === 'all' || t.priority === priorityFilter)
    .filter(t => t.text.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => {
      if (sortBy === 'priority') return (PRIORITY_ORDER[a.priority] ?? 4) - (PRIORITY_ORDER[b.priority] ?? 4);
      if (sortBy === 'date') {
        if (!a.date && !b.date) return 0;
        if (!a.date) return 1;
        if (!b.date) return -1;
        return a.date.localeCompare(b.date);
      }
      return (b.createdAt || 0) - (a.createdAt || 0);
    });

  const stats = {
    total: todos.length,
    completed: todos.filter(t => t.completed).length,
    active: todos.filter(t => !t.completed).length,
  };

  return (
    <div className="app-wrapper">
      <div className="app-container">
        <header className="app-header">
          <div className="header-left">
            <h1>할 일 목록</h1>
            <div className="date-text">{todayLabel()}</div>
          </div>
          <button className="theme-btn" onClick={() => setDarkMode(d => !d)} aria-label="테마 전환">
            {darkMode ? (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <circle cx="12" cy="12" r="5"/>
                <line x1="12" y1="1" x2="12" y2="3"/>
                <line x1="12" y1="21" x2="12" y2="23"/>
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
                <line x1="1" y1="12" x2="3" y2="12"/>
                <line x1="21" y1="12" x2="23" y2="12"/>
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
              </svg>
            )}
          </button>
        </header>

        <StatsBar stats={stats} />

        <div className="card mb-4">
          <TodoForm onAdd={addTodo} />
        </div>

        <div className="view-tabs mb-4">
          <button className={`view-tab ${viewMode === 'list' ? 'active' : ''}`} onClick={() => setViewMode('list')}>
            리스트
          </button>
          <button className={`view-tab ${viewMode === 'weekly' ? 'active' : ''}`} onClick={() => setViewMode('weekly')}>
            주간 뷰
          </button>
        </div>

        {viewMode === 'list' ? (
          <>
            <FilterBar
              searchTerm={searchTerm}
              onSearch={setSearchTerm}
              filter={filter}
              onFilter={setFilter}
              priorityFilter={priorityFilter}
              onPriorityFilter={setPriorityFilter}
              sortBy={sortBy}
              onSort={setSortBy}
              completedCount={stats.completed}
              onClearCompleted={clearCompleted}
            />
            <div className="todo-list">
              {filteredTodos.length === 0 ? (
                <div className="empty-state">
                  <svg viewBox="0 0 80 80" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <circle cx="40" cy="40" r="36" strokeDasharray="5 4"/>
                    <path d="M28 40h24M40 28v24" strokeLinecap="round"/>
                  </svg>
                  <p>{todos.length === 0 ? '할 일을 추가해보세요!' : '조건에 맞는 할 일이 없어요'}</p>
                </div>
              ) : (
                filteredTodos.map(todo => (
                  <TodoItem
                    key={todo.id}
                    todo={todo}
                    onUpdate={updateTodo}
                    onDelete={deleteTodo}
                    onReorder={reorderTodos}
                  />
                ))
              )}
            </div>
          </>
        ) : (
          <WeeklyView todos={todos} onUpdate={updateTodo} onDelete={deleteTodo} />
        )}
      </div>
    </div>
  );
}

export default App;
