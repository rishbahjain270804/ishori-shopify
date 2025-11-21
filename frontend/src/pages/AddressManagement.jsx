import { useState, useEffect } from 'react';
import axios from 'axios';
import './AddressManagement.css';
import AddressForm from '../components/user/AddressForm';
import AddressList from '../components/user/AddressList';

const AddressManagement = () => {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);

  useEffect(() => {
    fetchAddresses();
  }, []);

  const fetchAddresses = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/users/addresses`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setAddresses(response.data.addresses || []);
    } catch (error) {
      console.error('Error fetching addresses:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddNew = () => {
    setEditingAddress(null);
    setShowForm(true);
  };

  const handleEdit = (address) => {
    setEditingAddress(address);
    setShowForm(true);
  };

  const handleDelete = async (addressId) => {
    if (!confirm('Are you sure you want to delete this address?')) return;

    try {
      const token = localStorage.getItem('token');
      await axios.delete(
        `${import.meta.env.VITE_API_URL}/api/users/addresses/${addressId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchAddresses();
    } catch (error) {
      alert('Failed to delete address');
    }
  };

  const handleSetDefault = async (addressId) => {
    try {
      const token = localStorage.getItem('token');
      const address = addresses.find(a => a._id === addressId);
      await axios.put(
        `${import.meta.env.VITE_API_URL}/api/users/addresses/${addressId}`,
        { ...address, isDefault: true },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchAddresses();
    } catch (error) {
      alert('Failed to set default address');
    }
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    setEditingAddress(null);
    fetchAddresses();
  };

  if (loading) {
    return <div className="loading">Loading addresses...</div>;
  }

  return (
    <div className="address-management">
      <div className="page-header">
        <h1>My Addresses</h1>
        <button onClick={handleAddNew} className="btn-primary">
          <i className="fas fa-plus"></i> Add New Address
        </button>
      </div>

      {showForm ? (
        <AddressForm
          address={editingAddress}
          onSuccess={handleFormSuccess}
          onCancel={() => setShowForm(false)}
        />
      ) : (
        <AddressList
          addresses={addresses}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onSetDefault={handleSetDefault}
        />
      )}
    </div>
  );
};

export default AddressManagement;
