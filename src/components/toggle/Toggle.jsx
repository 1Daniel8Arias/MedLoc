import "./Toggle.css";

function Toggle({ checked, onChange, label, description }) {
  return (
    <label className="toggle">
      <span className="toggle__text">
        <strong>{label}</strong>
        {description && <span>{description}</span>}
      </span>
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} />
      <span className="toggle__track" aria-hidden="true" />
    </label>
  );
}

export default Toggle;
