import './Input.css'

const Input = ({
  label,
  error,
  helperText,
  icon,
  iconPosition = 'left',
  fullWidth = false,
  className = '',
  ...props
}) => {
  const inputClasses = [
    'input',
    error && 'input-error',
    icon && `input-with-icon-${iconPosition}`,
    fullWidth && 'input-full-width',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <div className={`input-wrapper ${fullWidth ? 'input-wrapper-full-width' : ''}`}>
      {label && (
        <label className="input-label" htmlFor={props.id || props.name}>
          {label}
          {props.required && <span className="input-required">*</span>}
        </label>
      )}
      <div className="input-container">
        {icon && iconPosition === 'left' && <span className="input-icon input-icon-left">{icon}</span>}
        <input className={inputClasses} {...props} />
        {icon && iconPosition === 'right' && <span className="input-icon input-icon-right">{icon}</span>}
      </div>
      {error && <span className="input-error-text">{error}</span>}
      {helperText && !error && <span className="input-helper-text">{helperText}</span>}
    </div>
  )
}

export default Input
