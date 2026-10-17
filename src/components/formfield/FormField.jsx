import { useState } from "react";
import "./FormField.css";

// Si recibe "options" renderiza un <select>, de lo contrario un <input>.
// Si type="password", incluye botón para alternar visibilidad (mostrar/ocultar contraseña).
function FormField({ label, id, options, type, ...props }) {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";
  const actualType = isPassword ? (showPassword ? "text" : "password") : type;

  return (
    <div className="field">
      <label htmlFor={id} className="field__label">{label}</label>
      {options ? (
        <select id={id} className="field__control" {...props}>
          {options.map((option) => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>
      ) : isPassword ? (
        <div className="field__password-wrapper">
          <input
            id={id}
            type={actualType}
            className="field__control field__control--password"
            {...props}
          />
          <button
            type="button"
            className="field__toggle-password"
            onClick={() => setShowPassword((prev) => !prev)}
            title={showPassword ? "Ocultar contraseña" : "Ver contraseña"}
            aria-label={showPassword ? "Ocultar contraseña" : "Ver contraseña"}
          >
            {showPassword ? (
              // Icono ojo tachado (ocultar)
              <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                <line x1="1" y1="1" x2="23" y2="23"></line>
              </svg>
            ) : (
              // Icono ojo (ver)
              <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                <circle cx="12" cy="12" r="3"></circle>
              </svg>
            )}
          </button>
        </div>
      ) : (
        <input id={id} type={type} className="field__control" {...props} />
      )}
    </div>
  );
}

export default FormField;
