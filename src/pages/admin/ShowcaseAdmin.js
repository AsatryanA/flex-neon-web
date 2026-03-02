import React, { useState, useEffect } from 'react';
import DataTable from '../../components/admin/DataTable';
import FormModal from '../../components/admin/FormModal';
import {
  getAdminShowcase,
  createShowcaseItem,
  updateShowcaseItem,
  deleteShowcaseItem,
} from '../../api/adminService';
import './AdminPages.css';

function ShowcaseAdmin() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    color: '',
    displayOrder: 0,
    active: true,
  });

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const response = await getAdminShowcase();
      setItems(response.data);
    } catch (error) {
      console.error('Failed to fetch showcase items:', error);
      alert('Failed to load showcase items');
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setEditingItem(null);
    setFormData({ title: '', color: '', displayOrder: 0, active: true });
    setIsModalOpen(true);
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setFormData({
      title: item.title,
      color: item.color,
      displayOrder: item.displayOrder,
      active: item.active,
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this item?')) return;
    try {
      await deleteShowcaseItem(id);
      fetchItems();
    } catch (error) {
      console.error('Failed to delete item:', error);
      alert('Failed to delete item');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingItem) {
        await updateShowcaseItem(editingItem.id, formData);
      } else {
        await createShowcaseItem(formData);
      }
      setIsModalOpen(false);
      fetchItems();
    } catch (error) {
      console.error('Failed to save item:', error);
      alert('Failed to save item');
    }
  };

  const columns = [
    { key: 'title', label: 'Title' },
    {
      key: 'color',
      label: 'Color',
      render: (color) => (
        <span style={{ color: color, fontWeight: 'bold' }}>{color}</span>
      )
    },
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

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="admin-page">
      <div className="page-header">
        <h1>Showcase Management</h1>
        <button onClick={handleAdd} className="btn-add">
          + Add New Showcase Item
        </button>
      </div>

      <DataTable columns={columns} data={items} onEdit={handleEdit} onDelete={handleDelete} />

      <FormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingItem ? 'Edit Showcase Item' : 'Add Showcase Item'}
      >
        <form onSubmit={handleSubmit}>
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
            <label>Color *</label>
            <input
              type="text"
              value={formData.color}
              onChange={(e) => setFormData({ ...formData, color: e.target.value })}
              placeholder="pink, blue, purple, green"
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

export default ShowcaseAdmin;
