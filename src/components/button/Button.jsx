import "./Button.css";

function Button({
  children,
  variant = "primary",
  size = "md",
  type = "button",
  fullWidth = false,
  className = "",
  ...props
}) {
  const classes = ["btn", `btn--${variant}`, `btn--${size}`, fullWidth && "btn--full", className]
    .filter(Boolean)
    .join(" ");

  return (
    <button type={type} className={classes} {...props}>
      {children}
    </button>
  );
}

export default Button;
