import './Button.css';

function Button({
  children,
  onClick,
  type = 'button',
  variant = 'primary',
  disabled = false,
  ...rest
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`btn btn--${variant}`}
      {...rest}
    >
      {children}
    </button>
  );
}

export default Button;
