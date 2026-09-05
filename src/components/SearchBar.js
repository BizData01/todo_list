function SearchBar({ searchTerm, onSearchChange }) {
  return (
    <div className="mb-4">
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        placeholder="할 일 검색..."
        className="form-control"
      />
    </div>
  );
}

export default SearchBar;
