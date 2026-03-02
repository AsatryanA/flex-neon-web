import React, { useState, useEffect } from 'react';
import DataTable from '../../components/admin/DataTable';
import FormModal from '../../components/admin/FormModal';
import {
  getAdminFeatures,
  createFeature,
  updateFeature,
  deleteFeature,
} from '../../api/adminService';
import './AdminPages.css';

function FeaturesAdmin() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    icon: '',
    title: '',
    description: '',
    displayOrder: 0,
    active: true,
  });

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const response = await getAdminFeatures();
      setItems(response.data);
    } catch (error) {
      console.error('Failed to fetch features:', error);
      alert('Failed to load features');
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setEditingItem(null);
    setFormData({
      icon: '',
      title: '',
      description: '',
      displayOrder: 0,
      active: true,
    });
    setIsModalOpen(true);
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setFormData({
      icon: item.icon,
      title: item.title,
      description: item.description,
      displayOrder: item.displayOrder,
      active: item.active,
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this feature?')) return;

    try {
      await deleteFeature(id);
      fetchItems();
    } catch (error) {
      console.error('Failed to delete feature:', error);
      alert('Failed to delete feature');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingItem) {
        await updateFeature(editingItem.id, formData);
      } else {
        await createFeature(formData);
      }
      setIsModalOpen(false);
      fetchItems();
    } catch (error) {
      console.error('Failed to save feature:', error);
      alert('Failed to save feature');
    }
  };

  const columns = [
    { key: 'icon', label: 'Icon' },
    { key: 'title', label: 'Title' },
    { key: 'description', label: 'Description' },
    { key: 'displayOrder', label: 'Order' },
    {
      key: 'active',
      label: 'Status',
      render: (active) => (
        <span className={active ? 'status-active' : 'status-inactive'}>
          {active ? 'Active' : 'Inactive'}
        </span>
      ),
    },
  ];

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="admin-page">
      <div className="page-header">
        <h1>Features Management</h1>
        <button onClick={handleAdd} className="btn-add">
          + Add New Feature
        </button>
      </div>

      <DataTable
        columns={columns}
        data={items}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <FormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingItem ? 'Edit Feature' : 'Add Feature'}
      >
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Icon (Emoji) *</label>
            <input
              type="text"
              value={formData.icon}
              onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
              placeholder="✨"
              required
            />
          </div>

          <div className="form-group">
            <label>Title *</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label>Description *</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows="4"
              required
            />
          </div>

          <div className="form-group">
            <label>Display Order</label>
            <input
              type="number"
              value={formData.displayOrder}
              onChange={(e) => setFormData({ ...formData, displayOrder: parseInt(e.target.value) })}
            />
          </div>

          <div className="form-group">
            <label>
              <input
                type="checkbox"
                checked={formData.active}
                onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
              />
              {' '}Active
            </label>
          </div>

          <div className="form-actions">
            <button type="button" onClick={() => setIsModalOpen(false)} className="btn-cancel">
              Cancel
            </button>
            <button type="submit" className="btn-submit">
              {editingItem ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </FormModal>
    </div>
  );
}

export default FeaturesAdmin;
