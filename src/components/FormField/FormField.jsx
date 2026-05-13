import './FormField.css';

function FormField({
  id,
  name,
  label,
  type = 'text',
  value,
  onChange,
  error,
  required = false,
  options = [],
  rows = 4,
  ...rest
}) {
  const errorId = error ? `${id}-error` : undefined;

  const commonProps = {
    id,
    name,
    value,
    onChange,
    'aria-invalid': !!error,
    'aria-describedby': errorId,
    className: 'form-field__input',
    ...rest,
  };

  const renderInput = () => {
    if (type === 'select') {
      return (
        <select {...commonProps}>
          <option value=''>-- Please select --</option>
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      );
    }

    if (type === 'textarea') {
      return <textarea {...commonProps} rows={rows} />;
    }

    return <input type={type} {...commonProps} />;
  };

  return (
    <div className='form-field'>
      <label htmlFor={id} className='form-field__label'>
        {label} {required && <span aria-hidden='true'>*</span>}
      </label>
      {renderInput()}
      {error && (
        <span id={errorId} className='form-field__error' role='alert'>
          {error}
        </span>
      )}
    </div>
  );
}

export default FormField;
