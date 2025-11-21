const AddressList = ({ addresses, onEdit, onDelete, onSetDefault }) => {
  if (addresses.length === 0) {
    return (
      <div className="empty-state">
        <i className="fas fa-map-marker-alt"></i>
        <p>No addresses saved yet</p>
        <p>Add your first address to get started</p>
      </div>
    );
  }

  return (
    <div className="address-list">
      {addresses.map((address) => (
        <div key={address._id} className="address-card">
          <div className="address-header">
            <span className="address-type">{address.type}</span>
            {address.isDefault && <span className="badge-default">Default</span>}
          </div>
          <div className="address-content">
            <p><strong>{address.fullName}</strong></p>
            <p>{address.addressLine1}</p>
            {address.addressLine2 && <p>{address.addressLine2}</p>}
            <p>{address.city}, {address.state} {address.pincode}</p>
            <p>{address.country}</p>
            <p><i className="fas fa-phone"></i> {address.phone}</p>
          </div>
          <div className="address-actions">
            {!address.isDefault && (
              <button onClick={() => onSetDefault(address._id)} className="btn-link">
                Set as Default
              </button>
            )}
            <button onClick={() => onEdit(address)} className="btn-link">
              <i className="fas fa-edit"></i> Edit
            </button>
            <button onClick={() => onDelete(address._id)} className="btn-link danger">
              <i className="fas fa-trash"></i> Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AddressList;
