import './Button.css'

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  loading = false,
  disabled = false,
  icon,
  iconPosition = 'left',
  className = '',
  ...props
}) => {
  const classes = [
    'btn',
    `btn-${variant}`,
    `btn-${size}`,
    fullWidth && 'btn-full-width',
    loading && 'btn-loading',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <button className={classes} disabled={disabled || loading} {...props}>
      {loading ? (
        <span className="btn-spinner"></span>
      ) : (
        <>
          {icon && iconPosition === 'left' && <span className="btn-icon">{icon}</span>}
          <span className="btn-text">{children}</span>
          {icon && iconPosition === 'right' && <span className="btn-icon">{icon}</span>}
        </>
      )}
    </button>
  )
}

export default Button
