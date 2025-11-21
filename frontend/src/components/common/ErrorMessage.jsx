import './ErrorMessage.css';

const ErrorMessage = ({ 
  message = 'Something went wrong', 
  onRetry, 
  type = 'error',
  fullPage = false 
}) => {
  const icons = {
    error: 'fa-exclamation-circle',
    warning: 'fa-exclamation-triangle',
    info: 'fa-info-circle',
    network: 'fa-wifi'
  };

  const ErrorContent = () => (
    <div className={`error-message ${type}`}>
      <div className="error-icon">
        <i className={`fas ${icons[type] || icons.error}`}></i>
      </div>
      <div className="error-content">
        <h3>{type === 'network' ? 'Connection Error' : 'Oops!'}</h3>
        <p>{message}</p>
        {onRetry && (
          <button onClick={onRetry} className="btn-retry">
            <i className="fas fa-redo"></i> Try Again
          </button>
        )}
      </div>
    </div>
  );

  if (fullPage) {
    return (
      <div className="error-page">
        <ErrorContent />
      </div>
    );
  }

  return <ErrorContent />;
};

export default ErrorMessage;
