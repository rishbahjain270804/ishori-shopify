import { useState } from 'react';
import './BulkActions.css';

const BulkActions = ({ selectedCount, onBulkStatusUpdate, onBulkDelete, onClearSelection }) => {
  const [showStatusMenu, setShowStatusMenu] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showStatusConfirm, setShowStatusConfirm] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState('');
  const [loading, setLoading] = useState(false);

  const handleStatusSelect = (status) => {
    setSelectedStatus(status);
    setShowStatusMenu(false);
    setShowStatusConfirm(true);
  };

  const handleConfirmStatusUpdate = async () => {
    setLoading(true);
    try {
      await onBulkStatusUpdate(selectedStatus);
      setShowStatusConfirm(false);
      setSelectedStatus('');
    } catch (error) {
      console.error('Error updating status:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmDelete = async () => {
    setLoading(true);
    try {
      await onBulkDelete();
      setShowDeleteConfirm(false);
    } catch (error) {
      console.error('Error deleting products:', error);
    } finally {
      setLoading(false);
    }
  };

  if (selectedCount === 0) {
    return null;
  }

  return (
    <>
      <div className="bulk-actions-bar">
        <div className="bulk-actions-info">
          <span className="selected-count">{selectedCount} product{selectedCount !== 1 ? 's' : ''} selected</span>
          <button 
            className="btn-clear-selection" 
            onClick={onClearSelection}
            disabled={loading}
          >
            Clear Selection
          </button>
        </div>

        <div className="bulk-actions-buttons">
          <div className="bulk-action-dropdown">
            <button
              className="btn-bulk-action btn-status"
              onClick={() => setShowStatusMenu(!showStatusMenu)}
              disabled={loading}
            >
              Update Status
            </button>
            {showStatusMenu && (
              <div className="dropdown-menu">
                <button onClick={() => handleStatusSelect('active')}>
                  Set as Active
                </button>
                <button onClick={() => handleStatusSelect('inactive')}>
                  Set as Inactive
                </button>
                <button onClick={() => handleStatusSelect('out-of-stock')}>
                  Set as Out of Stock
                </button>
                <button onClick={() => handleStatusSelect('discontinued')}>
                  Set as Discontinued
                </button>
              </div>
            )}
          </div>

          <button
            className="btn-bulk-action btn-delete"
            onClick={() => setShowDeleteConfirm(true)}
            disabled={loading}
          >
            Delete Selected
          </button>
        </div>
      </div>

      {/* Status Update Confirmation Dialog */}
      {showStatusConfirm && (
        <div className="modal-overlay" onClick={() => !loading && setShowStatusConfirm(false)}>
          <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Confirm Status Update</h3>
              <button 
                className="modal-close" 
                onClick={() => setShowStatusConfirm(false)}
                disabled={loading}
              >
                ×
              </button>
            </div>
            <div className="modal-body">
              <p>
                Are you sure you want to update the status of <strong>{selectedCount}</strong> product{selectedCount !== 1 ? 's' : ''} to <strong>{selectedStatus}</strong>?
              </p>
              <p className="warning-text">This action will affect all selected products.</p>
            </div>
            <div className="modal-footer">
              <button
                className="btn-secondary"
                onClick={() => setShowStatusConfirm(false)}
                disabled={loading}
              >
                Cancel
              </button>
              <button
                className="btn-primary"
                onClick={handleConfirmStatusUpdate}
                disabled={loading}
              >
                {loading ? 'Updating...' : 'Confirm Update'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      {showDeleteConfirm && (
        <div className="modal-overlay" onClick={() => !loading && setShowDeleteConfirm(false)}>
          <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Confirm Deletion</h3>
              <button 
                className="modal-close" 
                onClick={() => setShowDeleteConfirm(false)}
                disabled={loading}
              >
                ×
              </button>
            </div>
            <div className="modal-body">
              <p>
                Are you sure you want to delete <strong>{selectedCount}</strong> product{selectedCount !== 1 ? 's' : ''}?
              </p>
              <p className="warning-text danger">
                ⚠️ This action cannot be undone. All product data, including images and reviews, will be permanently deleted.
              </p>
            </div>
            <div className="modal-footer">
              <button
                className="btn-secondary"
                onClick={() => setShowDeleteConfirm(false)}
                disabled={loading}
              >
                Cancel
              </button>
              <button
                className="btn-danger"
                onClick={handleConfirmDelete}
                disabled={loading}
              >
                {loading ? 'Deleting...' : 'Delete Products'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default BulkActions;
