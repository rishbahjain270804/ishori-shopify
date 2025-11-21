import { useState, useEffect } from 'react';
import axios from 'axios';
import './StockHistory.css';

const StockHistory = ({ product, onClose }) => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/admin/inventory/${product._id}/history`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setHistory(response.data.data);
    } catch (error) {
      console.error('Error fetching history:', error);
    } finally {
      setLoading(false);
    }
  };

  const getTypeIcon = (type) => {
    const icons = {
      add: 'fa-plus-circle',
      remove: 'fa-minus-circle',
      order: 'fa-shopping-cart',
      cancellation: 'fa-undo',
      adjustment: 'fa-edit',
      return: 'fa-reply'
    };
    return icons[type] || 'fa-circle';
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content history-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Stock History - {product.name}</h2>
          <button onClick={onClose} className="close-btn">×</button>
        </div>
        
        <div className="history-content">
          {loading ? (
            <div className="loading">Loading history...</div>
          ) : history.length === 0 ? (
            <div className="empty">No stock history available</div>
          ) : (
            <div className="history-list">
              {history.map((log) => (
                <div key={log._id} className="history-item">
                  <div className="history-icon">
                    <i className={`fas ${getTypeIcon(log.type)}`}></i>
                  </div>
                  <div className="history-details">
                    <div className="history-header">
                      <strong>{log.type.toUpperCase()}</strong>
                      <span className="history-date">
                        {new Date(log.createdAt).toLocaleString()}
                      </span>
                    </div>
                    <p>{log.reason}</p>
                    <div className="history-meta">
                      <span>Size: {log.size}</span>
                      <span>Quantity: {log.quantity}</span>
                      <span>Stock: {log.previousStock} → {log.newStock}</span>
                      {log.user && <span>By: {log.user.firstName} {log.user.lastName}</span>}
                    </div>
                    {log.notes && <p className="notes">{log.notes}</p>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StockHistory;
