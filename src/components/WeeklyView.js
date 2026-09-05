import { useState } from 'react';

const DAY_NAMES = ['일', '월', '화', '수', '목', '금', '토'];

function getWeekStart(date) {
  const d = new Date(date);
  d.setDate(d.getDate() - d.getDay());
  d.setHours(0, 0, 0, 0);
  return d;
}

function toDateStr(date) {
  return date.toISOString().split('T')[0];
}

function WeeklyView({ todos, onUpdate, onDelete }) {
  const [weekStart, setWeekStart] = useState(() => getWeekStart(new Date()));

  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(weekStart);
    d.setDate(weekStart.getDate() + i);
    return d;
  });

  const todayStr = toDateStr(new Date());

  const prev = () => {
    const d = new Date(weekStart);
    d.setDate(d.getDate() - 7);
    setWeekStart(d);
  };

  const next = () => {
    const d = new Date(weekStart);
    d.setDate(d.getDate() + 7);
    setWeekStart(d);
  };

  const goToday = () => setWeekStart(getWeekStart(new Date()));

  const weekTodos = todos.filter(t => {
    if (!t.date) return false;
    const ds = toDateStr(weekDays[0]);
    const de = toDateStr(weekDays[6]);
    return t.date >= ds && t.date <= de;
  });

  const weekLabel = `${weekDays[0].getMonth() + 1}월 ${weekDays[0].getDate()}일 — ${weekDays[6].getMonth() + 1}월 ${weekDays[6].getDate()}일`;

  return (
    <div>
      <div className="weekly-nav">
        <button className="nav-btn" onClick={prev} aria-label="이전 주">
          <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M10 3L5 8l5 5"/>
          </svg>
        </button>
        <div className="nav-center">
          <div className="week-range">{weekLabel}</div>
          <button className="today-btn" onClick={goToday}>오늘</button>
        </div>
        <button className="nav-btn" onClick={next} aria-label="다음 주">
          <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M6 3l5 5-5 5"/>
          </svg>
        </button>
      </div>

      <div className="week-grid">
        {weekDays.map((day, i) => {
          const ds = toDateStr(day);
          const dayTodos = todos.filter(t => t.date === ds);
          const isToday = ds === todayStr;
          const done = dayTodos.filter(t => t.completed).length;

          return (
            <div key={ds} className={`day-col ${isToday ? 'is-today' : ''}`}>
              <div className="day-header">
                <div className={`day-name ${i === 0 ? 'sun' : i === 6 ? 'sat' : ''}`}>
                  {DAY_NAMES[i]}
                </div>
                <div className="day-num">{day.getDate()}</div>
                {dayTodos.length > 0 && (
                  <div className="day-count">{done}/{dayTodos.length}</div>
                )}
              </div>
              <div className="day-todos">
                {dayTodos.map(todo => (
                  <div
                    key={todo.id}
                    className={`week-todo-item p-${todo.priority} ${todo.completed ? 'done' : ''}`}
                    onClick={() => onUpdate(todo.id, { completed: !todo.completed })}
                    title={todo.text}
                  >
                    <span className="week-dot" />
                    <span>{todo.text}</span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <div className="weekly-stats">
        이번 주: 전체 {weekTodos.length}개 &nbsp;|&nbsp; 완료 {weekTodos.filter(t => t.completed).length}개 &nbsp;|&nbsp; 진행중 {weekTodos.filter(t => !t.completed).length}개
      </div>
    </div>
  );
}

export default WeeklyView;
