import "./FormField.css";

// Si recibe "options" renderiza un <select>, de lo contrario un <input>.
function FormField({ label, id, options, ...props }) {
  return (
    <div className="field">
      <label htmlFor={id} className="field__label">{label}</label>
      {options ? (
        <select id={id} className="field__control" {...props}>
          {options.map((option) => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>
      ) : (
        <input id={id} className="field__control" {...props} />
      )}
    </div>
  );
}

export default FormField;
