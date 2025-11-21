import './EmptyState.css';

const EmptyState = ({ 
  icon = 'fa-inbox',
  title = 'No items found',
  message = 'There are no items to display',
  action,
  actionLabel = 'Add New'
}) => {
  return (
    <div className="empty-state">
      <div className="empty-icon">
        <i className={`fas ${icon}`}></i>
      </div>
      <h3>{title}</h3>
      <p>{message}</p>
      {action && (
        <button onClick={action} className="btn-primary">
          <i className="fas fa-plus"></i> {actionLabel}
        </button>
      )}
    </div>
  );
};

export default EmptyState;
