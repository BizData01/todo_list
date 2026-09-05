import { useState } from 'react';

const PRIORITIES = [
  { key: 'urgent', label: '긴급' },
  { key: 'high',   label: '높음' },
  { key: 'medium', label: '보통' },
  { key: 'low',    label: '낮음' },
];

function TodoForm({ onAdd }) {
  const [text, setText] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [priority, setPriority] = useState('medium');

  const submit = (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    onAdd(text.trim(), date, priority);
    setText('');
    setDate(new Date().toISOString().split('T')[0]);
    setPriority('medium');
  };

  return (
    <form className="todo-form" onSubmit={submit}>
      <div className="form-row">
        <input
          className="form-input"
          type="text"
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder="할 일을 입력하세요..."
          autoComplete="off"
        />
        <input
          className="form-input form-date"
          type="date"
          value={date}
          onChange={e => setDate(e.target.value)}
        />
      </div>
      <div className="form-meta">
        <div className="priority-group">
          {PRIORITIES.map(p => (
            <button
              key={p.key}
              type="button"
              className={`priority-pill p-${p.key} ${priority === p.key ? 'active' : ''}`}
              onClick={() => setPriority(p.key)}
            >
              {p.label}
            </button>
          ))}
        </div>
        <button className="add-btn" type="submit">추가</button>
      </div>
    </form>
  );
}

export default TodoForm;
