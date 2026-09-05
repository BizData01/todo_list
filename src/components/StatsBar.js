function StatsBar({ stats }) {
  const pct = stats.total === 0 ? 0 : Math.round((stats.completed / stats.total) * 100);

  return (
    <div className="stats-bar">
      <div className="stat-card stat-total">
        <div className="stat-label">전체</div>
        <div className="stat-value">{stats.total}</div>
        <div className="progress-bar-wrap">
          <div className="progress-bar-fill" style={{ width: `${pct}%` }} />
        </div>
      </div>
      <div className="stat-card stat-active">
        <div className="stat-label">진행중</div>
        <div className="stat-value">{stats.active}</div>
        <div className="progress-bar-wrap">
          <div className="progress-bar-fill" style={{ width: stats.total ? `${(stats.active / stats.total) * 100}%` : '0%' }} />
        </div>
      </div>
      <div className="stat-card stat-done">
        <div className="stat-label">완료 {pct}%</div>
        <div className="stat-value">{stats.completed}</div>
        <div className="progress-bar-wrap">
          <div className="progress-bar-fill" style={{ width: `${pct}%` }} />
        </div>
      </div>
    </div>
  );
}

export default StatsBar;
