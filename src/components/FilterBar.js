const FILTERS = [
  { key: 'all', label: '전체' },
  { key: 'active', label: '진행중' },
  { key: 'completed', label: '완료' },
];

const PRIORITIES = [
  { key: 'all', label: '전체' },
  { key: 'urgent', label: '긴급' },
  { key: 'high', label: '높음' },
  { key: 'medium', label: '보통' },
  { key: 'low', label: '낮음' },
];

function FilterBar({
  searchTerm, onSearch,
  filter, onFilter,
  priorityFilter, onPriorityFilter,
  sortBy, onSort,
  completedCount, onClearCompleted,
}) {
  return (
    <div className="filter-bar mb-3">
      <div className="filter-search">
        <svg className="search-icon" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
          <circle cx="6.5" cy="6.5" r="5"/>
          <line x1="10.5" y1="10.5" x2="14" y2="14"/>
        </svg>
        <input
          type="text"
          value={searchTerm}
          onChange={e => onSearch(e.target.value)}
          placeholder="검색..."
        />
      </div>

      <div className="filter-row">
        <div className="filter-tabs">
          {FILTERS.map(f => (
            <button
              key={f.key}
              className={`filter-tab ${filter === f.key ? 'active' : ''}`}
              onClick={() => onFilter(f.key)}
            >
              {f.label}
            </button>
          ))}
        </div>

        <select
          className="sort-select"
          value={sortBy}
          onChange={e => onSort(e.target.value)}
        >
          <option value="created">최신순</option>
          <option value="date">마감순</option>
          <option value="priority">우선순위순</option>
        </select>

        {completedCount > 0 && (
          <button className="clear-btn" onClick={onClearCompleted}>
            완료 {completedCount}개 삭제
          </button>
        )}
      </div>

      <div className="filter-row">
        <div className="priority-filter-tabs">
          {PRIORITIES.map(p => (
            <button
              key={p.key}
              className={`pf-tab ${priorityFilter === p.key ? `active-${p.key}` : ''}`}
              onClick={() => onPriorityFilter(p.key)}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default FilterBar;
