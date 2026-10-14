import "./StarRating.css";

// Solo lectura: <StarRating value={4.6} />  ·  Editable: <StarRating value={n} onChange={setN} />
function StarRating({ value = 0, onChange, size = 18, label = "Calificación" }) {
  if (onChange) {
    return (
      <div className="stars stars--input" role="radiogroup" aria-label={label} style={{ fontSize: size }}>
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            type="button"
            role="radio"
            aria-checked={value === n}
            aria-label={`${n} ${n === 1 ? "estrella" : "estrellas"}`}
            className={n <= value ? "stars__btn stars__btn--on" : "stars__btn"}
            onClick={() => onChange(n)}
          >
            ★
          </button>
        ))}
      </div>
    );
  }

  const percent = (Math.max(0, Math.min(5, value)) / 5) * 100;
  return (
    <span className="stars" style={{ fontSize: size }} role="img" aria-label={`${value} de 5 estrellas`}>
      <span className="stars__base">★★★★★</span>
      <span className="stars__fill" style={{ width: `${percent}%` }}>★★★★★</span>
    </span>
  );
}

export default StarRating;
