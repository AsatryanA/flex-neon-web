import React, { useState, useEffect } from 'react';
import DataTable from '../../components/admin/DataTable';
import FormModal from '../../components/admin/FormModal';
import ImageUpload from '../../components/admin/ImageUpload';
import {
  getAdminPortfolio,
  createPortfolioItem,
  updatePortfolioItem,
  deletePortfolioItem,
} from '../../api/adminService';
import './PortfolioAdmin.css';

function PortfolioAdmin() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    category: 'QUOTES',
    color: '',
    imageUrl: '',
    displayOrder: 0,
    active: true,
  });

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const response = await getAdminPortfolio();
      setItems(response.data);
    } catch (error) {
      console.error('Failed to fetch portfolio items:', error);
      alert('Failed to load portfolio items');
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setEditingItem(null);
    setFormData({
      title: '',
      category: 'QUOTES',
      color: '',
      imageUrl: '',
      displayOrder: 0,
      active: true,
    });
    setIsModalOpen(true);
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setFormData({
      title: item.title,
      category: item.category,
      color: item.color,
      imageUrl: item.imageUrl,
      displayOrder: item.displayOrder,
      active: item.active,
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this item?')) return;

    try {
      await deletePortfolioItem(id);
      fetchItems();
    } catch (error) {
      console.error('Failed to delete item:', error);
      alert('Failed to delete item');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.imageUrl) {
      alert('Please upload an image');
      return;
    }

    try {
      if (editingItem) {
        await updatePortfolioItem(editingItem.id, formData);
      } else {
        await createPortfolioItem(formData);
      }
      setIsModalOpen(false);
      fetchItems();
    } catch (error) {
      console.error('Failed to save item:', error);
      alert('Failed to save item');
    }
  };

  const handleImageUploaded = (imageUrl) => {
    setFormData({ ...formData, imageUrl });
  };

  const columns = [
    { key: 'title', label: 'Title' },
    { key: 'category', label: 'Category' },
    {
      key: 'imageUrl',
      label: 'Image',
      render: (url) => (
        <img src={url} alt="Portfolio" style={{ width: '80px', height: '60px', objectFit: 'cover', borderRadius: '4px' }} />
      ),
    },
    { key: 'color', label: 'Color' },
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
    <div className="portfolio-admin">
      <div className="page-header">
        <h1>Portfolio Management</h1>
        <button onClick={handleAdd} className="btn-add">
          + Add New Item
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
        title={editingItem ? 'Edit Portfolio Item' : 'Add Portfolio Item'}
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
            <label>Category *</label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              required
            >
              <option value="QUOTES">Quotes</option>
              <option value="BUSINESS">Business</option>
              <option value="WEDDING">Wedding</option>
            </select>
          </div>

          <div className="form-group">
            <label>Color</label>
            <input
              type="text"
              value={formData.color}
              onChange={(e) => setFormData({ ...formData, color: e.target.value })}
              placeholder="#FF1493"
            />
          </div>

          <div className="form-group">
            <label>Image *</label>
            <ImageUpload
              onImageUploaded={handleImageUploaded}
              folder="portfolio"
            />
            {formData.imageUrl && (
              <div className="image-preview">
                <img src={formData.imageUrl} alt="Current" />
              </div>
            )}
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

export default PortfolioAdmin;
