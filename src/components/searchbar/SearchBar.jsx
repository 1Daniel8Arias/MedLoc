import "./SearchBar.css";

function SearchBar({ value, onChange, placeholder = "Buscar...", ...props }) {
  return (
    <label className="searchbar">
      <span className="searchbar__icon" aria-hidden="true">⌕</span>
      <input
        type="search"
        className="searchbar__input"
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        {...props}
      />
    </label>
  );
}

export default SearchBar;
