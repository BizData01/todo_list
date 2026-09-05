import { useState, useRef } from 'react';

const PRIORITY_LABELS = { urgent: '긴급', high: '높음', medium: '보통', low: '낮음' };

function dateStatus(dateStr) {
  if (!dateStr) return null;
  const d = new Date(dateStr + 'T00:00:00');
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  if (d < now) return 'overdue';
  if (d.getTime() === now.getTime()) return 'today';
  return 'upcoming';
}

function formatDate(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr + 'T00:00:00');
  const status = dateStatus(dateStr);
  if (status === 'today') return '오늘';
  return d.toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' });
}

function TodoItem({ todo, onUpdate, onDelete, onReorder }) {
  const [editing, setEditing] = useState(false);
  const [editText, setEditText] = useState(todo.text);
  const dragRef = useRef(null);

  const commitEdit = () => {
    if (editText.trim()) {
      onUpdate(todo.id, { text: editText.trim() });
    }
    setEditing(false);
  };

  const handleEditKeyDown = (e) => {
    if (e.key === 'Enter') commitEdit();
    if (e.key === 'Escape') { setEditText(todo.text); setEditing(false); }
  };

  const handleDelete = () => {
    const el = dragRef.current;
    if (el) el.classList.add('removing');
    setTimeout(() => onDelete(todo.id), 220);
  };

  // Drag handlers
  const onDragStart = (e) => {
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', String(todo.id));
    setTimeout(() => dragRef.current?.classList.add('dragging'), 0);
  };

  const onDragEnd = () => {
    dragRef.current?.classList.remove('dragging');
  };

  const onDragOver = (e) => {
    e.preventDefault();
    dragRef.current?.classList.add('drag-over');
  };

  const onDragLeave = () => {
    dragRef.current?.classList.remove('drag-over');
  };

  const onDrop = (e) => {
    e.preventDefault();
    dragRef.current?.classList.remove('drag-over');
    const fromId = Number(e.dataTransfer.getData('text/plain'));
    if (fromId !== todo.id) onReorder(fromId, todo.id);
  };

  const status = dateStatus(todo.date);

  return (
    <div
      ref={dragRef}
      className={`todo-item p-${todo.priority} ${todo.completed ? 'completed' : ''}`}
      draggable
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
    >
      <div className="drag-handle" title="드래그하여 순서 변경">
        <svg viewBox="0 0 16 16" fill="currentColor">
          <circle cx="5" cy="4" r="1.2"/>
          <circle cx="11" cy="4" r="1.2"/>
          <circle cx="5" cy="8" r="1.2"/>
          <circle cx="11" cy="8" r="1.2"/>
          <circle cx="5" cy="12" r="1.2"/>
          <circle cx="11" cy="12" r="1.2"/>
        </svg>
      </div>

      <button
        className={`checkbox-btn ${todo.completed ? 'checked' : ''}`}
        onClick={() => onUpdate(todo.id, { completed: !todo.completed })}
        aria-label={todo.completed ? '미완료로 표시' : '완료로 표시'}
      >
        {todo.completed && (
          <svg viewBox="0 0 11 9" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M1 4.5L4 7.5L10 1"/>
          </svg>
        )}
      </button>

      <div className="todo-body">
        {editing ? (
          <input
            className="edit-input"
            value={editText}
            onChange={e => setEditText(e.target.value)}
            onBlur={commitEdit}
            onKeyDown={handleEditKeyDown}
            autoFocus
          />
        ) : (
          <div
            className={`todo-text ${todo.completed ? 'done' : ''}`}
            onDoubleClick={() => { setEditing(true); setEditText(todo.text); }}
            title="더블클릭하여 수정"
          >
            {todo.text}
          </div>
        )}
        <div className="todo-meta">
          <span className={`priority-badge badge-${todo.priority}`}>
            {PRIORITY_LABELS[todo.priority] || todo.priority}
          </span>
          {todo.date && (
            <span className={`due-date due-${status}`}>
              <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5">
                <rect x="1" y="2" width="10" height="9" rx="1.5"/>
                <line x1="1" y1="5" x2="11" y2="5"/>
                <line x1="4" y1="1" x2="4" y2="3"/>
                <line x1="8" y1="1" x2="8" y2="3"/>
              </svg>
              {status === 'overdue' ? `${formatDate(todo.date)} (지남)` : formatDate(todo.date)}
            </span>
          )}
        </div>
      </div>

      <div className="todo-actions">
        <button
          className="icon-btn"
          onClick={() => { setEditing(true); setEditText(todo.text); }}
          title="수정"
        >
          <svg viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
            <path d="M9.5 1.5l3 3L4 13H1v-3L9.5 1.5z"/>
          </svg>
        </button>
        <button className="icon-btn del" onClick={handleDelete} title="삭제">
          <svg viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
            <path d="M2 3.5h10M5.5 3.5V2h3v1.5M5.5 6v5M8.5 6v5M3 3.5l.5 8h7l.5-8"/>
          </svg>
        </button>
      </div>
    </div>
  );
}

export default TodoItem;
